import React, { useEffect } from "react";
import { useAppContext } from "../contexts/AppContexts";
import { useLocation } from "react-router-dom";

const Loading = () => {
  const { navigate } = useAppContext();
  let { search } = useLocation();
  const query = new URLSearchParams(search);
  const nextUrl = query.get("next");

  useEffect(() => {
    if (nextUrl) {
      const timer = setTimeout(() => {
        navigate(nextUrl.startsWith("/") ? nextUrl : `/${nextUrl}`);
      }, 5000);

      return () => clearTimeout(timer); // cleanup
    }
  }, [nextUrl, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-24 w-24 border-4 border-gray-300 border-t-primary"></div>
    </div>
  );
};

export default Loading;
