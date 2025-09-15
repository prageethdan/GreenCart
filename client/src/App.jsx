// App.jsx
import React from 'react'
import Navbar1 from './components/Navbar1'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import { Toaster } from "react-hot-toast"
import Footer from './components/Footer'
import Login from './components/Login'
import { useAppContext } from './contexts/AppContexts'   // ✅ FIX: import added
import AllProducts from './pages/AllProducts'
import ProductCategory from './pages/ProductCategory'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import AddAddress from './pages/AddAddress'
import MyOrder from './components/MyOrder'
import SellerLogin from './components/seller/SellerLogin.jsx'
import SellerLayout from './pages/seller/SellerLayout'
import AddProduct from './pages/seller/AddProducts'
import ProductList from './pages/seller/ProductList'
import Orders from './pages/seller/Orders'  


const App = () => {
  const isSellerPath = useLocation().pathname.includes("seller");
  const { showUserLogin, isSeller } = useAppContext();  // ✅ now works

  return (
    <div className='text-default min-h-screen text-gray-700 bg-white '>
      {isSellerPath ? null : <Navbar1 />}
      {showUserLogin ? <Login /> : null}

      <Toaster position="top-center" toastOptions={{ style: { zIndex: 9999 } }} />
      <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<AllProducts/>} />
          <Route path='/products/:category' element={<ProductCategory/>} />
          <Route path='/products/:category/:id' element={<ProductDetails/>} />
          <Route path='/cart' element={<Cart/>} />
          <Route path='/add-address' element={<AddAddress/>} />
          <Route path='/my-orders' element={<MyOrder/>} />
          <Route path='/seller' element={isSeller ? <SellerLayout/> : <SellerLogin/>} >
             <Route index element={isSeller ? <AddProduct/>:null} />
             <Route path='product-list' element={<ProductList/>} />
             <Route path='orders' element={<Orders/>} />
           </Route>
        </Routes>
      </div>
      {!isSellerPath && <Footer />}
    </div>
  )
}

export default App
