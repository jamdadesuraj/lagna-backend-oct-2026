/**
 * backend/src/fraudAlertData.ts
 *
 * Saves the "Fraud & Alert" page (title + content) straight into MongoDB - no
 * login, no API call - using the backend's own FraudAlert model and validation
 * (the same module the /admin/fraud-alert route uses).
 *
 * NOTE: the Fraud & Alert model has NO image field (only title, content and
 * isActive), so there are no images to save here.
 *
 * RUN (from the backend folder):
 *   npx ts-node --transpile-only src/fraudAlertData.ts
 *   (or)  npx ts-node-dev --transpile-only src/fraudAlertData.ts
 *
 * Safe to run more than once. Fraud & Alert is a single page, so running again
 * updates the existing one (same as the Admin page does) instead of adding a
 * duplicate. Nothing imports this file, so the server never runs it by accident.
 */

import mongoose from 'mongoose';
import config from './app/config';
import { FraudAlert } from './app/modules/admin/fraud-alert/fraudAlert.model';
import { fraudAlertSchema } from './app/modules/admin/fraud-alert/fraudAlert.validation';

// ==================== YOUR FRAUD & ALERT DATA ====================
const DATA = {
  title: 'Fraud Alert - Stay Safe On SahaJeevan',
  content: `Your safety is our priority. Please read these precautions before connecting with any profile.

1. Never send money. SahaJeevan will never ask you for money, gifts or "processing fees" to contact a match. If a profile asks for money for any reason - medical emergency, travel, customs, investment - stop and report it.

2. Do not share financial details. Never share your bank account, card number, OTP, UPI PIN, passwords or Aadhaar/PAN copies with someone you have only met online.

3. Verify before you trust. Prefer verified profiles. Ask for a video call before meeting, and confirm education, job and family details independently.

4. Beware of fake profiles. Be careful if someone refuses to video call, uses very polished photos, claims to live abroad and quickly wants to move to another app, or rushes you into marriage.

5. Meet safely. Meet for the first time in a public place, inform your family or a friend, and do not travel alone to an unknown location.

6. Avoid links and unknown apps. Do not click suspicious links or install apps sent by a match.

7. Report immediately. If something feels wrong, use the Report option on the profile or contact our support team. You can also report cyber fraud at cybercrime.gov.in or call 1930 in India.

SahaJeevan staff will never call you to ask for your OTP or password.`,
  isActive: true,
};
// =================================================================

const main = async (): Promise<void> => {
  if (!config.database_url) {
    throw new Error(
      'DATABASE_URL is not set. Add it to backend/.env and run from the backend folder.',
    );
  }

  // Same validation the API uses (title + content required)
  const data = fraudAlertSchema.parse(DATA);

  await mongoose.connect(config.database_url);
  console.log('Database connected.');

  try {
    // Single-page record: update the existing one or create it if missing
    const saved = await FraudAlert.findOneAndUpdate(
      {},
      { $set: data },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    console.log(
      'Fraud & Alert saved successfully. Document id:',
      String(saved._id),
    );
    console.log(`  title: ${saved.title}`);
    console.log(`  active: ${saved.isActive}`);
  } finally {
    await mongoose.disconnect();
  }
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    if (error?.name === 'ZodError') {
      console.error(
        'Validation failed:',
        JSON.stringify(error.errors, null, 2),
      );
    } else {
      console.error('Failed to save Fraud & Alert:', error);
    }
    process.exit(1);
  });
