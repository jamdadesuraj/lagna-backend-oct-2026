import { Router } from 'express';
import {
  createProfile,
  deleteProfile,
  getMyProfile,
  getProfiles,
  updateProfile,
  uploadProfilePhotos,
  removeProfilePhoto,
  // filterProfiles,
  getProfileById,
  getContactDetailsById,
  getRecommendedMatches,
  getViewedContactProfileIds,
  getMatchPercentage,
} from './profile.controllers';
import { upload } from '../../config/cloudinary';
import { authenticate } from '../../middlewares/authMiddleware';

const router = Router();

/**
 * ADD THIS IMPORT in the existing import block from './profile.controllers'
 * inside: backend/src/app/modules/profile-details/profile.routes.ts
 *
 *   import {
 *     ...existing imports...
 *     getMatchPercentage,
 *   } from './profile.controllers';
 */

/**
 * ADD THIS ROUTE (with its swagger doc) anywhere among the other
 * router.get(...) definitions in profile.routes.ts, e.g. right below
 * the /recommended-matches route.
 */

/**
 * @swagger
 * /v1/api/profile/match-percentage/{targetProfileId}:
 *   get:
 *     summary: Get match percentage with another profile
 *     tags: [Profile Details]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Calculates a weighted compatibility percentage between the
 *       authenticated user's profile and the target profile, using both
 *       users' partner preferences (age, religion, caste/sub-caste,
 *       location, education, profession, income, height, marital status,
 *       mother tongue, lifestyle, family type, horoscope/manglik, and
 *       interests). Mandatory fields (if configured on either partner
 *       preference) are applied as hard filters before scoring — if any
 *       mandatory field fails, matchPercentage is 0 and passedMandatory
 *       is false.
 *     parameters:
 *       - in: path
 *         name: targetProfileId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB _id of the profile to compare against.
 *     responses:
 *       200:
 *         description: Match percentage calculated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Match percentage calculated successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     matchPercentage:
 *                       type: number
 *                       example: 78
 *                     passedMandatory:
 *                       type: boolean
 *                       example: true
 *                     failedMandatoryFields:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: []
 *                     breakdown:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           field:
 *                             type: string
 *                             example: religion
 *                           weight:
 *                             type: number
 *                             example: 10
 *                           score:
 *                             type: number
 *                             example: 1
 *                           points:
 *                             type: number
 *                             example: 10
 *       400:
 *         description: Invalid target profile id.
 *       404:
 *         description: Profile not found.
 *       500:
 *         description: Server error.
 */
router.get(
  '/match-percentage/:targetProfileId',
  authenticate,
  getMatchPercentage,
);
/**
 * @swagger
 * /v1/api/profile:
 *   post:
 *     summary: Create Matrimony Profile
 *     tags: [Profile Details]
 *     security:
 *       - bearerAuth: []
 *     description: Creates a matrimony profile for the authenticated user. Each user can create only one profile.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               basicDetails:
 *                 type: object
 *                 properties:
 *                   profileFor:
 *                     type: string
 *                   gender:
 *                     type: string
 *                     enum: [Male, Female]
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   dob:
 *                     type: string
 *                     format: date
 *                   age:
 *                     type: integer
 *                   height:
 *                     type: string
 *                   maritalStatus:
 *                     type: string
 *                     enum:
 *                       - Never Married
 *                       - Divorced
 *                       - Widowed
 *                       - Awaiting Divorce
 *
 *               educationDetails:
 *                 type: object
 *                 properties:
 *                   highestQualification:
 *                     type: string
 *                   educationType:
 *                     type: string
 *                   occupation:
 *                     type: string
 *                   annualIncome:
 *                     type: string
 *
 *               religionDetails:
 *                 type: object
 *                 properties:
 *                   religion:
 *                     type: string
 *                   caste:
 *                     type: string
 *                   subCaste:
 *                     type: string
 *                   hasDosh:
 *                     type: boolean
 *                   motherTongue:
 *                     type: string
 *
 *               locationDetails:
 *                 type: object
 *                 properties:
 *                   country:
 *                     type: string
 *                   state:
 *                     type: string
 *                   city:
 *                     type: string
 *
 *               additionalDetails:
 *                 type: object
 *                 properties:
 *                   classType:
 *                     type: string
 *                     enum:
 *                       - Middle Class
 *                       - Upper Middle Class
 *                       - Rich
 *                       - Affluent
 *                       - Elite
 *                   brothers:
 *                     type: string
 *                     enum: [None, "1", "2", "3", "3+"]
 *                   marriedBrothers:
 *                     type: string
 *                     enum: [None, "1", "2", "3", "3+"]
 *                   sisters:
 *                     type: string
 *                     enum: [None, "1", "2", "3", "3+"]
 *                   marriedSisters:
 *                     type: string
 *                     enum: [None, "1", "2", "3", "3+"]
 *                   livingWithFamily:
 *                     type: boolean
 *                   familyLocation:
 *                     type: string
 *
 *               horoscopeDetails:
 *                 type: object
 *                 properties:
 *                   birthTime:
 *                     type: object
 *                     properties:
 *                       hour:
 *                         type: integer
 *                       minute:
 *                         type: integer
 *                       meridiem:
 *                         type: string
 *                         enum: [AM, PM]
 *                   birthPlace:
 *                     type: object
 *                     properties:
 *                       country:
 *                         type: string
 *                       state:
 *                         type: string
 *                       city:
 *                         type: string
 *                   starDetails:
 *                     type: object
 *                     properties:
 *                       nakshatra:
 *                         type: string
 *                       rashi:
 *                         type: string
 *
 *               lifestyleDetails:
 *                 type: object
 *                 properties:
 *                   eatingHabit:
 *                     type: string
 *                     enum:
 *                       - Vegetarian
 *                       - Non Vegetarian
 *                       - Eggitarian
 *
 *               careerDetails:
 *                 type: object
 *                 properties:
 *                   employedIn:
 *                     type: string
 *                   occupation:
 *                     type: string
 *                   organizationName:
 *                     type: string
 *                   interestedInSettlingAbroad:
 *                     type: boolean
 *
 *               education:
 *                 type: object
 *                 properties:
 *                   aboutEducation:
 *                     type: string
 *                   highestDegree:
 *                     type: string
 *                   postGraduation:
 *                     type: string
 *                   underGraduation:
 *                     type: string
 *                   school:
 *                     type: string
 *
 *               family:
 *                 type: object
 *                 properties:
 *                   aboutFamily:
 *                     type: string
 *                   fatherOccupation:
 *                     type: string
 *                   motherOccupation:
 *                     type: string
 *                   brothers:
 *                     type: string
 *                   sisters:
 *                     type: string
 *                   familyIncome:
 *                     type: string
 *                   familyStatus:
 *                     type: string
 *                     enum:
 *                       - Middle Class
 *                       - Upper Middle Class
 *                       - Rich
 *                       - Affluent
 *                       - Elite
 *                   familyType:
 *                     type: string
 *                     enum:
 *                       - Joint Family
 *                       - Nuclear Family
 *                   familyValue:
 *                     type: string
 *                     enum:
 *                       - Traditional
 *                       - Moderate
 *                       - Liberal
 *                   livingWithParents:
 *                     type: boolean
 *                   familyBasedOutOf:
 *                     type: string
 *
 *               contactDetails:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                     format: email
 *                   alternateEmail:
 *                     type: string
 *                     format: email
 *                   phoneNumber:
 *                     type: string
 *                   alternatePhoneNumber:
 *                     type: string
 *                   landlineNumber:
 *                     type: string
 *                   relationshipWithBrideOrGroom:
 *                     type: string
 *
 *               lifestyle:
 *                 type: object
 *                 properties:
 *                   dietaryHabit:
 *                     type: string
 *                     enum:
 *                       - Vegetarian
 *                       - Non Vegetarian
 *                       - Eggitarian
 *                   drinkingHabit:
 *                     type: string
 *                     enum:
 *                       - Never
 *                       - Occasionally
 *                       - Regularly
 *                   smokingHabit:
 *                     type: string
 *                     enum:
 *                       - Never
 *                       - Occasionally
 *                       - Regularly
 *                   openToPets:
 *                     type: boolean
 *                   ownHouse:
 *                     type: boolean
 *                   ownCar:
 *                     type: boolean
 *                   foodICook:
 *                     type: string
 *                   hobbies:
 *                     type: array
 *                     items:
 *                       type: string
 *                   favouriteMusic:
 *                     type: array
 *                     items:
 *                       type: string
 *                   favouriteBooks:
 *                     type: array
 *                     items:
 *                       type: string
 *                   dressStyle:
 *                     type: string
 *                   sports:
 *                     type: array
 *                     items:
 *                       type: string
 *                   cuisine:
 *                     type: array
 *                     items:
 *                       type: string
 *                   movies:
 *                     type: array
 *                     items:
 *                       type: string
 *                   favouriteRead:
 *                     type: array
 *                     items:
 *                       type: string
 *                   tvShow:
 *                     type: array
 *                     items:
 *                       type: string
 *               aboutMe:
 *                 type: object
 *                 properties:
 *                   about:
 *                     type: string
 *                     maxLength: 1000
 *                     example: "I am a family-oriented, ambitious and caring person who values honesty and mutual respect."
 *                   describeYourself:
 *                     type: string
 *                     maxLength: 100
 *                     example: "Kind, Caring, Honest, Friendly, Ambitious"
 *                   profileCreatedBy:
 *                     type: string
 *                     example: "Relative/Friend"
 *                   languagesISpeak:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - English
 *                       - Hindi
 *                       - Marathi
 *                   disability:
 *                     type: string
 *                     example: "None"
 *                   thalassemia:
 *                     type: string
 *                     example: "No"
 *                   hivStatus:
 *                     type: boolean
 *                     example: false
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *               subscription:
 *                 type: object
 *                 description: Subscription details. This field is managed automatically by the backend after successful package payment verification.
 *                 properties:
 *                   isActive:
 *                     type: boolean
 *                     example: false
 *                   packageId:
 *                     type: string
 *                     nullable: true
 *                     example: "665f3a9c8d9b123456789abc"
 *                   startDate:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                     example: "2026-07-28T10:30:00.000Z"
 *                   expiryDate:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                     example: "2026-08-27T10:30:00.000Z"
 *     responses:
 *       201:
 *         description: Profile created successfully.
 *       409:
 *         description: Profile already exists.
 *       400:
 *         description: Validation failed.
 */
router.post('/', authenticate, createProfile);
/**
 * @swagger
 * /v1/api/profile/photos:
 *   post:
 *     summary: Upload Profile Photos
 *     tags: [Profile Details]
 *     security:
 *       - bearerAuth: []
 *     description: Upload up to 6 profile photos for the authenticated user's matrimony profile.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Photos uploaded successfully.
 *       400:
 *         description: No images uploaded.
 *       404:
 *         description: Profile not found.
 */
router.post(
  '/photos',
  authenticate,
  upload.array('photos', 6),
  uploadProfilePhotos,
);
/**
 * @swagger
 * /v1/api/profile/me:
 *   get:
 *     summary: Get Logged-in User Profile
 *     tags: [Profile Details]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieves the matrimony profile of the authenticated user.
 *     responses:
 *       200:
 *         description: Profile retrieved successfully.
 *       404:
 *         description: Profile not found.
 */
router.get('/me', authenticate, getMyProfile);
/**
 * @swagger
 * /v1/api/profile:
 *   get:
 *     summary: Get User's Profiles (Feed / Filtered)
 *     tags: [Home]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Retrieves matrimony profiles for the Home/Feed page, excluding the logged-in user's
 *       own profile and any profiles that are ignored, blocked, blocked-by, already interested,
 *       or already shortlisted.
 *
 *       Every profile in `data` includes a `matchPercentage` (0-100) calculated for the
 *       logged-in user.
 *
 *       **Filter behavior:**
 *       - If one or more query filters are provided, profiles are filtered accordingly.
 *       - If no query filters are provided, the user's saved Partner Preferences (if any) are
 *         applied automatically as the default feed.
 *
 *       **Multi-select fields:**
 *       Any filter marked as multi-select accepts multiple values via a comma-separated string
 *       (`city=Pune,Mumbai,Delhi`) or repeated params
 *       (`city=Pune&city=Mumbai`).
 *
 *       **Annual income filter:**
 *       `minIncome`/`maxIncome` are raw numeric values (in rupees), not bracket labels or IDs.
 *       The server resolves them internally to matching AnnualIncome brackets.
 *
 *       **Matrimony ID filter:**
 *       `matrimonyId` performs an exact match against a profile's unique matrimony ID
 *       (e.g. `AG14122004`), useful for looking up a specific profile directly.
 *
 *       **Ranking:**
 *       Profiles with an active spotlight (paid, valid for 24 hours) are always shown first —
 *       spotlighted profiles bypass Partner Preference filters (though hard exclusions like
 *       blocked/ignored/hidden profiles and the opposite-gender rule still apply) — followed
 *       by active-subscription profiles (sorted by package priority), then the rest.
 *
 *     parameters:
 *
 *       - in: query
 *         name: matchPreference
 *         schema:
 *           type: string
 *         description: >
 *           Feed preference filter.
 *
 *           Supported values:
 *           - `verified` - Returns only profiles where `isVerified` is true.
 *           - `justJoined` - Returns profiles created within the last 24 hours. If no profiles
 *             are found, the API falls back to the newest matching profiles.
 *           - City name - Returns profiles whose `locationDetails.city` matches the provided value.
 *             Example: `Pune`.
 *           - State name - Returns profiles whose `locationDetails.state` matches the provided value.
 *             Example: `Maharashtra`.
 *
 *           For location filtering, the user can enter either a city or a state directly.
 *           The API checks the provided value against both `locationDetails.city` and
 *           `locationDetails.state`.
 *
 *           Examples:
 *           - `matchPreference=verified`
 *           - `matchPreference=justJoined`
 *           - `matchPreference=Pune`
 *           - `matchPreference=Maharashtra`
 *           - `matchPreference=verified,Pune`
 *           - `matchPreference=verified,Maharashtra`
 *
 *           Multiple values can be provided using comma-separated values or repeated parameters.
 *
 *       - in: query
 *         name: matrimonyId
 *         schema:
 *           type: string
 *         description: >
 *           Exact match on a profile's unique matrimony ID. e.g. matrimonyId=AG14122004
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *         description: Multi-select. e.g. Male, Female
 *       - in: query
 *         name: minAge
 *         schema:
 *           type: integer
 *         description: Minimum age filter
 *       - in: query
 *         name: maxAge
 *         schema:
 *           type: integer
 *         description: Maximum age filter
 *       - in: query
 *         name: maritalStatus
 *         schema:
 *           type: string
 *         description: Multi-select. e.g. Never Married, Divorced, Widowed
 *       - in: query
 *         name: height
 *         schema:
 *           type: string
 *         description: Multi-select. Exact height value(s)
 *       - in: query
 *         name: minHeight
 *         schema:
 *           type: number
 *         description: Minimum height filter
 *       - in: query
 *         name: maxHeight
 *         schema:
 *           type: number
 *         description: Maximum height filter
 *       - in: query
 *         name: religion
 *         schema:
 *           type: string
 *         description: Multi-select
 *       - in: query
 *         name: caste
 *         schema:
 *           type: string
 *         description: Multi-select
 *       - in: query
 *         name: subCaste
 *         schema:
 *           type: string
 *         description: Multi-select
 *       - in: query
 *         name: hasDosh
 *         schema:
 *           type: boolean
 *         description: Filter by whether the profile has Dosh
 *       - in: query
 *         name: motherTongue
 *         schema:
 *           type: string
 *         description: Multi-select
 *       - in: query
 *         name: highestQualification
 *         schema:
 *           type: string
 *         description: Multi-select
 *       - in: query
 *         name: educationType
 *         schema:
 *           type: string
 *         description: Multi-select
 *       - in: query
 *         name: occupation
 *         schema:
 *           type: string
 *         description: Multi-select
 *       - in: query
 *         name: minIncome
 *         schema:
 *           type: number
 *         description: >
 *           Minimum annual income filter (in rupees). Matches any AnnualIncome bracket whose
 *           range overlaps [minIncome, maxIncome]. e.g. minIncome=500000
 *       - in: query
 *         name: maxIncome
 *         schema:
 *           type: number
 *         description: >
 *           Maximum annual income filter (in rupees). Matches any AnnualIncome bracket whose
 *           range overlaps [minIncome, maxIncome]. e.g. maxIncome=1500000
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Multi-select
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: Multi-select
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Multi-select. e.g. city=Pune,Mumbai,Delhi
 *       - in: query
 *         name: classType
 *         schema:
 *           type: string
 *         description: Multi-select
 *       - in: query
 *         name: brothers
 *         schema:
 *           type: string
 *         description: Multi-select
 *       - in: query
 *         name: marriedBrothers
 *         schema:
 *           type: string
 *         description: Multi-select
 *       - in: query
 *         name: sisters
 *         schema:
 *           type: string
 *         description: Multi-select
 *       - in: query
 *         name: marriedSisters
 *         schema:
 *           type: string
 *         description: Multi-select
 *       - in: query
 *         name: livingWithFamily
 *         schema:
 *           type: boolean
 *         description: Filter by whether the profile lives with family
 *       - in: query
 *         name: familyLocation
 *         schema:
 *           type: string
 *         description: Multi-select
 *       - in: query
 *         name: eatingHabit
 *         schema:
 *           type: string
 *         description: Multi-select. e.g. Vegetarian, Non-Vegetarian, Eggetarian
 *       - in: query
 *         name: nakshatra
 *         schema:
 *           type: string
 *         description: Multi-select
 *       - in: query
 *         name: rashi
 *         schema:
 *           type: string
 *         description: Multi-select
 *     responses:
 *       200:
 *         description: Profiles retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 total:
 *                   type: integer
 *                   example: 24
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Profile data plus a calculated `matchPercentage`.
 *                     properties:
 *                       matchPercentage:
 *                         type: integer
 *                         nullable: true
 *                         minimum: 0
 *                         maximum: 100
 *                         example: 82
 *                         description: >
 *                           Match % between the logged-in user and this profile (both users'
 *                           partner preferences are considered). Calculated per request and
 *                           not stored in the database. `null` if it could not be calculated.
 *       404:
 *         description: Logged-in user's profile not found.
 *       500:
 *         description: Server error.
 */
router.get('/', authenticate, getProfiles);
/**
 * @swagger
 * /v1/api/profile/recommended-matches:
 *   get:
 *     summary: Get Recommended Matches
 *     tags: [Home]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Returns recommended matrimony profiles for the authenticated user.
 *
 *       The API automatically excludes:
 *       - The logged-in user's own profile
 *       - Deleted profiles
 *       - Ignored profiles
 *       - Blocked profiles
 *       - Profiles that have blocked the user
 *       - Profiles already shortlisted
 *       - Profiles to whom an interest has already been sent
 *
 *       Matches are scored with the same bidirectional partner-preference logic used by the
 *       home feed (age, religion, caste, location, education, profession, income, height,
 *       marital status, mother tongue, lifestyle, family and horoscope). Only profiles with a
 *       `matchPercentage` of 50 or more are returned, highest first (max 20).
 *     responses:
 *       200:
 *         description: Recommended matches fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 8
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       matchPercentage:
 *                         type: integer
 *                         minimum: 0
 *                         maximum: 100
 *                         example: 82
 *                       profile:
 *                         type: object
 *                         description: Profile data (also contains `matchPercentage`).
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Logged-in profile not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/recommended-matches', authenticate, getRecommendedMatches);
/**
 * @swagger
 * /v1/api/profile/{id}:
 *   get:
 *     summary: Get Profile By ID
 *     tags: [Home]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Retrieves a specific matrimony profile by its Profile ID. This API is typically used when a user taps on a profile card from the home/feed page.
 *
 *       **Contact details limit:** `data.contactDetails` is only included if the requesting user
 *       has already unlocked this profile's contact details, or is still within their
 *       package's (or the free tier's) contact-view limit. If the limit has been reached,
 *       `data.contactDetails` is omitted and a `contactMessage` field explains why.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Profile ID
 *         schema:
 *           type: string
 *           example: 688b2d8d4d4b7d1234567890
 *     responses:
 *       200:
 *         description: Profile fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Profile data. `contactDetails` may be omitted if the contact-view limit has been reached.
 *                   properties:
 *                     matchPercentage:
 *                       type: integer
 *                       nullable: true
 *                       minimum: 0
 *                       maximum: 100
 *                       example: 82
 *                       description: Match % between the viewer and this profile. Not present when the viewer opens their own profile.
 *                 contactMessage:
 *                   type: string
 *                   description: Present only when contactDetails was withheld due to the package/free-tier limit.
 *                   example: You can only view contact details of 3 profiles. Please upgrade your package to view more.
 *       400:
 *         description: Invalid Profile ID.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Profile not found.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/:id', authenticate, getProfileById);

/**
 * @swagger
 * /v1/api/profile/{id}/contact-details:
 *   get:
 *     summary: Get Contact Details By Profile ID
 *     tags: [Profile Details]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Returns the contact details of the specified profile. Access is gated by the viewer's
 *       package subscription:
 *
 *       - Viewing your own profile's contact details is always allowed.
 *       - If you have already unlocked this profile's contact details before, they are
 *         returned immediately without consuming any additional quota.
 *       - Otherwise, you must have an active, non-expired package. Users without an active
 *         package are denied and asked to purchase one.
 *       - Each package defines a `contactViewLimit` — the maximum number of distinct profiles
 *         whose contact details can be unlocked during the active subscription period
 *         (counted from the subscription's `startDate`). Once that limit is reached, further
 *         unlocks are denied until the package is renewed/upgraded.
 *       - Unlocking a profile's contact details is recorded permanently (per viewer, per
 *         target profile), so it only counts against the limit once.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Profile ID whose contact details are being requested
 *         schema:
 *           type: string
 *           example: 688b2d8d4d4b7d1234567890
 *     responses:
 *       200:
 *         description: Contact details fetched successfully (already unlocked, self-view, or newly unlocked within package limit).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: The profile's contact details.
 *                   properties:
 *                     email:
 *                       type: string
 *                       format: email
 *                     alternateEmail:
 *                       type: string
 *                       format: email
 *                     phoneNumber:
 *                       type: string
 *                     alternatePhoneNumber:
 *                       type: string
 *                     landlineNumber:
 *                       type: string
 *                     relationshipWithBrideOrGroom:
 *                       type: string
 *       403:
 *         description: Contact view denied — no active package, or the package's contact-view limit has been reached.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: You have reached your limit of 10 contact views for this package.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Profile not found, or the requesting user's own profile was not found.
 *       500:
 *         description: Internal Server Error.
 */

router.get('/:id/contact-details', authenticate, getContactDetailsById);
/**
 * @swagger
 * /v1/api/profile:
 *   put:
 *     summary: Update Matrimony Profile
 *     tags: [Profile Details]
 *     security:
 *       - bearerAuth: []
 *     description: Updates the authenticated user's matrimony profile. Users can update one or more profile sections in a single request.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               basicDetails:
 *                 type: object
 *                 properties:
 *                   profileFor:
 *                     type: string
 *                     example: Self
 *                   gender:
 *                     type: string
 *                     enum: [Male, Female]
 *                   firstName:
 *                     type: string
 *                     example: Muskan
 *                   lastName:
 *                     type: string
 *                     example: Mujavar
 *                   dob:
 *                     type: string
 *                     format: date
 *                   age:
 *                     type: number
 *                     example: 24
 *                   height:
 *                     type: string
 *                     example: 5'3"
 *                   maritalStatus:
 *                     type: string
 *                     enum: [Never Married, Divorced, Widowed, Awaiting Divorce]
 *
 *               educationDetails:
 *                 type: object
 *                 properties:
 *                   highestQualification:
 *                     type: string
 *                   educationType:
 *                     type: string
 *                   occupation:
 *                     type: string
 *                   annualIncome:
 *                     type: string
 *
 *               education:
 *                 type: object
 *                 properties:
 *                   aboutEducation:
 *                     type: string
 *                   highestDegree:
 *                     type: string
 *                     example: MCA
 *                   postGraduation:
 *                     type: string
 *                   underGraduation:
 *                     type: string
 *                   school:
 *                     type: string
 *
 *               religionDetails:
 *                 type: object
 *                 properties:
 *                   religion:
 *                     type: string
 *                   caste:
 *                     type: string
 *                   subCaste:
 *                     type: string
 *                   hasDosh:
 *                     type: boolean
 *                   motherTongue:
 *                     type: string
 *
 *               locationDetails:
 *                 type: object
 *                 properties:
 *                   country:
 *                     type: string
 *                   state:
 *                     type: string
 *                   city:
 *                     type: string
 *
 *               additionalDetails:
 *                 type: object
 *                 properties:
 *                   classType:
 *                     type: string
 *                     enum:
 *                       - Middle Class
 *                       - Upper Middle Class
 *                       - Rich
 *                       - Affluent
 *                       - Elite
 *                   brothers:
 *                     type: string
 *                     enum: [None, "1", "2", "3", "3+"]
 *                   marriedBrothers:
 *                     type: string
 *                     enum: [None, "1", "2", "3", "3+"]
 *                   sisters:
 *                     type: string
 *                     enum: [None, "1", "2", "3", "3+"]
 *                   marriedSisters:
 *                     type: string
 *                     enum: [None, "1", "2", "3", "3+"]
 *                   livingWithFamily:
 *                     type: boolean
 *                   familyLocation:
 *                     type: string
 *
 *               family:
 *                 type: object
 *                 properties:
 *                   aboutFamily:
 *                     type: string
 *                   fatherOccupation:
 *                     type: string
 *                   motherOccupation:
 *                     type: string
 *                   brothers:
 *                     type: string
 *                   sisters:
 *                     type: string
 *                   familyIncome:
 *                     type: string
 *                   familyStatus:
 *                     type: string
 *                     enum:
 *                       - Middle Class
 *                       - Upper Middle Class
 *                       - Rich
 *                       - Affluent
 *                       - Elite
 *                   familyType:
 *                     type: string
 *                     enum:
 *                       - Joint Family
 *                       - Nuclear Family
 *                   familyValue:
 *                     type: string
 *                     enum:
 *                       - Traditional
 *                       - Moderate
 *                       - Liberal
 *                   livingWithParents:
 *                     type: boolean
 *                   familyBasedOutOf:
 *                     type: string
 *
 *               horoscopeDetails:
 *                 type: object
 *                 properties:
 *                   birthTime:
 *                     type: object
 *                     properties:
 *                       hour:
 *                         type: number
 *                       minute:
 *                         type: number
 *                       meridiem:
 *                         type: string
 *                         enum: [AM, PM]
 *                   birthPlace:
 *                     type: object
 *                     properties:
 *                       country:
 *                         type: string
 *                       state:
 *                         type: string
 *                       city:
 *                         type: string
 *                   starDetails:
 *                     type: object
 *                     properties:
 *                       nakshatra:
 *                         type: string
 *                       rashi:
 *                         type: string
 *
 *               contactDetails:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                     format: email
 *                   alternateEmail:
 *                     type: string
 *                     format: email
 *                   phoneNumber:
 *                     type: string
 *                   alternatePhoneNumber:
 *                     type: string
 *                   landlineNumber:
 *                     type: string
 *                   relationshipWithBrideOrGroom:
 *                     type: string
 *
 *               careerDetails:
 *                 type: object
 *                 properties:
 *                   employedIn:
 *                     type: string
 *                   occupation:
 *                     type: string
 *                   organizationName:
 *                     type: string
 *                   interestedInSettlingAbroad:
 *                     type: boolean
 *
 *               lifestyleDetails:
 *                 type: object
 *                 properties:
 *                   eatingHabit:
 *                     type: string
 *                     enum:
 *                       - Vegetarian
 *                       - Non Vegetarian
 *                       - Eggitarian
 *
 *               lifestyle:
 *                 type: object
 *                 properties:
 *                   dietaryHabit:
 *                     type: string
 *                     enum:
 *                       - Vegetarian
 *                       - Non Vegetarian
 *                       - Eggitarian
 *                   drinkingHabit:
 *                     type: string
 *                     enum:
 *                       - Never
 *                       - Occasionally
 *                       - Regularly
 *                   smokingHabit:
 *                     type: string
 *                     enum:
 *                       - Never
 *                       - Occasionally
 *                       - Regularly
 *                   openToPets:
 *                     type: boolean
 *                   ownHouse:
 *                     type: boolean
 *                   ownCar:
 *                     type: boolean
 *                   foodICook:
 *                     type: string
 *                   hobbies:
 *                     type: array
 *                     items:
 *                       type: string
 *                   favouriteMusic:
 *                     type: array
 *                     items:
 *                       type: string
 *                   favouriteBooks:
 *                     type: array
 *                     items:
 *                       type: string
 *                   dressStyle:
 *                     type: string
 *                   sports:
 *                     type: array
 *                     items:
 *                       type: string
 *                   cuisine:
 *                     type: array
 *                     items:
 *                       type: string
 *                   movies:
 *                     type: array
 *                     items:
 *                       type: string
 *                   favouriteRead:
 *                     type: array
 *                     items:
 *                       type: string
 *                   tvShow:
 *                     type: array
 *                     items:
 *                       type: string
 *
 *               aboutMe:
 *                 type: object
 *                 properties:
 *                   about:
 *                     type: string
 *                     maxLength: 1000
 *                     example: "I am a family-oriented, ambitious and caring person who values honesty and mutual respect."
 *                   describeYourself:
 *                     type: string
 *                     maxLength: 100
 *                     example: "Kind, Caring, Honest, Friendly, Ambitious"
 *                   profileCreatedBy:
 *                     type: string
 *                     example: "Relative/Friend"
 *                   languagesISpeak:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - English
 *                       - Hindi
 *                       - Marathi
 *                   disability:
 *                     type: string
 *                     example: "None"
 *                   thalassemia:
 *                     type: string
 *                     example: "No"
 *                   hivStatus:
 *                     type: boolean
 *                     example: false
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - https://example.com/photo1.jpg
 *                   - https://example.com/photo2.jpg
 *               subscription:
 *                 type: object
 *                 description: Subscription details. This field is managed automatically by the backend after successful package payment verification.
 *                 properties:
 *                   isActive:
 *                     type: boolean
 *                     example: false
 *                   packageId:
 *                     type: string
 *                     nullable: true
 *                     example: "665f3a9c8d9b123456789abc"
 *                   startDate:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                     example: "2026-07-28T10:30:00.000Z"
 *                   expiryDate:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                     example: "2026-08-27T10:30:00.000Z"
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Profile not found.
 *       500:
 *         description: Internal server error.
 */
router.put('/', authenticate, upload.array('photos', 6), updateProfile);

/**
 * @swagger
 * /v1/api/profile/contact-details/viewed:
 *   get:
 *     summary: Get Viewed Contact Profile IDs
 *     tags: [Profile Details]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Returns the list of profile IDs whose contact details the authenticated user has
 *       already unlocked (via the contact-details endpoint). Useful for the frontend to mark
 *       "Contact Viewed" on profile cards without calling the contact-details endpoint for
 *       every profile individually.
 *     responses:
 *       200:
 *         description: List of viewed profile IDs fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - "688b2d8d4d4b7d1234567890"
 *                     - "688b2d8d4d4b7d1234567891"
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Requesting user's own profile was not found.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/contact-details/viewed', authenticate, getViewedContactProfileIds);
/**
 * @swagger
 * /v1/api/profile/remove-photo:
 *   delete:
 *     summary: Remove a profile photo
 *     description: Removes a specific photo from the logged-in user's profile.
 *     tags:
 *       - Profile Details
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - photoUrl
 *             properties:
 *               photoUrl:
 *                 type: string
 *                 description: URL of the profile photo to remove.
 *                 example: https://res.cloudinary.com/demo/image/upload/v123456789/profile/photo1.jpg
 *
 *     responses:
 *       200:
 *         description: Profile photo removed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Profile photo removed successfully.
 *                 data:
 *                   type: object
 *                   description: Updated profile with the remaining photos.
 *
 *       400:
 *         description: Photo URL is missing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Photo URL is required.
 *
 *       404:
 *         description: Profile or photo not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Profile or photo not found.
 *
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Failed to remove profile photo.
 */
router.delete('/remove-photo', authenticate, removeProfilePhoto);
/**
 * @swagger
 * /v1/api/profile:
 *   patch:
 *     summary: Delete Matrimony Profile (Soft Delete)
 *     tags: [Profile Details]
 *     security:
 *       - bearerAuth: []
 *     description: Soft deletes the authenticated user's matrimony profile by marking it as deleted.
 *     responses:
 *       200:
 *         description: Profile deleted successfully.
 *       404:
 *         description: Profile not found.
 */
router.patch('/', authenticate, deleteProfile);

export const profileRouter = router;
