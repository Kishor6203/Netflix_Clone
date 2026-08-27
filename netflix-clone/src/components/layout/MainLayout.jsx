import React, {
    useEffect,
  } from "react";
  
  import {
    Outlet,
    useLocation,
  } from "react-router-dom";
  
  import Navbar from "./Navbar";
  import Footer from "./Footer";
  
  const MainLayout = ({
    user,
    children,
  }) => {
    const location = useLocation();
  
    /* =====================================================
       SCROLL TO TOP ON ROUTE CHANGE
    ===================================================== */
  
    useEffect(() => {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }, [location.pathname]);
  
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar user={user} />
  
        <main className="min-h-screen">
          {children || <Outlet />}
        </main>
  
        <Footer />
      </div>
    );
  };
  
  export default MainLayout;