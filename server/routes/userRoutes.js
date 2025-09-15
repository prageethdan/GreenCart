import express from 'express';
import { registerUser , loginUser, isAuth, logoutUser} from '../controllers/userController.js';  // 👈 match the export name
import authUser from '../middleware/authUser.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);  
userRouter.post("/login", loginUser); 
userRouter.get('/is-auth',authUser ,isAuth);  
userRouter.post('/logout', logoutUser);  



export default userRouter;
