import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;  
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;

  const navigate = useNavigate();
  const [user, setUser] = useState(true); // ✅ logged in by default for testing
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState('');


  const fetchSeller = async () => {
    try {
      const {data} = await axios.get("/api/sellers/is-auth");
       if(data.success){
         setIsSeller(true);
       }
       else{
         setIsSeller(false);
       }
    } catch (error) {
      setIsSeller(false);
      console.log("Error in fetching seller auth", error);
    }
  }; 



  // ✅ fetch products function
  const fetchProducts = async () => {
    setProducts(dummyProducts);
  };

  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    toast.success("added to cart");
  };

  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("cart updated");
  };

  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if(cartData[itemId]=== 0){
        delete cartData[itemId];
      }
    }

    setCartItems(cartData);
    toast.success("removed from cart");
  };


  const getCartCount = () => {
    let count = 0;
    for(const item in cartItems){
      count += cartItems[item];
    }
    return count;
  }
   

  //get cart total price
  const getCartTotal = () => {
    let total = 0;
    for(const items in cartItems){
         let itemInfo = products.find(product => product._id === items);
         if(itemInfo && cartItems[items]>0){
             total += itemInfo.offerPrice * cartItems[items];
         }  
    }
    return Math.floor(total * 100) / 100;
  }

  // ✅ fetch products on component mount
  useEffect(() => {
    fetchProducts();
    fetchSeller();
  }, []);

  // ✅ logout handler
  const LogOut = () => {
    setUser(null);
    setShowUserLogin(false);
    navigate("/");
  };

  const value = {
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    LogOut,
    navigate,
    products,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    setCartItems,
    searchQuery,
    setSearchQuery,
    getCartTotal,
    getCartCount,
    axios
  };

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
