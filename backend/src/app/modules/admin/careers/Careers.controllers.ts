import { Request, Response } from 'express';
import { Careers } from './Careers.model';
import {
  createCareersSchema,
  removeCareerImageSchema,
} from './Careers.validation';

// ==========================================
// CREATE OR UPDATE CAREERS PAGE
// (Careers page is a single CMS document, same
// pattern as the About Us module — upsert on PUT)
// ==========================================
export const createOrUpdateCareers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const uploadedFiles =
      (req.files as Express.Multer.File[] | undefined) ?? [];
    const newImages = uploadedFiles.map((file) => file.path);

    const careersData: any = {};

    if (req.body.title !== undefined) {
      careersData.title = req.body.title;
    }

    if (req.body.subtitle !== undefined) {
      careersData.subtitle = req.body.subtitle;
    }

    const validatedData = createCareersSchema.parse({
      title: careersData.title,
      subtitle: careersData.subtitle,
    });

    const existingCareers = await Careers.findOne({ isDeleted: false });

    // Newly uploaded images are appended to whatever is already saved,
    // so re-saving text fields never wipes out the existing gallery.
    const mergedImages = [...(existingCareers?.images ?? []), ...newImages];

    const careers = await Careers.findOneAndUpdate(
      { isDeleted: false },
      {
        $set: {
          ...validatedData,
          images: mergedImages,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    res.status(200).json({
      success: true,
      message: 'Careers page saved successfully.',
      data: careers,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: error.errors,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// ==========================================
// GET CAREERS PAGE
// ==========================================
export const getCareers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const careers = await Careers.findOne({ isDeleted: false });

    if (!careers) {
      res.status(404).json({
        success: false,
        message: 'Careers page not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Careers page fetched successfully.',
      data: careers,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// ==========================================
// REMOVE A SINGLE IMAGE FROM THE GALLERY
// ==========================================
export const removeCareerImage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { image } = removeCareerImageSchema.parse(req.body);

    const careers = await Careers.findOneAndUpdate(
      { isDeleted: false },
      { $pull: { images: image } },
      { new: true },
    );

    if (!careers) {
      res.status(404).json({
        success: false,
        message: 'Careers page not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Image removed successfully.',
      data: careers,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: error.errors,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// ==========================================
// SOFT DELETE ENTIRE CAREERS PAGE
// ==========================================
export const deleteCareers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const careers = await Careers.findOneAndUpdate(
      { isDeleted: false },
      { isDeleted: true },
      { new: true },
    );

    if (!careers) {
      res.status(404).json({
        success: false,
        message: 'Careers page not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Careers page deleted successfully.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
