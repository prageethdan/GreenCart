import express from 'express';
import { SellerLogin, isSellerAuth, SellerLogout}  from '../controllers/SellerController.js';
import authSeller from '../middleware/authSeller.js';

const sellerRouter = express.Router();


sellerRouter.post("/login",SellerLogin );
sellerRouter.get('/is-auth',authSeller, isSellerAuth);
sellerRouter.post('/logout', SellerLogout);

export default sellerRouter;