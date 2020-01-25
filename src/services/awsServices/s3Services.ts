import AWS from "./aws";
import fse from "fs-extra"; 
import path from "path"; 
import env from "../../env"; 
import {promisify} from "util"; 

const bucketName = env.BUCKET_NAME;
const imageFolder = env.IMAGE_FOLDER; 

interface IUploadFile {
	file_path: string
}


export const uploadImage = async (props: IUploadFile) =>{
   	const {file_path} = props; 
	const s3 = new AWS.S3(); 

    const fileName = path.basename(file_path); 

    const fileNameSplit = fileName.split("."); 
    const fileExt = fileNameSplit[fileNameSplit.length -1]; 
    console.log("fileExt ", fileExt); 
    
	try{
		let params:any = {
            ACL: "public-read", 
			Bucket: bucketName, 
			Body: fse.createReadStream(file_path), 
			Key: `${imageFolder}/${Date.now()}_${path.basename(file_path)}`
		}
        if(fileExt === "svg"){
            params.ContentType = "image/svg+xml"; 
        }

		const uploadPath = await s3.upload(params).promise();
		return uploadPath; 
	}catch(err){
		console.log("upload image to s3 error", err);
		throw err;
	}

}
