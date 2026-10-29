import { Request, Response } from 'express';
import { WebSettings } from './webSettings.model';
import { updateWebSettingsSchema } from './webSettings.validation';

// GET — always returns a single settings document (creates a default one on first call)
export const getWebSettings = async (req: Request, res: Response) => {
  try {
    let settings = await WebSettings.findOne();

    if (!settings) {
      settings = await WebSettings.create({ websiteName: '' });
    }

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT — upserts the singleton settings document; logo/favicon updated only if a new file is uploaded
export const updateWebSettings = async (req: Request, res: Response) => {
  try {
    const files = req.files as
      | { [field: string]: Express.Multer.File[] }
      | undefined;

    const updatedData: any = { ...req.body };

    if (updatedData.maintenanceMode !== undefined) {
      updatedData.maintenanceMode =
        updatedData.maintenanceMode === 'true' ||
        updatedData.maintenanceMode === '1' ||
        updatedData.maintenanceMode === true;
    }

    if (files?.logo?.[0]) {
      updatedData.logo = files.logo[0].path;
    }

    if (files?.favicon?.[0]) {
      updatedData.favicon = files.favicon[0].path;
    }

    const validatedData = updateWebSettingsSchema.parse(updatedData);

    let settings = await WebSettings.findOne();

    if (!settings) {
      settings = await WebSettings.create(validatedData);
    } else {
      Object.assign(settings, validatedData);
      await settings.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Website settings updated successfully.',
      data: settings,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: error.message,
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
