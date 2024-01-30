import { useState } from "react";
import { Router, Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Nav/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default App;
