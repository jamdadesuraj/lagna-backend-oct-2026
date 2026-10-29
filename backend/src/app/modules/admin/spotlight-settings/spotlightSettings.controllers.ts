import { Request, Response } from 'express';
import { SpotlightSettings } from './spotlightSettings.model';

export const getSpotlightSettings = async (req: Request, res: Response) => {
  try {
    let settings = await SpotlightSettings.findOne();

    if (!settings) {
      settings = await SpotlightSettings.create({ amount: 0 });
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

export const updateSpotlightSettings = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;

    if (typeof amount !== 'number' || amount < 0) {
      return res.status(400).json({
        success: false,
        message: 'A valid, non-negative amount is required.',
      });
    }

    let settings = await SpotlightSettings.findOne();

    if (!settings) {
      settings = await SpotlightSettings.create({ amount });
    } else {
      settings.amount = amount;
      await settings.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Spotlight amount updated successfully.',
      data: settings,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
