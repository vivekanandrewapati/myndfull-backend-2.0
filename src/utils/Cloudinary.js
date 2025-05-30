import { v2 as cloudinary } from "cloudinary"
import fs from "fs"


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        // Remove file from local storage
        fs.unlinkSync(localFilePath);
        return response.url;

    } catch (error) {
        // Remove the locally saved temporary file as the upload operation failed
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        console.error("Cloudinary upload error:", error);
        return null;
    }
};

const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return null;

        // Delete the file from cloudinary
        const response = await cloudinary.uploader.destroy(publicId);
        return response;
    } catch (error) {
        return null;
    }
};

export { uploadOnCloudinary, deleteFromCloudinary }