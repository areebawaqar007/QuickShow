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
import { SignIn } from "@clerk/react";
import Layout from "./pages/admin/Layout";
import Dashboard from "./pages/admin/Dashboard";
import Addshow from "./pages/admin/Addshow";
import Listshows from "./pages/admin/Listshows";
import Listbookings from "./pages/admin/Listbooking";
import { useAppContext } from "./context/AppContext";
import Loading from "./components/Loading";
const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith("/admin");
  const { user } = useAppContext();
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
        <Route path="/loading/:nextUrl" element={<Loading />} />
        
        <Route path="/favorite" element={<Favorite />} />

        {/* ADMIN ROUTES */}
        {/* It checks whether the user is authenticated, not whether the user has an admin role. To restrict access to admins
        , you must also check their role and enforce authorization on the backend. */}
          <Route
          path="/admin/*"
          element={
            user ? (
              <Layout />
            ) : (
              <div className="min-h-screen flex justify-center items-center">
                <SignIn fallbackRedirectUrl={'/admin'} />
              </div>
            )
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="add-shows" element={<Addshow />} />
          <Route path="list-shows" element={<Listshows />} />
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