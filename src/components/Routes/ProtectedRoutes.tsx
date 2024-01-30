import React from "react";
import { Outlet } from "react-router";
import PetSearch from "../PetSearch";

const useAuth = () => {
  const user = { loggedIn: false };
  return user && user.loggedIn;
};

const ProtectedRoutes = () => {
  const isAuth = useAuth();
  return isAuth ? <Outlet /> : <PetSearch />;
};

export default ProtectedRoutes;
