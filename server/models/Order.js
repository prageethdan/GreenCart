import mongoose from 'mongoose';

const orderschema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: [{
        productId: { type: String, required: true, ref:'product' },
        quantity: { type: Number, required: true }
    }],
    amount : { type: Number, required: true },
    address: {type: String, required: true, ref: 'address'},
    status: { type: String, default: 'order Placed' },
    paymentType: { type: String, required: true },
    isPaid: { type: Boolean, required:true, default: false },
},{timestamps: true})

const Order = mongoose.models.Order || mongoose.model('Order', orderschema);

export default Order;