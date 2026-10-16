import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import SeatLayout from "./pages/SeatLayout";
import MyBookings from "./pages/MyBookings";
import Favorite from "./pages/Favorite";
import MovieDetails from "./pages/MovieDetails";
import { Toaster } from "react-hot-toast";
import Movies from "./pages/Movies";

import Layout from "./pages/admin/Layout";
import Dashboard from "./pages/admin/Dashboard";
import Addshow from "./pages/admin/Addshow";
import Listshow from "./pages/admin/Listshow";
import Listbookings from "./pages/admin/Listbookings";

const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith("/admin");

  return (
    <>
      <Toaster />

      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* USER ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/movies/:id/:date" element={<SeatLayout />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/favorite" element={<Favorite />} />

        {/* ADMIN ROUTES */}
        <Route path="/admin/*" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-shows" element={<Addshow />} />
          <Route path="list-shows" element={<Listshow />} />
          <Route path="list-bookings" element={<Listbookings />} />
        </Route>
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
};

export default App;


// The index route is the default page displayed when someone visits:
// http://localhost:5173/admin