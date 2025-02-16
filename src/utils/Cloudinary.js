import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({
    path: './.env'
})

console.log(process.env.CLOUDINARY_CLOUD_NAME,process.env.CLOUDINARY_API_KEY,process.env.CLOUDINARY_API_SECRET);
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});
 const uploadcloudnary = async (localfilepath) => {
    try {
        const result = await cloudinary.uploader.upload(localfilepath,{
            resource_type: "auto",
        });
        console.log("the image has been uploaded to cloudinary",result);
        fs.unlinkSync(localfilepath);
        console.log(result.url);
        return result;
        
    } catch (error) {
        console.log("their was problem while uploading image on cloudnary",error);
        fs.unlinkSync(localfilepath);
        return null;
       
    }
}
export {uploadcloudnary}