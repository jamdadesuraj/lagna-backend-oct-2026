import cron from 'node-cron';
import { Profile } from '../modules/profile-details/profile.model';

export const startSpotlightExpiryJob = () => {
  // Runs every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      const now = new Date();

      await Profile.updateMany(
        {
          isSpotlighted: true,
          spotlightExpiresAt: { $lte: now },
        },
        {
          $set: { isSpotlighted: false },
        },
      );
    } catch (error) {
      console.error('Spotlight expiry job error:', error);
    }
  });
};
