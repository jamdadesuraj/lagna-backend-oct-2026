import { Ignore } from '../modules/profile-details/ignore/ignore.model';
import { Block } from '../modules/profile-details/block/block.model';
import { Interest } from '../modules/profile-details/interest/interest.model';
import { Profile } from '../modules/profile-details/profile.model';
import { attachMatchPercentages } from './matchProfileService';

export const getRecommended = async (profileId: string) => {
  const loggedInProfile = await Profile.findById(profileId);

  if (!loggedInProfile || loggedInProfile.isDeleted) {
    throw new Error('Your profile was not found.');
  }
  // Ignored profiles
  const ignoredProfileIds = await Ignore.find({
    userId: loggedInProfile._id,
  }).distinct('ignoredUserId');

  // Blocked profiles
  const blockedProfileIds = await Block.find({
    userId: loggedInProfile._id,
  }).distinct('blockedUserId');

  // Profiles that blocked me
  const blockedMeProfileIds = await Block.find({
    blockedUserId: loggedInProfile._id,
  }).distinct('userId');

  // Already sent interest
  const interestedProfileIds = await Interest.find({
    senderId: loggedInProfile._id,
  }).distinct('receiverId');

  // Excluded profiles
  const excludedIds = [
    loggedInProfile._id,
    ...ignoredProfileIds,
    ...blockedProfileIds,
    ...blockedMeProfileIds,
    ...interestedProfileIds,
  ];

  const uniqueExcludedIds = [
    ...new Set(excludedIds.map((id) => id.toString())),
  ];

  // Fetch remaining profiles
  const profiles = await Profile.find({
    _id: {
      $nin: uniqueExcludedIds,
    },
    isDeleted: false,
  });

  // Same scoring as the home feed (bidirectional, partner-preference based)
  const scoredProfiles = await attachMatchPercentages(
    loggedInProfile,
    profiles,
  );

  const filteredProfiles = scoredProfiles
    .filter((profile) => (profile.matchPercentage ?? 0) >= 50)
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
    .slice(0, 20)
    .map((profile) => ({
      matchPercentage: profile.matchPercentage as number,
      profile,
    }));

  return filteredProfiles;
};
