import { inngest } from "../inngest/index.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import stripe from 'stripe';
import mongoose from "mongoose";

// Check whether the selected seats are available for a particular movie show.
const checkSeatsAvailability = async (showId, selectedSeats) => {
  try {
    // Validate if showId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(showId)) {
      console.log("Invalid ObjectId:", showId);
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

// this function checks seat availability, creates a booking in MongoDB,
//     marks the selected seats as occupied, and calculates the booking amount.


// export const createBooking = async (req, res) => {
//   try {
//     // STEP 1: Get the authenticated user's ID from Clerk.
//     const { userId } = req.auth();

//     // Get the show ID and seats selected by the user from the request body.
//     const { showId, selectedSeats } = req.body;

//     // Get the frontend URL from request headers (needed for Stripe redirects).
//     const { origin } = req.headers;

//     console.log("Received showId:", showId, "Type:", typeof showId);

//     // STEP 2: Validate the show ID's MongoDB ObjectId format.
//     // If invalid, return an error response and stop execution.
//     if (!mongoose.Types.ObjectId.isValid(showId)) {
//       console.log("Invalid ObjectId received:", showId);

//       return res.json({
//         success: false,
//         message: "Invalid show ID format",
//       });
//     }

//     // STEP 3: Check whether all selected seats are available.
//     // checkSeatsAvailability() returns true if no selected seat is occupied.
//     const isAvailable = await checkSeatsAvailability(showId, selectedSeats);

//     // If any selected seat is occupied, stop the booking process.
//     if (!isAvailable) {
//       return res.json({
//         success: false,
//         message: "Selected Seats are not available",
//       });
//     }

//     // STEP 4: Fetch the show from MongoDB and populate its movie details.
//     // populate("movie") retrieves the associated movie document.
//     const showData = await Show.findById(showId).populate("movie");

//     // STEP 5: Calculate the total price and create a booking in MongoDB.
//     // Total amount = price per seat × number of selected seats.
//     const booking = await Booking.create({
//       user: userId, // ID of the user making the booking.
//       show: showId, // ID of the selected movie show.
//       amount: showData.showPrice * selectedSeats.length,
//       bookedSeats: selectedSeats, // Seats selected by the user.
//     });

//     // STEP 6: Mark each selected seat as occupied by this user.
//     // Store the user's ID against each seat in the occupiedSeats object.
//     selectedSeats.forEach((seat) => {
//       showData.occupiedSeats[seat] = userId;
//     });

//     // Tell Mongoose that the occupiedSeats object has been modified.
//     showData.markModified("occupiedSeats");

//     // Save the updated occupied seats to MongoDB.
//     await showData.save();

//     // STEP 7: STRIPE PAYMENT (currently disabled).
//     // If enabled, this section would create a Stripe checkout session.
//     const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

//     // Define the movie and price information for Stripe checkout.
//     const line_items = [
//       {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: showData.movie.title,
//           },
//           unit_amount: Math.floor(booking.amount * 100),
//         },
//         quantity: 1,
//       },
//     ];

//     // Create a Stripe checkout session with success and cancellation URLs.
//     // The session expires after 30 minutes.
//     const session = await stripeInstance.checkout.sessions.create({
//       success_url: `${origin}/loading/my-bookings`,
//       cancel_url: `${origin}/my-bookings`,
//       line_items: line_items,
//       mode: "payment",
//       metadata: {
//         bookingId: booking._id.toString(),
//       },
//       expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
//     });

//     // Save the Stripe payment URL in the booking document.
//     booking.paymentLink = session.url;
//     await booking.save();

//     // STEP 8: Schedule a background task to check payment status.
//     // Inngest would process this event asynchronously.
//     await inngest.send({
//       name: "app/checkpayment",
//       data: {
//         bookingId: booking._id.toString(),
//       },
//     });

//     // STEP 9: Return a success response WITHOUT Stripe.
//     // Send the created booking details to the frontend.
//     res.json({
//       success: true,
//       message: "Booking created successfully",
//       booking,
//     });

//   } catch (error) {
//     // Handle unexpected errors, such as database or server errors.
//     console.log(error.message);

//     res.json({
//       success: false,
//       message: error.message,
//     });
//   }
// };



// // getOccupiedSeats retrieves the list of seats that are already occupied for a particular movie show.
// //  It validates the show ID, finds the show in MongoDB, extracts the occupied seat names, and returns
// //   them to the frontend.

// Get all occupied seats for a particular movie show.
export const getOccupiedSeats = async (req, res) => {
  try {
    // STEP 1: Get the show ID from the URL parameters.
    // Example URL: /api/booking/seats/68a123456789abcdef123456
    const { showId } = req.params;

    console.log(
      'getOccupiedSeats - Received showId:',
      showId,
      'Type:',
      typeof showId
    );

    // STEP 2: Validate the show ID's MongoDB ObjectId format.
    // If invalid, return an error response and stop execution.
    if (!mongoose.Types.ObjectId.isValid(showId)) {
      console.log('getOccupiedSeats - Invalid ObjectId received:', showId);

      return res.json({
        success: false,
        message: 'Invalid show ID format',
      });
    }

    // STEP 3: Find the show in MongoDB using its ID.
    const showData = await Show.findById(showId);

    // If the show does not exist, return an error response.
    if (!showData) {
      return res.json({
        success: false,
        message: 'Show not found',
      });
    }

    // STEP 4: Extract the names of occupied seats from the occupiedSeats object.
    // Object.keys() returns an array containing the object's keys.
    // The empty object fallback prevents errors if occupiedSeats is missing.
    const occupiedSeats = Object.keys(showData.occupiedSeats || {});

    // STEP 5: Send the occupied seat names to the frontend.
    // Example response: { success: true, occupiedSeats: ["A1", "A2"] }
    res.json({
      success: true,
      occupiedSeats,
    });

  } catch (error) {
    // Handle unexpected errors, such as database or server errors.
    console.log(error.message);

    res.json({
      success: false,
      message: error.message,
    });
  }
};


export const createBooking = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { showId, selectedSeats } = req.body;
    const { origin } = req.headers;

    if (!mongoose.Types.ObjectId.isValid(showId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid show ID format',
      });
    }

    if (
      !Array.isArray(selectedSeats) ||
      selectedSeats.length === 0 ||
      selectedSeats.length > 5
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please select between 1 and 5 seats',
      });
    }

    const isAvailable = await checkSeatsAvailability(
      showId,
      selectedSeats
    );

    if (!isAvailable) {
      return res.status(409).json({
        success: false,
        message: 'Selected seats are not available',
      });
    }

    const showData = await Show.findById(showId).populate('movie');

    if (!showData || !showData.movie) {
      return res.status(404).json({
        success: false,
        message: 'Show or movie not found',
      });
    }

    if (!showData.showPrice || showData.showPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid show price',
      });
    }

    const booking = await Booking.create({
      user: userId,
      show: showId,
      amount: showData.showPrice * selectedSeats.length,
      bookedSeats: selectedSeats,
      isPaid: false,
    });

    const stripeInstance = new stripe(
      process.env.STRIPE_SECRET_KEY
    );

    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-bookings`,
      cancel_url: `${origin}/my-bookings`,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: showData.movie.title,
            },
            unit_amount: Math.round(showData.showPrice * 100),
          },
          quantity: selectedSeats.length,
        },
      ],
      mode: 'payment',
      metadata: {
        bookingId: booking._id.toString(),
        userId: userId.toString(),
      },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    booking.paymentLink = session.url;
    await booking.save();

    selectedSeats.forEach((seat) => {
      showData.occupiedSeats[seat] = userId;
    });

    showData.markModified('occupiedSeats');
    await showData.save();

    await inngest.send({
      name: 'app/checkpayment',
      data: {
        bookingId: booking._id.toString(),
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Booking created successfully',
      booking,
      url: session.url,
    });
  } catch (error) {
    console.error('Create booking error:', error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create booking',
    });
  }
};