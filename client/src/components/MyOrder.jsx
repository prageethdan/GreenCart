import React, { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContexts';
import { assets, dummyOrders } from "../assets/assets";
import toast from 'react-hot-toast';

const MyOrder = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { currency,axios, user } = useAppContext();

  const fetchMyOrders = async () => {
  try {
    const { data } = await axios.get("/api/order/user-orders");
    console.log("MyOrder.jsx: Orders fetched from backend:", data);

    if (data.success) {
      setMyOrders(data.orders);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};


  useEffect(() => {
    if(user){
    fetchMyOrders();
    }
  }, [user]);

  return (
    <div className="mt-16 pb-16 px-4 md:px-12">
      {/* Title */}
      <div className="flex flex-col items-center mb-12 text-center">
        <p className="text-3xl font-bold uppercase tracking-wide text-gray-800">
          My Orders
        </p>
        <div className="w-20 h-1 bg-primary rounded-full mt-2"></div>
      </div>

      {/* Orders List */}
      {myOrders.map((order) => (
        <div
          key={order._id}
          className="border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 mb-10 p-6 max-w-4xl mx-auto bg-white"
        >
          {/* Order Summary */}
          <p className="flex justify-between md:items-center text-gray-600 md:font-medium max-md:flex-col max-md:gap-2 mb-4">
            <span className="font-semibold text-gray-800">
              Order ID: <span className="text-primary">{order._id}</span>
            </span>
            <span>Payment: {order.paymentType}</span>
            <span>
              Total:{" "}
              <span className="text-lg font-semibold text-primary">
                {currency}{order.totalAmount || order.amount}
              </span>
            </span>
          </p>

          {/* Items in this Order */}
          <div className="divide-y divide-gray-200">
            {order.items.map((item, index) => {
              const product = item.productId; // populated product object
              return (
                <div
                  key={item._id}
                  className="flex flex-col md:flex-row md:items-center justify-between py-6 gap-6"
                >
                  {/* Product Image + Info */}
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-4 rounded-xl shadow-inner">
                      <img
                        src={product && product.Image ? product.Image[0] : "fallback.jpg"}
                        alt={product && product.name ? product.name : "Product"}
                        className="w-20 h-20 object-contain"
                      />
                    </div>
                    <div className="ml-5">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {product && product.name ? product.name : "Product"}
                      </h2>
                      <p className="text-gray-500">{product && product.category ? product.category : ""}</p>
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="flex flex-col justify-center md:ml-8 mb-4 md:mb-0">
                    <p>
                      Quantity:{" "}
                      <span className="font-medium text-gray-800">
                        {item.quantity || "1"}
                      </span>
                    </p>
                    <p>Status: <span className="capitalize">{order.status}</span></p>
                    <p>
                      Date:{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Amount */}
                  <p className="text-primary text-lg font-bold">
                    {currency}{product && product.offerPrice ? product.offerPrice * (item.quantity || 1) : ""}
                  </p>
                  
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrder;

