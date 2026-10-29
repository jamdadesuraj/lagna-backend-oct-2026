/**
 * matchProfile.service.ts
 *
 * Drop this file into:
 *   backend/src/app/services/matchProfile.service.ts
 *
 * Computes a weighted "% Match" between two profiles using BOTH users'
 * partner preferences (not just profile-to-profile similarity).
 *
 * Weight table (must total 100):
 *   Age Preference        - 10%
 *   Religion / Community  - 10%
 *   Caste / Sub-caste     - 8%
 *   Location              - 8%
 *   Education             - 10%
 *   Profession            - 10%
 *   Income Range          - 8%
 *   Height Preference     - 5%
 *   Marital Status        - 8%
 *   Mother Tongue         - 5%
 *   Lifestyle             - 7%
 *   Family Type/Values    - 5%
 *   Horoscope/Manglik     - 4%
 *   Interests & Hobbies   - 2%
 */

import { PopulateOptions } from 'mongoose';
import { Profile } from '../modules/profile-details/profile.model';
import { PartnerPreference } from '../modules/profile-details/partner-preference/partnerPreference.model';
import { Height } from '../modules/admin/height/height.model';

const WEIGHTS = {
  age: 10,
  religion: 10,
  caste: 8,
  location: 8,
  education: 10,
  profession: 10,
  income: 8,
  height: 5,
  maritalStatus: 8,
  motherTongue: 5,
  lifestyle: 7,
  familyType: 5,
  horoscope: 4,
  interests: 2,
};

// Sanity check at module load — should always equal 100
const TOTAL_WEIGHT = Object.values(WEIGHTS).reduce((a, b) => a + b, 0);

type FieldKey = keyof typeof WEIGHTS;

/**
 * Score (0..1) given to a factor when the user has NOT set a preference for it.
 * Previously a missing preference counted as a perfect 1 (100%), which pushed
 * almost every pair above 90%. Lower this value to be stricter, raise it to be
 * more lenient. An explicit "Doesn't matter" choice still counts as a full 1.
 */
const MISSING_PREFERENCE_SCORE = 0.5;

// Read by the scorers below. Only checkMandatory() temporarily switches it to 1.
let missingPreferenceScore = MISSING_PREFERENCE_SCORE;

export interface FieldResult {
  field: FieldKey;
  weight: number;
  score: number; // 0..1 fit before weighting
  points: number; // score * weight
}

/**
 * NOTE ON MANDATORY FIELDS:
 * PartnerPreference does not yet store which fields are mandatory.
 * Add this to partnerPreference.model.ts before using hard filters:
 *
 *   mandatoryFields: {
 *     type: [String],
 *     default: [],
 *   },
 *
 * Values should be a subset of the FieldKey names above, e.g.
 * ["religion", "maritalStatus"].
 */

// ---------- helpers ----------

const norm = (v?: string | null) => (v ? v.trim().toLowerCase() : '');

const eqOrDoesntMatter = (
  preferenceList: string[] | undefined,
  actual?: string,
) => {
  if (!preferenceList || preferenceList.length === 0)
    return missingPreferenceScore; // no preference set = reduced score
  if (
    preferenceList.some(
      (p) => norm(p) === "doesn't matter" || norm(p) === 'no preference',
    )
  )
    return 1;
  if (!actual) return 0.5; // unknown data, partial credit
  return preferenceList.some((p) => norm(p) === norm(actual)) ? 1 : 0;
};

const inRange = (value: number | undefined, min?: number, max?: number) => {
  if (min === undefined && max === undefined) return missingPreferenceScore; // no preference set
  if (value === undefined) return 0.5;
  if (min !== undefined && value < min) return 0;
  if (max !== undefined && value > max) return 0;
  return 1;
};

// ---------- per-field scorers (bidirectional) ----------
// Each takes profileA/preferenceA and profileB/preferenceB and returns 0..1

function scoreAge(pA: any, prA: any, pB: any, prB: any): number {
  const aWantsB = inRange(
    pB?.basicDetails?.age,
    prA?.basicDetails?.age?.minAge,
    prA?.basicDetails?.age?.maxAge,
  );
  const bWantsA = inRange(
    pA?.basicDetails?.age,
    prB?.basicDetails?.age?.minAge,
    prB?.basicDetails?.age?.maxAge,
  );
  return (aWantsB + bWantsA) / 2;
}

function scoreReligion(pA: any, prA: any, pB: any, prB: any): number {
  // religionAndEthnicity.religion.preference is a single ObjectId ref -> needs populate to compare names
  const aWantsB = !prA?.religionAndEthnicity?.religion?.preference
    ? missingPreferenceScore
    : norm(prA.religionAndEthnicity.religion.preference?.religion) ===
        norm(pB?.religionDetails?.religion)
      ? 1
      : 0;
  const bWantsA = !prB?.religionAndEthnicity?.religion?.preference
    ? missingPreferenceScore
    : norm(prB.religionAndEthnicity.religion.preference?.religion) ===
        norm(pA?.religionDetails?.religion)
      ? 1
      : 0;
  return (aWantsB + bWantsA) / 2;
}

function scoreCaste(pA: any, prA: any, pB: any, prB: any): number {
  const listA: string[] = (
    prA?.religionAndEthnicity?.caste?.preferences || []
  ).map((c: any) => c.caste);
  const listB: string[] = (
    prB?.religionAndEthnicity?.caste?.preferences || []
  ).map((c: any) => c.caste);
  const aWantsB =
    listA.length === 0
      ? missingPreferenceScore
      : listA.some((c) => norm(c) === norm(pB?.religionDetails?.caste))
        ? 1
        : 0;
  const bWantsA =
    listB.length === 0
      ? missingPreferenceScore
      : listB.some((c) => norm(c) === norm(pA?.religionDetails?.caste))
        ? 1
        : 0;

  // sub-caste as a bonus nudge within the same weight bucket
  const subA: string[] = (
    prA?.religionAndEthnicity?.subCaste?.preferences || []
  ).map((s: any) => s.subCaste);
  const subB: string[] = (
    prB?.religionAndEthnicity?.subCaste?.preferences || []
  ).map((s: any) => s.subCaste);
  const aSub =
    subA.length === 0
      ? missingPreferenceScore
      : subA.some((s) => norm(s) === norm(pB?.religionDetails?.subCaste))
        ? 1
        : 0;
  const bSub =
    subB.length === 0
      ? missingPreferenceScore
      : subB.some((s) => norm(s) === norm(pA?.religionDetails?.subCaste))
        ? 1
        : 0;

  return (aWantsB + bWantsA + aSub + bSub) / 4;
}

function scoreLocation(pA: any, prA: any, pB: any, prB: any): number {
  // How well `actual` (city/state of the other profile) fits one user's preference
  const fit = (
    preferred: string[] | undefined,
    actual: string | undefined,
  ): number => {
    if (!preferred || preferred.length === 0) return missingPreferenceScore; // not set
    return preferred.some((c: string) => norm(c) === norm(actual)) ? 1 : 0.3;
  };

  const aWantsB =
    fit(prA?.basicDetails?.partnerCity, pB?.locationDetails?.city) * 0.5 +
    fit(prA?.basicDetails?.partnerState, pB?.locationDetails?.state) * 0.5;
  const bWantsA =
    fit(prB?.basicDetails?.partnerCity, pA?.locationDetails?.city) * 0.5 +
    fit(prB?.basicDetails?.partnerState, pA?.locationDetails?.state) * 0.5;
  return (aWantsB + bWantsA) / 2;
}

function scoreEducation(pA: any, prA: any, pB: any, prB: any): number {
  const fit = (pref: any, actualQualification?: string): number => {
    if (pref?.educationDetails?.doesntMatter) return 1; // explicit "doesn't matter"
    const list: string[] = (pref?.educationDetails?.highestDegrees || []).map(
      (d: any) => d?.qualification,
    );
    if (list.length === 0) return missingPreferenceScore; // not set
    return list.some((d) => norm(d) === norm(actualQualification)) ? 1 : 0;
  };

  const aWantsB = fit(prA, pB?.educationDetails?.highestQualification);
  const bWantsA = fit(prB, pA?.educationDetails?.highestQualification);
  return (aWantsB + bWantsA) / 2;
}

function scoreProfession(pA: any, prA: any, pB: any, prB: any): number {
  const fit = (pref: any, actualOccupation?: string): number => {
    if (pref?.educationDetails?.occupation?.doesntMatter) return 1; // explicit "doesn't matter"
    const list: string[] = (
      pref?.educationDetails?.occupation?.preferences || []
    ).map((o: any) => o?.occupation);
    if (list.length === 0) return missingPreferenceScore; // not set
    return list.some((o) => norm(o) === norm(actualOccupation)) ? 1 : 0;
  };

  const aWantsB = fit(prA, pB?.careerDetails?.occupation);
  const bWantsA = fit(prB, pA?.careerDetails?.occupation);
  return (aWantsB + bWantsA) / 2;
}

function scoreIncome(pA: any, prA: any, pB: any, prB: any): number {
  // profile stores annualIncome as a free string; preference stores an AnnualIncome ref with min/max.
  const parseIncome = (s?: string) =>
    s ? parseInt(s.replace(/[^0-9]/g, ''), 10) : undefined;
  const bIncome = parseIncome(pB?.educationDetails?.annualIncome);
  const aIncome = parseIncome(pA?.educationDetails?.annualIncome);
  const aWantsB = !prA?.educationDetails?.annualIncome
    ? missingPreferenceScore
    : inRange(
        bIncome,
        prA.educationDetails.annualIncome.minIncome,
        prA.educationDetails.annualIncome.maxIncome ?? undefined,
      );
  const bWantsA = !prB?.educationDetails?.annualIncome
    ? missingPreferenceScore
    : inRange(
        aIncome,
        prB.educationDetails.annualIncome.minIncome,
        prB.educationDetails.annualIncome.maxIncome ?? undefined,
      );
  return (aWantsB + bWantsA) / 2;
}

function scoreHeight(pA: any, prA: any, pB: any, prB: any): number {
  // profile.basicDetails.height is a string like "5'8\"" — parse to inches for range comparison.
  const parseHeight = (s?: string) => {
    if (!s) return undefined;
    const match = s.match(/(\d+)'(\d+)/);
    if (!match) return undefined;
    return parseInt(match[1], 10) * 12 + parseInt(match[2], 10);
  };
  const bHeight = parseHeight(pB?.basicDetails?.height);
  const aHeight = parseHeight(pA?.basicDetails?.height);
  const minA = parseHeight(prA?.basicDetails?.height?.minHeight?.height);
  const maxA = parseHeight(prA?.basicDetails?.height?.maxHeight?.height);
  const minB = parseHeight(prB?.basicDetails?.height?.minHeight?.height);
  const maxB = parseHeight(prB?.basicDetails?.height?.maxHeight?.height);
  const aWantsB = inRange(bHeight, minA, maxA);
  const bWantsA = inRange(aHeight, minB, maxB);
  return (aWantsB + bWantsA) / 2;
}

function scoreMaritalStatus(pA: any, prA: any, pB: any, prB: any): number {
  const listA: string[] = prA?.basicDetails?.maritalStatus?.preferences || [];
  const listB: string[] = prB?.basicDetails?.maritalStatus?.preferences || [];
  const aWantsB = eqOrDoesntMatter(listA, pB?.basicDetails?.maritalStatus);
  const bWantsA = eqOrDoesntMatter(listB, pA?.basicDetails?.maritalStatus);
  return (aWantsB + bWantsA) / 2;
}

function scoreMotherTongue(pA: any, prA: any, pB: any, prB: any): number {
  const aWantsB = !prA?.religionAndEthnicity?.motherTongue?.preference
    ? missingPreferenceScore
    : norm(prA.religionAndEthnicity.motherTongue.preference?.motherTongue) ===
        norm(pB?.religionDetails?.motherTongue)
      ? 1
      : 0;
  const bWantsA = !prB?.religionAndEthnicity?.motherTongue?.preference
    ? missingPreferenceScore
    : norm(prB.religionAndEthnicity.motherTongue.preference?.motherTongue) ===
        norm(pA?.religionDetails?.motherTongue)
      ? 1
      : 0;
  return (aWantsB + bWantsA) / 2;
}

function scoreLifestyle(pA: any, prA: any, pB: any, prB: any): number {
  const dietA = eqOrDoesntMatter(
    prA?.lifestyleAndAppearance?.dietaryHabits?.preferences,
    pB?.lifestyle?.dietaryHabit,
  );
  const dietB = eqOrDoesntMatter(
    prB?.lifestyleAndAppearance?.dietaryHabits?.preferences,
    pA?.lifestyle?.dietaryHabit,
  );
  const smokeA = eqOrDoesntMatter(
    prA?.lifestyleAndAppearance?.smokingHabits?.preferences,
    pB?.lifestyle?.smokingHabit,
  );
  const smokeB = eqOrDoesntMatter(
    prB?.lifestyleAndAppearance?.smokingHabits?.preferences,
    pA?.lifestyle?.smokingHabit,
  );
  const drinkA = eqOrDoesntMatter(
    prA?.lifestyleAndAppearance?.drinkingHabits?.preferences,
    pB?.lifestyle?.drinkingHabit,
  );
  const drinkB = eqOrDoesntMatter(
    prB?.lifestyleAndAppearance?.drinkingHabits?.preferences,
    pA?.lifestyle?.drinkingHabit,
  );
  return (dietA + dietB + smokeA + smokeB + drinkA + drinkB) / 6;
}

function scoreFamilyType(pA: any, prA: any, pB: any, prB: any): number {
  // No explicit familyType/familyValue preference field exists yet — direct profile equality as a proxy.
  const typeMatch =
    norm(pA?.family?.familyType) === norm(pB?.family?.familyType) ? 1 : 0.5;
  const valueMatch =
    norm(pA?.family?.familyValue) === norm(pB?.family?.familyValue) ? 1 : 0.5;
  return (typeMatch + valueMatch) / 2;
}

function scoreHoroscope(pA: any, prA: any, pB: any, prB: any): number {
  const listA: string[] =
    prA?.religionAndEthnicity?.manglikStatus?.preferences || [];
  const listB: string[] =
    prB?.religionAndEthnicity?.manglikStatus?.preferences || [];
  // profile has hasDosh: boolean (manglik or not); map to enum-ish comparison
  const bStatus = pB?.religionDetails?.hasDosh ? 'Manglik' : 'Non Manglik';
  const aStatus = pA?.religionDetails?.hasDosh ? 'Manglik' : 'Non Manglik';
  const aWantsB = eqOrDoesntMatter(listA, bStatus);
  const bWantsA = eqOrDoesntMatter(listB, aStatus);
  return (aWantsB + bWantsA) / 2;
}

function scoreInterests(pA: any, prA: any, pB: any, prB: any): number {
  // No preference field for hobbies exists — use overlap between the two profiles' hobby arrays as a proxy.
  const hobbiesA: string[] = (pA?.lifestyle?.hobbies || []).map(norm);
  const hobbiesB: string[] = (pB?.lifestyle?.hobbies || []).map(norm);
  if (hobbiesA.length === 0 || hobbiesB.length === 0) return 0.5; // no data, partial credit
  const overlap = hobbiesA.filter((h) => hobbiesB.includes(h)).length;
  const union = new Set([...hobbiesA, ...hobbiesB]).size;
  return union === 0 ? 0.5 : overlap / union;
}

const SCORERS: Record<
  FieldKey,
  (pA: any, prA: any, pB: any, prB: any) => number
> = {
  age: scoreAge,
  religion: scoreReligion,
  caste: scoreCaste,
  location: scoreLocation,
  education: scoreEducation,
  profession: scoreProfession,
  income: scoreIncome,
  height: scoreHeight,
  maritalStatus: scoreMaritalStatus,
  motherTongue: scoreMotherTongue,
  lifestyle: scoreLifestyle,
  familyType: scoreFamilyType,
  horoscope: scoreHoroscope,
  interests: scoreInterests,
};

// ---------- mandatory hard filters ----------

function checkMandatory(
  pA: any,
  prA: any,
  pB: any,
  prB: any,
): { passed: boolean; failedFields: string[] } {
  const failedFields: string[] = [];

  const mandatoryA: string[] = prA?.mandatoryFields || [];
  const mandatoryB: string[] = prB?.mandatoryFields || [];
  const mandatoryFields = Array.from(new Set([...mandatoryA, ...mandatoryB]));

  // A missing preference must never fail a mandatory field, so score it as a full 1 here.
  missingPreferenceScore = 1;
  try {
    for (const field of mandatoryFields) {
      const scorer = SCORERS[field as FieldKey];
      if (!scorer) continue;
      const score = scorer(pA, prA, pB, prB);
      if (score < 1) failedFields.push(field);
    }
  } finally {
    missingPreferenceScore = MISSING_PREFERENCE_SCORE;
  }

  return { passed: failedFields.length === 0, failedFields };
}

// ---------- scoring (pure, no DB access) ----------

export interface MatchResult {
  matchPercentage: number;
  passedMandatory: boolean;
  failedMandatoryFields: string[];
  breakdown: FieldResult[];
}

/**
 * Scores two already-loaded profiles + their (populated) partner preferences.
 * Contains no DB calls, so it can be used for one pair or for a whole feed.
 */
export const scoreMatch = (
  profileA: any,
  preferenceA: any,
  profileB: any,
  preferenceB: any,
): MatchResult => {
  // Hard filters first — bail out early if a mandatory field fails
  const mandatoryCheck = checkMandatory(
    profileA,
    preferenceA,
    profileB,
    preferenceB,
  );
  if (!mandatoryCheck.passed) {
    return {
      matchPercentage: 0,
      passedMandatory: false,
      failedMandatoryFields: mandatoryCheck.failedFields,
      breakdown: [],
    };
  }

  const breakdown: FieldResult[] = (Object.keys(WEIGHTS) as FieldKey[]).map(
    (field) => {
      const weight = WEIGHTS[field];
      const score = SCORERS[field](
        profileA,
        preferenceA,
        profileB,
        preferenceB,
      );
      return {
        field,
        weight,
        score,
        points: Math.round(score * weight * 100) / 100,
      };
    },
  );

  const totalPoints = breakdown.reduce((sum, r) => sum + r.points, 0);
  const matchPercentage = Math.round((totalPoints / TOTAL_WEIGHT) * 100);

  return {
    matchPercentage,
    passedMandatory: true,
    failedMandatoryFields: [],
    breakdown,
  };
};

// Same populate list that was previously inlined in calculateMatchPercentage
const PREFERENCE_POPULATE: PopulateOptions[] = [
  { path: 'religionAndEthnicity.religion.preference' },
  { path: 'religionAndEthnicity.caste.preferences' },
  { path: 'religionAndEthnicity.subCaste.preferences' },
  { path: 'religionAndEthnicity.motherTongue.preference' },
  { path: 'educationDetails.highestDegrees' },
  { path: 'educationDetails.occupation.preferences' },
  { path: 'educationDetails.annualIncome' },
  { path: 'basicDetails.height.minHeight' },
  { path: 'basicDetails.height.maxHeight' },
];

// ---------- public entry points ----------

/**
 * Match % between two profiles (used by GET /profile/match-percentage/:id).
 * Behaviour and return shape are unchanged.
 */
export const calculateMatchPercentage = async (
  profileIdA: string,
  profileIdB: string,
) => {
  const [profileA, profileB] = await Promise.all([
    Profile.findById(profileIdA),
    Profile.findById(profileIdB),
  ]);

  if (!profileA || !profileB) {
    throw new Error('One or both profiles were not found.');
  }

  const [preferenceA, preferenceB] = await Promise.all([
    PartnerPreference.findOne({
      profileId: profileA._id,
      isDeleted: false,
    }).populate(PREFERENCE_POPULATE),
    PartnerPreference.findOne({
      profileId: profileB._id,
      isDeleted: false,
    }).populate(PREFERENCE_POPULATE),
  ]);

  return scoreMatch(profileA, preferenceA, profileB, preferenceB);
};

/**
 * Adds `matchPercentage` (viewer <-> candidate) to every candidate profile.
 *
 * - Loads every partner preference in ONE query (no per-profile DB calls).
 * - Returns plain objects (same shape as the profile's toJSON) + matchPercentage.
 * - Never throws: if scoring fails, profiles are returned with
 *   matchPercentage = null so the existing API keeps working.
 * - Nothing is written to the database (the % depends on who is viewing).
 */
export const attachMatchPercentages = async (
  viewerProfile: any,
  candidates: any[],
): Promise<any[]> => {
  const toPlain = (c: any) => (c && c.toJSON ? c.toJSON() : c);

  if (!candidates || candidates.length === 0) return [];

  try {
    const ids = [viewerProfile._id, ...candidates.map((c) => c._id)];

    const preferences = await PartnerPreference.find({
      profileId: { $in: ids },
      isDeleted: false,
    }).populate(PREFERENCE_POPULATE);

    const preferenceByProfile = new Map<string, any>();
    for (const pref of preferences) {
      const key = pref.profileId.toString();
      if (!preferenceByProfile.has(key)) preferenceByProfile.set(key, pref);
    }

    const viewerPreference = preferenceByProfile.get(
      viewerProfile._id.toString(),
    );

    return candidates.map((candidate) => {
      let matchPercentage: number | null = null;
      try {
        matchPercentage = scoreMatch(
          viewerProfile,
          viewerPreference,
          candidate,
          preferenceByProfile.get(candidate._id.toString()),
        ).matchPercentage;
      } catch (err) {
        matchPercentage = null;
      }
      return { ...toPlain(candidate), matchPercentage };
    });
  } catch (error) {
    console.error('attachMatchPercentages failed:', error);
    return candidates.map((candidate) => ({
      ...toPlain(candidate),
      matchPercentage: null,
    }));
  }
};

/**
 * For list APIs that return wrapper records (visit / shortlist / interest / block)
 * with the other person's profile populated inside (e.g. `visitedProfileId`).
 *
 * Adds `matchPercentage` to that populated profile only. Everything else in the
 * record is returned exactly as before (same as the document's toJSON).
 * Uses ONE bulk query for the whole list and never throws: if anything fails the
 * records are returned unchanged.
 */
export const attachMatchToItems = async (
  viewerProfile: any,
  items: any[],
  field: string,
): Promise<any[]> => {
  const toPlain = (i: any) => (i && i.toJSON ? i.toJSON() : i);

  if (!items || items.length === 0) return [];

  // A populated Profile document (not an un-populated ObjectId, not null)
  const isPopulatedProfile = (p: any) =>
    p &&
    typeof p === 'object' &&
    p.userId !== undefined &&
    p.basicDetails !== undefined;

  try {
    const profiles = items.map((i) => i?.[field]).filter(isPopulatedProfile);

    if (profiles.length === 0) return items.map(toPlain);

    const scored = await attachMatchPercentages(viewerProfile, profiles);
    const scoredById = new Map<string, any>(
      scored.map((p: any) => [p._id.toString(), p]),
    );

    return items.map((item) => {
      const plain = toPlain(item);
      const inner = item?.[field];
      if (isPopulatedProfile(inner)) {
        const withMatch = scoredById.get(inner._id.toString());
        if (withMatch) plain[field] = withMatch;
      }
      return plain;
    });
  } catch (error) {
    console.error('attachMatchToItems failed:', error);
    return items.map(toPlain);
  }
};
