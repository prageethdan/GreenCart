import express from 'express';
import authUser from '../middleware/authUser.js';
import { placeOrderCOD,getOrdersByUserId,getAllOrders } from '../controllers/orderController.js';


const orderRouter = express.Router();

orderRouter.post('/cod', authUser, placeOrderCOD)
orderRouter.post('/user-orders', authUser, getOrdersByUserId);
orderRouter.get('/all-orders', authUser, getAllOrders);

export default orderRouter;

