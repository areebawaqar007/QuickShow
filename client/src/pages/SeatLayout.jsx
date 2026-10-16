import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets, dummyShowsData, dummyDateTimeData } from "../assets/assets";
import { ClockIcon, ArrowRight } from "lucide-react";
import BlurCircle from "../components/BlurCircle";
import timeFormat from "../lib/timeFormat";
import toast from "react-hot-toast";

const SeatLayout = () => {
  const { id, date } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);

  const occupiedSeats = [];

  const groupRows = [
    ["A", "B"],
    ["C", "D"],
    ["E", "F", "G"],
    ["H", "I", "J"],
    ["K", "L"],
  ];

  // Find the movie and load its showtime data
  useEffect(() => {
    const movie = dummyShowsData.find((movie) => movie._id === id);

    if (movie) {
      setShow({
        movie,
        datetime: dummyDateTimeData,
      });
    } else {
      setShow(null);
    }
  }, [id]);

  // Handle seat selection
  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast("Please select time first");
    }

    if (occupiedSeats.includes(seatId)) {
      return toast.error("Seat is already booked");
    }

    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5) {
      return toast("You can only select 5 seats");
    }

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  // Generate seats for each row
  const renderSeats = (row, count = 9) => {
    return (
      <div key={row} className="mb-3 flex w-full justify-center">
        <div className="grid grid-cols-9 gap-1 sm:gap-2 md:gap-3">
          {Array.from({ length: count }, (_, i) => {
            const seatId = `${row}${i + 1}`;
            const isSelected = selectedSeats.includes(seatId);
            const isOccupied = occupiedSeats.includes(seatId);

            return (
              <button
                key={seatId}
                onClick={() => handleSeatClick(seatId)}
                disabled={isOccupied}
                title={seatId}
                className={`aspect-square w-8 rounded border border-primary/60 text-xs transition md:w-8 lg:w-10 ${
                  isSelected ? "bg-primary text-white" : ""
                } ${
                  isOccupied
                    ? "cursor-not-allowed opacity-30"
                    : "cursor-pointer"
                }`}
              >
                {seatId}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Show loading state while movie data is being checked
  if (!show) {
    return (
      <div className="mt-32 text-center text-white">
        Loading...
      </div>
    );
  }

  // Get showtimes for the selected date
  const timings = show.datetime[date] || [];

  // Proceed to checkout
  const handleCheckout = () => {
    if (!selectedTime || selectedSeats.length === 0) {
      return toast.error("Please select time and seats first");
    }

    navigate("/my-bookings");
  };

  return (
    <div className="mt-30 flex flex-col px-6 py-12 md:px-16 md:pt-10 lg:px-24 max-sm:mt-10 xl:flex-row">
      {/* Available Timings */}
      <div className="relative h-max w-60 rounded-lg border border-primary/20 bg-primary/10 py-10">
        <BlurCircle top="-100px" left="0px" />

        <p className="px-6 text-lg font-semibold text-white">
          Available Timings
        </p>

        <div className="mt-4 space-y-1 text-white">
          {timings.length > 0 ? (
            timings.map((item) => (
              <button
                key={item.showId}
                onClick={() => {
                  setSelectedTime(item);
                  setSelectedSeats([]);
                }}
                className={`flex w-full cursor-pointer items-center gap-2 rounded-r-md px-6 py-2 transition ${
                  selectedTime?.showId === item.showId
                    ? "bg-primary text-white"
                    : "hover:bg-primary/20"
                }`}
              >
                <ClockIcon className="h-4 w-4" />

                <span className="text-sm">
                  {timeFormat(item.time)}
                </span>
              </button>
            ))
          ) : (
            <p className="px-6 text-sm text-gray-400">
              No timings available for this date.
            </p>
          )}
        </div>
      </div>

      {/* Seat Selection */}
      <div className="relative mt-10 flex flex-1 flex-col items-center xl:mt-0">
        <BlurCircle bottom="-40px" right="0" />

        <h1 className="mb-7 text-3xl font-semibold text-white">
          Select Your Seats
        </h1>

        <img src={assets.screenImage} alt="Cinema screen" />

        <p className="text-sm font-medium text-white">
          SCREEN SIDE
        </p>

        <div className="mt-10 flex w-full flex-col items-center text-xs font-medium text-white">
          {/* First two rows */}
          <div className="w-full">
            {groupRows[0].map((row) => renderSeats(row))}
          </div>

          {/* Remaining rows */}
          <div className="mt-6 grid w-full grid-cols-1 gap-8 sm:grid-cols-2">
            {groupRows.slice(1).map((group, index) => (
              <div
                key={index}
                className="flex w-full flex-col items-center"
              >
                {group.map((row) => renderSeats(row))}
              </div>
            ))}
          </div>
        </div>

        {/* Checkout Button */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={handleCheckout}
            className="my-5 flex cursor-pointer items-center gap-2 rounded-full bg-primary px-8 py-3 font-medium transition hover:bg-primary-dull max-md:px-5 max-md:text-sm"
          >
            Proceed to Checkout

            <ArrowRight className="h-5 w-5 transition duration-300 hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatLayout;