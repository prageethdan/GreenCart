import express from 'express';
import authUser from '../middleware/authUser.js';
import { placeOrderCOD,getOrdersByUserId,getAllOrders, placeOrderStripe } from '../controllers/orderController.js';


const orderRouter = express.Router();

orderRouter.post('/cod', authUser, placeOrderCOD)
orderRouter.get('/user-orders', authUser, getOrdersByUserId);
orderRouter.get('/all-orders', authUser, getAllOrders);
orderRouter.post('/stripe', authUser, placeOrderStripe);

export default orderRouter;

