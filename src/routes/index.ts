import identification from "../middlewares/Identification";
import expressSession from "../middlewares/expressSession";
import applicationController from "../controllers/ApplicationController"
// import userController from "../controllers/UserControllers";



export const HttpRoutes = (app:any) => {
  app.get('/',applicationController.login);

}
