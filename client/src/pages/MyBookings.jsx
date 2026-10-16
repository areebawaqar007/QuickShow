import React, { useEffect, useState } from "react";
import { dummyBookingData } from "../assets/assets";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import { StarIcon } from "lucide-react";
import { Link } from "react-router-dom";

// Displays movie booking details using dummy data.
const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getMyBookings = async () => {
    setBookings(dummyBookingData);
    setIsLoading(false);
  };

  useEffect(() => {
    getMyBookings();
  }, []);

  return !isLoading ? (
    <div className="relative mt-20 mb-10 min-h-[70vh] px-4 pt-10 sm:px-6 md:px-14 lg:px-24">
      <BlurCircle top="100px" left="100px" />

      <h1 className="mb-6 text-xl font-medium text-gray-300">
        My Bookings
      </h1>

      <div className="flex flex-wrap gap-6">
        {bookings.map((item, index) => (
          <div
            key={index}
            className="flex w-full flex-col gap-4 rounded-xl border border-primary/20 bg-primary/5 p-3 md:w-[48%]"
          >
            <div className="flex gap-4">
              <img
                src={item.show?.movie?.poster_path}
                alt={item.show?.movie?.originalTitle || "Movie poster"}
                className="h-36 w-24 rounded-lg object-cover"
              />

              <div className="flex flex-col justify-between text-sm text-white">
                <h2 className="text-3xl font-semibold">
                  {item.show?.movie?.originalTitle ||
                    item.show?.movie?.title ||
                    "Movie Title"}
                </h2>

                <p>
                  Runtime: {item.show?.movie?.runtime ?? "N/A"} minutes
                </p>

                <p className="flex items-center gap-1">
                  <StarIcon className="h-4 w-4 fill-primary text-primary" />
                  {item.show?.movie?.averageRating ?? "N/A"}
                </p>

                <p>
                  Show date:{" "}
                  {item.show?.showDateTime
                    ? new Date(item.show.showDateTime).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 px-1 text-sm text-white">
              <div className="flex flex-wrap items-center gap-4">
                <p className="text-2xl font-semibold">
                  {currency} {item.amount ?? 0}
                </p>

                {!item.isPaid && (
                  <Link
                    to={item.paymentLink || "#"}
                    className="mb-2 cursor-pointer rounded-full bg-primary px-4 py-1.5 text-sm font-medium transition hover:bg-primary-dull"
                  >
                    Pay Now
                  </Link>
                )}
              </div>

              <p>
                Total Tickets:{" "}
                <span className="font-semibold">
                  {item.bookedSeats?.length ?? 0}
                </span>
              </p>

              <p>
                Seat Numbers:{" "}
                <span className="font-semibold">
                  {item.bookedSeats?.join(", ") || "No seats"}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {bookings.length === 0 && (
        <p className="mt-20 text-center text-2xl font-semibold text-gray-400">
          No bookings found
        </p>
      )}
    </div>
  ) : (
    <Loading />
  );
};

export default MyBookings;