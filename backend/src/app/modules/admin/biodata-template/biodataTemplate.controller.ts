import { Request, Response } from 'express';
import { BiodataTemplate } from './biodataTemplate.model';
import { BiodataTemplateStatus } from './biodataTemplate.interface';
import {
  createBiodataTemplateSchema,
  updateBiodataTemplateSchema,
} from './biodataTemplate.validation';

// Create Biodata Template (Admin)
export const createBiodataTemplate = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const template = (req.file as any)?.path;

    if (!template) {
      res.status(400).json({
        success: false,
        message: 'Template image is required.',
      });
      return;
    }

    const validatedData = createBiodataTemplateSchema.parse({
      ...req.body,
      template,
    });

    const biodataTemplate = await BiodataTemplate.create(validatedData);

    res.status(201).json({
      success: true,
      message: 'Biodata template created successfully.',
      data: biodataTemplate,
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

// Get All Biodata Templates (Admin - all statuses, with pagination/search)
export const getBiodataTemplates = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter: any = {
      isDeleted: false,
    };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.search) {
      filter.title = {
        $regex: req.query.search,
        $options: 'i',
      };
    }

    const total = await BiodataTemplate.countDocuments(filter);

    const biodataTemplates = await BiodataTemplate.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: 'Biodata templates fetched successfully.',
      total,
      page,
      limit,
      data: biodataTemplates,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Get Active Biodata Templates (Public - for frontend consumption)
export const getActiveBiodataTemplates = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const biodataTemplates = await BiodataTemplate.find({
      isDeleted: false,
      status: BiodataTemplateStatus.ACTIVE,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Biodata templates fetched successfully.',
      data: biodataTemplates,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Get Biodata Template By ID
export const getBiodataTemplateById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const biodataTemplate = await BiodataTemplate.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!biodataTemplate) {
      res.status(404).json({
        success: false,
        message: 'Biodata template not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Biodata template fetched successfully.',
      data: biodataTemplate,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Update Biodata Template (Admin)
export const updateBiodataTemplate = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const existingTemplate = await BiodataTemplate.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!existingTemplate) {
      res.status(404).json({
        success: false,
        message: 'Biodata template not found.',
      });
      return;
    }

    const updatedData: any = {
      ...req.body,
    };

    // Update template image only if a new file is uploaded
    if (req.file) {
      updatedData.template = (req.file as any).path;
    }

    const validatedData = updateBiodataTemplateSchema.parse(updatedData);

    const biodataTemplate = await BiodataTemplate.findByIdAndUpdate(
      id,
      validatedData,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      message: 'Biodata template updated successfully.',
      data: biodataTemplate,
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

// Update Status Explicitly (Admin) - convenience endpoint
export const updateBiodataTemplateStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(BiodataTemplateStatus).includes(status)) {
      res.status(400).json({
        success: false,
        message: `Status must be one of: ${Object.values(BiodataTemplateStatus).join(', ')}`,
      });
      return;
    }

    const biodataTemplate = await BiodataTemplate.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      { status },
      { new: true },
    );

    if (!biodataTemplate) {
      res.status(404).json({
        success: false,
        message: 'Biodata template not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Biodata template status updated successfully.',
      data: biodataTemplate,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Delete Biodata Template (Admin - soft delete)
export const deleteBiodataTemplate = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const biodataTemplate = await BiodataTemplate.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        isDeleted: true,
      },
      {
        new: true,
      },
    );

    if (!biodataTemplate) {
      res.status(404).json({
        success: false,
        message: 'Biodata template not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Biodata template deleted successfully.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
