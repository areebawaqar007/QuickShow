import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { dummyShowsData, dummyDateTimeData } from "../assets/assets";
// import timeFormat from '../lib/TimeFormat';
import { ClockIcon } from "lucide-react";
import BlurCircle from "../components/BlurCircle";
import Loading from "../components/Loading";
import timeFormat from "../lib/timeFormat";
const SeatLayout = () => {
  const { id, date } = useParams();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);

  const navigate = useNavigate();

  const getShow = async () => {
    const movie = dummyShowsData.find((movie) => movie._id === id);

    if (movie) {
      setShow({
        movie: movie,
        datetime: dummyDateTimeData,
      });
    }
  };

  useEffect(() => {
    getShow();
  }, [id]);

  if (!show) {
    return <Loading />;
  }

  // Get timings for the date selected on the previous page
  const timings = show.datetime[date] || [];

  return (
    <div className="flex flex-col xl:flex-row px-6 md:px-16 lg:px-24 py-12 mt-30 md:pt-10 max-sm:mt-10">
      {/* Available Timings */}
      <div className="relative w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max">
        <BlurCircle top="-100px" left="0px" />

        <p className="text-lg font-semibold px-6 text-white">
          Available Timings
        </p>

        <div className="mt-4 space-y-1 text-white">
          {timings.length > 0 ? (
            timings.map((item) => (
              <div
                key={item.showId}
                onClick={() => setSelectedTime(item)}
                className={`flex items-center gap-2 px-6 py-2 w-full rounded-r-md cursor-pointer transition ${
                  selectedTime?.showId === item.showId
                    ? "bg-primary text-white"
                    : "hover:bg-primary/20"
                }`}
              >
                <ClockIcon className="w-4 h-4" />

                <p className="text-sm">{timeFormat(item.time)}</p>
              </div>
            ))
          ) : (
            <p className="px-6 text-sm text-gray-400">
              No timings available for this date.
            </p>
          )}
        </div>
      </div>

      {/* Seat Selection Placeholder */}
      <div className="relative flex flex-1 flex-col items-center max-md:mt-15 text-white">
        <BlurCircle bottom="-40px" right="0" />

        <h1 className="text-3xl font-semibold mb-7">Select your seat</h1>

        {!selectedTime && (
          <p className="text-gray-400">Please select a show timing first.</p>
        )}
      </div>
    </div>
  );
};

export default SeatLayout;
