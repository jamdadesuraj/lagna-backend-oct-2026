import { Request, Response } from 'express';
import { AppSettings } from './appSettings.model';
import { updateAppSettingsSchema } from './appSettings.validation';

// GET — always returns a single settings document (creates a default one on first call)
export const getAppSettings = async (req: Request, res: Response) => {
  try {
    let settings = await AppSettings.findOne();

    if (!settings) {
      settings = await AppSettings.create({ appName: '' });
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

// PUT — upserts the singleton settings document; logo only updated if a new file is uploaded
export const updateAppSettings = async (req: Request, res: Response) => {
  try {
    const updatedData: any = { ...req.body };

    if (req.file) {
      updatedData.appLogo = (req.file as any).path;
    }

    const validatedData = updateAppSettingsSchema.parse(updatedData);

    let settings = await AppSettings.findOne();

    if (!settings) {
      settings = await AppSettings.create(validatedData);
    } else {
      Object.assign(settings, validatedData);
      await settings.save();
    }

    return res.status(200).json({
      success: true,
      message: 'App settings updated successfully.',
      data: settings,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: error.errors,
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
