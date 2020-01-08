import identification from "../middlewares/Identification";
import expressSession from "../middlewares/expressSession";
import applicationController from "../controllers/ApplicationController"
import userController from "../controllers/UserController";



const httpRoutes = (app:any) => {
  app.get('/',applicationController.login);
  app.post('/login',applicationController.login);
  app.post('/register',userController.register);
}

export default httpRoutes;