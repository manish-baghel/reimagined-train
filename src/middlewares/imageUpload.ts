import { upload } from "../initServer";

const reqImageUpload = upload.array("photos",4);
const schoolImageUpload = upload.single("schoolImage");

export { schoolImageUpload, reqImageUpload };