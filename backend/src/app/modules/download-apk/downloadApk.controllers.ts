import { Request, Response } from 'express';
import { DownloadApk } from './downloadApk.model';
import { downloadApkSchema } from './downloadApk.validation';

export const createOrUpdateDownloadApk = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const validationResult = downloadApkSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
      });
      return;
    }

    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;

    const updateData: Record<string, unknown> = {
      ...validationResult.data,
    };

    const qrCodeFile = files?.qrCode?.[0];
    const apkImageFile = files?.apkImage?.[0];

    // Only overwrite the stored image if a new file was uploaded,
    // so re-saving the form without a new file keeps the existing image.
    if (qrCodeFile) {
      updateData.qrCode = (qrCodeFile as any).path;
    }

    if (apkImageFile) {
      updateData.apkImage = (apkImageFile as any).path;
    }

    const downloadApk = await DownloadApk.findOneAndUpdate(
      {},
      {
        $set: updateData,
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
      message: 'Download APK settings saved successfully',
      data: downloadApk,
    });
  } catch (error: any) {
    console.error('Create/Update Download APK Error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to save Download APK settings',
      error: error.message,
    });
  }
};

export const getDownloadApk = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const downloadApk = await DownloadApk.findOne().lean();

    if (!downloadApk) {
      res.status(404).json({
        success: false,
        message: 'Download APK settings not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Download APK settings fetched successfully',
      data: downloadApk,
    });
  } catch (error: any) {
    console.error('Get Download APK Error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch Download APK settings',
      error: error.message,
    });
  }
};
