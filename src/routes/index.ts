import identification from "../middlewares/Identification";
import expressSession from "../middlewares/expressSession";
import imageUpload from "../middlewares/imageUpload";
import applicationController from "../controllers/ApplicationController"
import userController from "../controllers/UserController";
import requirementController from "../controllers/RequirementController";
import schoolController from "../controllers/SchoolController";


const httpRoutes = (app:any) => {
  app.get('/',applicationController.login);
  app.post('/login',applicationController.login);
  app.post('/register',userController.register);

  app.post('/addReq',expressSession,identification,imageUpload,requirementController.addRequirement);

  app.post('/addSchool',expressSession,identification,schoolController.register);
}

export default httpRoutes;