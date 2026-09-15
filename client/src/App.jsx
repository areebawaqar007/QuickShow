import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import SeatLayout from './pages/SeatLayout'
import MyBookings from './pages/MyBookings'
import Favorite from './pages/Favorite'
import MovieDetails from './pages/MovieDetails'

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>  
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<div>Movies Page</div>} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/movies/:id/:date" element={<SeatLayout />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/favorite" element={ Favorite} />


      </Routes>
      <Footer />
    </>
  )
}

export default App
