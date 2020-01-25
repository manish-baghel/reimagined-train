import { upload } from "../initServer";

const imageUpload = upload.array("photos",4);

export default imageUpload;