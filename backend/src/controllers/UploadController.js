import { cloudinary } from '../config/cloudinary.js';
import { config } from '../config/index.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

export const uploadController = {
  image: asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(422, 'Image file is required');
    if (!config.cloudinary.cloudName) throw new ApiError(503, 'Cloudinary is not configured');

    const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: `restaurant-saas/${req.user.restaurant || req.user.id}`,
      resource_type: 'image',
    });

    sendSuccess(res, {
      message: 'Image uploaded',
      data: { url: result.secure_url, publicId: result.public_id },
    });
  }),
};
