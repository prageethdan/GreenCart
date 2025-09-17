import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Address from "../models/Address.js";
import Stripe from "stripe"; // <-- Correct import

export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;

    if (!address || !userId || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Calculate total amount
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ success: false, message: `Product not found: ${item.productId}` });
      }
      amount += product.price * item.quantity;
    }
    amount += Math.floor(amount * 0.02);

    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: 'COD',
      isPaid: false,
    });

    

    return res.json({ success: true, message: "Order placed successfully" });

  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//stripe web hooks

export const stripeWebhooks = async (req, res) => {
  const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body, // ⚠️ req.body must be raw, not parsed JSON
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        // find checkout session linked to this paymentIntent
        const session = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });

        if (session.data.length > 0) {
          const { orderId, userId } = session.data[0].metadata;

          // ✅ mark payment as paid
          await Order.findByIdAndUpdate(orderId, { isPaid: true });

          // ✅ clear user cart
          await User.findByIdAndUpdate(userId, { cartItems: {} });

          console.log(`Order ${orderId} marked as paid & cart cleared for user ${userId}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Error handling webhook:", err.message);
    res.status(500).send("Webhook handler error");
  }
};




export const placeOrderStripe = async (req, res) => {
  try {
    console.log("placeOrderStripe: Received request body:", req.body);
    const { userId, items, address } = req.body;
    const { origin } = req.headers;
    console.log("placeOrderStripe: Origin header:", origin);

    if (!address || !userId || !items || items.length === 0) {
      console.warn("placeOrderStripe: Missing required fields", { address, userId, items });
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    let productData = [];
    let amount = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      console.log("placeOrderStripe: Fetched product:", product);

      if (!product) {
        console.error("placeOrderStripe: Product not found:", item.productId);
        return res.status(400).json({ success: false, message: `Product not found: ${item.productId}` });
      }

      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity
      });

      amount += product.price * item.quantity;
    }
    amount += Math.floor(amount * 0.02);

    console.log("placeOrderStripe: Calculated amount:", amount);

    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: 'Online',
      isPaid: false,
    });

    console.log("placeOrderStripe: Created order:", order);

    // Correct Stripe initialization
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = productData.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.floor(item.price + item.price * 0.02) * 100,
        },
        quantity: item.quantity,
      };
    });

    console.log("placeOrderStripe: Stripe line_items:", line_items);

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId
      }
    });

    console.log("placeOrderStripe: Stripe session created:", session);

    return res.json({ success: true, url: session.url });

  } catch (error) {
    console.error("placeOrderStripe: Error placing order:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get Orders By User ID
export const getOrdersByUserId = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ success: false, message: "Missing user ID" });
    }

    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }]
    })
      .populate({ path: "items.productId", model: "product" })
      .populate({ path: "address", model: "Address" })
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get All Orders (Admin/Seller)
export const getAllOrders = async (req, res) => {
  try {
    console.log("getAllOrders: Start fetching orders");
    console.log("getAllOrders: Order model keys:", Object.keys(Order.schema.paths));
    console.log("getAllOrders: Address model loaded:", !!Address);

    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }]
    })
      .populate({ path: "items.productId", model: "product" })
      .populate({ path: "address", model: "Address" })
      .sort({ createdAt: -1 });

    console.log("getAllOrders: Orders fetched:", orders.length);
    res.json({ success: true, orders });
  } catch (error) {
    console.error("getAllOrders: Error details:", error);
    if (error.name === "MissingSchemaError") {
      console.error("getAllOrders: MissingSchemaError - Did you register the Address model?");
    }
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};