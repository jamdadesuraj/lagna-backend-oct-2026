import { Request, Response } from 'express';
import { Blog } from './blogModel';
import { createBlogSchema, updateBlogSchema } from './blogValidation';

export const createBlog = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const image = (req.file as any)?.path;

    if (!image) {
      res.status(400).json({
        success: false,
        message: 'Blog image is required.',
      });
      return;
    }

    const validatedData = createBlogSchema.parse({
      ...req.body,
      image,
      isActive:
        req.body.isActive !== undefined
          ? req.body.isActive === 'true'
          : undefined,
    });

    const blog = await Blog.create(validatedData);

    res.status(201).json({
      success: true,
      message: 'Blog created successfully.',
      data: blog,
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

export const updateBlog = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const existingBlog = await Blog.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!existingBlog) {
      res.status(404).json({
        success: false,
        message: 'Blog not found.',
      });
      return;
    }

    const updatedData: any = {
      ...req.body,
    };

    // Update image only if a new file is uploaded
    if (req.file) {
      updatedData.image = (req.file as any).path;
    }

    // Convert multipart/form-data string values
    if (updatedData.isActive !== undefined) {
      updatedData.isActive = updatedData.isActive === 'true';
    }

    const validatedData = updateBlogSchema.parse(updatedData);

    const blog = await Blog.findByIdAndUpdate(id, validatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully.',
      data: blog,
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

export const getBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const blogs = await Blog.find({ isDeleted: false }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Blogs fetched successfully.',
      data: blogs,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

export const getBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const blog = await Blog.findOne({ _id: id, isDeleted: false });

    if (!blog) {
      res.status(404).json({
        success: false,
        message: 'Blog not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Blog fetched successfully.',
      data: blog,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

export const deleteBlog = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const blog = await Blog.findOneAndUpdate(
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

    if (!blog) {
      res.status(404).json({
        success: false,
        message: 'Blog not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
