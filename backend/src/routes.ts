import { Router } from 'express';
import multer from "multer";
import uploadConfig from './config/upload';

//CONTROLLERS
import AuthController from "./controllers/authController";
import UsersController from "./controllers/usersController"
import OrphanagesController from "./controllers/orphanagesController";

//MIDDLEWARE
import { authJWT } from "./middleware/authJWT";

const routes = Router();
const upload = multer(uploadConfig);

routes.get('/login', AuthController.login);
routes.post('/register', UsersController.registerUser);

routes.post('/change-password', authJWT, AuthController.changePassword);
routes.get('/orphanages', authJWT, OrphanagesController.index);
routes.get('/orphanages/:id',  authJWT, OrphanagesController.show);
routes.post('/orphanages', authJWT, upload.array('images'), OrphanagesController.create);

export default routes;
