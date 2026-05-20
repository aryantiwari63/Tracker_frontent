import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initAuthFlow } from "../../services/auth";

export default function Refresh() {
  const location = useLocation(); // Get the current route

  useEffect(() => {
    console.log("Current pathname:", location.pathname);
    
    if (location.pathname !== "/login") {
      console.log("Running function because pathname is NOT /login");
      initAuthFlow();
    } 
  }, [location.pathname]);

  return null;
}
