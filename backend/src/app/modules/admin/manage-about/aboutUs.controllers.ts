import { Request, Response } from 'express';
import { AboutUs } from './aboutUs.model';
import { aboutUsValidation } from './aboutUs.validation';

// stats/awards/steps arrive as JSON-stringified arrays inside the
// multipart/form-data body, so they need to be parsed before validation.
const parseJsonArray = (value: unknown): unknown[] => {
  if (!value) return [];

  if (Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value as string);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const createOrUpdateAboutUs = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;

    const payload = {
      // Hero
      heroBadge: req.body.heroBadge,
      heroTitle: req.body.heroTitle,
      heroHighlightedTitle: req.body.heroHighlightedTitle,
      heroDescription: req.body.heroDescription,
      heroBadgeText: req.body.heroBadgeText,

      // CEO
      ceoSectionTitle: req.body.ceoSectionTitle,
      ceoName: req.body.ceoName,
      ceoDesignation: req.body.ceoDesignation,
      ceoLetter: req.body.ceoLetter,

      // Mission & Vision
      missionVisionTitle: req.body.missionVisionTitle,
      missionTitle: req.body.missionTitle,
      missionDescription: req.body.missionDescription,
      visionTitle: req.body.visionTitle,
      visionDescription: req.body.visionDescription,

      // About
      aboutSectionTitle: req.body.aboutSectionTitle,
      aboutDescription: req.body.aboutDescription,
      stats: parseJsonArray(req.body.stats),

      // Awards
      awardSectionTitle: req.body.awardSectionTitle,
      awards: parseJsonArray(req.body.awards),

      // How To Use
      howToTitle: req.body.howToTitle,
      steps: parseJsonArray(req.body.steps),
    };

    const validationResult = aboutUsValidation.safeParse(payload);

    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.flatten(),
      });
      return;
    }

    const updateData: Record<string, unknown> = {
      ...validationResult.data,
    };

    // Only overwrite an image if a new file was uploaded,
    // so re-saving the form without picking a new file keeps the old one.
    if (files?.heroImage?.[0]) {
      updateData.heroImage = files.heroImage[0].path;
    }

    if (files?.ceoImage?.[0]) {
      updateData.ceoImage = files.ceoImage[0].path;
    }

    if (files?.aboutImage?.[0]) {
      updateData.aboutImage = files.aboutImage[0].path;
    }

    const aboutUs = await AboutUs.findOneAndUpdate(
      { isDeleted: false },
      { $set: updateData },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    res.status(200).json({
      success: true,
      message: 'About Us content saved successfully.',
      data: aboutUs,
    });
  } catch (error: any) {
    console.error('About Us Error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to save About Us content.',
      error: error.message,
    });
  }
};

export const getAboutUs = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const aboutUs = await AboutUs.findOne({ isDeleted: false }).lean();

    if (!aboutUs) {
      res.status(404).json({
        success: false,
        message: 'About Us content not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'About Us content fetched successfully.',
      data: aboutUs,
    });
  } catch (error: any) {
    console.error('Get About Us Error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch About Us content.',
      error: error.message,
    });
  }
};
