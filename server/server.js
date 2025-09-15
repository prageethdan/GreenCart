import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js'; 
import dotenv from 'dotenv';
dotenv.config();
import userRouter from './routes/userRoutes.js';
import sellerRouter from './routes/sellerRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoutes.js';
import cartRouter from './routes/cartRoutes.js';
import addressRouter from './routes/addressRoutes.js';
import orderRouter from './routes/orderRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

await connectDB(); // Connect to MongoDB
connectCloudinary();

//allow multiple origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173'
];

//middleware configurations
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigins, credentials: true}));

app.get('/', (req,res) => res.send('Api is working'));
app.use('/api/users',userRouter);
app.use('/api/sellers', sellerRouter); 
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/addresses', addressRouter);
app.use('/api/order', orderRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

