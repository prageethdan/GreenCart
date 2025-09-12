import Order from "../models/Order.js";

 export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
          
        if (!address || !userId || !items || items.length === 0) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }
         
        let amount = await items.reduce(async(acc, item) => {
            const product = await Product.findById(item.productId);
            return (await acc) + (product.price * item.quantity);
        }, 0);

        amount += Math.floor(amount * 0.02); 

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: 'COD',
            
        });
        return res.json({ success: true, message: "Order placed successfully" });
        
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }

 }


export const getOrdersByUserId = async (req, res) => {

    try{
        const {userId} = req.body;
        const orders = await Order.find({
            userId,
            $or: [{paymentType:"COD"},{isPaid:true}]
        }).populate("items.product address"). sort({createdAt: -1});
         res.json({success:true, orders});
    }
    catch (error){
        res.json({success:false , message:error.message});
    }
}

   
export const getAllOrders = async (req,res) =>{

   try{
     const orders = await Order.find({
        $or: [{paymentType:"COD"},{isPaid:true}]
     }).populate("items.product address");
     res.json({success:true, orders});

   }catch (error) {
     console.error("Error fetching all orders:", error);
     res.status(500).json({ success: false, message: "Internal server error" });
   }
 


}
