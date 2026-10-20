import { inngest } from '../inngest/index.js';
import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
// import stripe from 'stripe';
import mongoose from 'mongoose';


// Check whether the selected seats are available for a particular movie show.
const checkSeatsAvailability = async (showId, selectedSeats) => {
  try {
    // Validate if showId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(showId)) {
      console.log('Invalid ObjectId:', showId);
      return false;
    }

    const showData = await Show.findById(showId);
    if (!showData) {
      return false;
    }

    const occupiedSeats = showData.occupiedSeats;

    const isAnySeatTaken = selectedSeats.some((seat) => occupiedSeats[seat]);

    return !isAnySeatTaken;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

// the user wants to book seats A1 and A2.

// The function follows this sequence:
// 1. Validate the show ID.
// 2. Find the show in MongoDB.
// 3. Check whether the show exists.
// 4. Retrieve its occupied seats.
// 5. Check whether any selected seat is occupied.
// 6. Return the result.