import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../contexts/AppContexts";

const Navbar1 = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate(); // ✅ use directly here
  const { user, setShowUserLogin, LogOut, searchQuery, setSearchQuery, getCartCount } = useAppContext();

  useEffect(() => {
       if (searchQuery.length > 0) {
          navigate("/products");
        } 
  }, [searchQuery]);


  return (
    <div className="shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        {/* Logo */}
        <NavLink to="/" onClick={() => setOpen(false)}>
          <img src={assets.logo} alt="logo" className="w-36" />
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-8">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">All Products</NavLink>
          <NavLink to="/contact">Contact</NavLink>

          {/* Search */}
          <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
              type="text"
              placeholder="Search products"
            />
            <img src={assets.search_icon} alt="search" className="w-4 h-4" />
          </div>

          {/* Cart */}
          <div
            className="relative cursor-pointer"
            onClick={() => navigate("/cart")}
          >
            <img
              src={assets.nav_cart_icon}
              alt="cart"
              className="w-6 opacity-80"
            />
            <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
              {getCartCount()}
            </button>
          </div>

          {/* Login / Logout */}
          {!user ? (
            <button
              onClick={() => {
                setOpen(false);
                setShowUserLogin(true);
              }}
              className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
            >
              Login
            </button>
          ) : (
            <div className="relative group">
              <img
                src={assets.profile_icon}
                alt="user"
                className="w-10 cursor-pointer"
              />
              <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40">
                <li
                  onClick={() => navigate("/my-orders")}
                  className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
                >
                  My orders
                </li>
                <li
                  onClick={LogOut}
                  className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="sm:hidden flex items-center gap-4">
          <div
            className="relative cursor-pointer"
            onClick={() => navigate("/cart")}
          >
            <img
              src={assets.nav_cart_icon}
              alt="cart"
              className="w-6 opacity-80"
            />
            <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
              3
            </button>
          </div>
          <img
            onClick={() => setOpen(true)}
            src={assets.menu_icon}
            alt="menu"
            className="w-6 cursor-pointer"
          />
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 left-0 h-full bg-white z-50 shadow-lg transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <img src={assets.logo} alt="logo" className="w-32" />
          <img
            onClick={() => setOpen(false)}
            src={assets.cross_icon}
            alt="close"
            className="w-6 cursor-pointer"
          />
        </div>

        {open && (
          <div
            className={`${
              open ? "flex" : "hidden"
            } absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}
          >
            <NavLink to="/" onClick={() => setOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/products" onClick={() => setOpen(false)}>
              All Products
            </NavLink>
            {user && (
              <NavLink to="/orders" onClick={() => setOpen(false)}>
                My orders
              </NavLink>
            )}
            <NavLink to="/contact" onClick={() => setOpen(false)}>
              Contact
            </NavLink>

            {!user ? (
              <button
                onClick={() => {
                  setShowUserLogin(true);
                  setOpen(false);
                }}
                className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
              >
                Login
              </button>
            ) : (
              <button
                onClick={() => {
                  LogOut();
                  setOpen(false);
                }}
                className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar1;
