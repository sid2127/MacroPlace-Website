import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
 });


const UploadOnCloudinary = async (localPathFile) =>{
    try {
        if(!localPathFile){
            return null;
        }

        const response = await cloudinary.uploader.upload(localPathFile, {
            resource_type: "auto"
        })

        //console.log("File is uploaded sucessfully" , response.url);

        fs.unlinkSync(localPathFile)
        return response;
        
    } catch (error) {
        //fs.unlink(localPathFile)  

        console.error("Cloudinary upload failed:", error);

        if (localPathFile) {
            await fs.promises.unlink(localPathFile).catch(() => {});
        }

        return null;
    }
}


export {UploadOnCloudinary}
