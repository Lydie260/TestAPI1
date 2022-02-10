import express from "express";
import SuperAdmin from "../controllers/SuperAdmin.controller.js";
import UserController from "../controllers/user.controllers";
import verifyLogin from "../middlewares/Authorization.js";

const routes = express()

routes.post('/signup', UserController.signup)
routes.post('/signin', UserController.signin)
routes.get('/users',  SuperAdmin.getAllUsers)
routes.patch('/role', verifyLogin, SuperAdmin.changeRoles)
routes.patch('/status', verifyLogin, SuperAdmin.changeStatus)
routes.delete('/delete', SuperAdmin.deleteUser)
routes.post('/forgetPassword',UserController.forgetPassword)
routes.post('/resetPassword',UserController.resetPassword)

export default routes;
