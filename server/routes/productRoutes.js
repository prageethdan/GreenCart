import express from 'express';
import {upload} from '../configs/multer.js';
import authSeller from '../middleware/authSeller.js';
import {addProduct,changeStock, productById, productList} from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.post('/add', upload.array('images'), authSeller, addProduct);
productRouter.get('/list', productList);
productRouter.post('/id', productById);
productRouter.post('/stock', changeStock);

export default productRouter;