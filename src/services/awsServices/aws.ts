import AWS from "aws-sdk";

import env from "../../env"; 


const accessKeyId = env.AWS_ACCESS_KEY; 
const secretAccessKey = env.AWS_SECRET_KEY; 

AWS.config.update({
	    accessKeyId ,
	    secretAccessKey
});

export default AWS; 
