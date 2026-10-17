import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { dummyBookingData } from "../../assets/assets";
import formatDateTime from "../../lib/DateCalculate";
const Listbooking = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const [bookings, setBookings] = useState([]);
  const [loading, setIsLoading] = useState(true);

  const getAllBookings = async () => {
    try {
      setBookings(dummyBookingData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllBookings();
  }, []);

  return !loading ? (
    <div className="relative w-full min-h-screen p-4 text-white">
      <Title text1="List" text2="Bookings" />

      <div className="max-w-5xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-3 font-medium">User Name</th>
              <th className="p-3 font-medium">Movie Name</th>
              <th className="p-3 font-medium">Show Time</th>
              <th className="p-3 font-medium">Seats</th>
              <th className="p-3 font-medium">Amount</th>
            </tr>
          </thead>

<tbody className="text-sm font-light">
  {bookings.map((show, index) => {
    const seats = show?.bookedseats || [];
    const showData = show?.show || {};
    const movie = showData?.movie || {};
    const showTime = showData?.showDateTime || "";
    const seatCount = seats.length;
    const price = showData?.showprice || 0;
    const userName = show?.user?.name || "N/A";

    return (
      <tr
        key={index}
        className="border-b border-primary/10 bg-primary/5 even:bg-primary/10 whitespace-nowrap"
      >
        <td className="p-3">{userName}</td>
        <td className="p-3">{movie?.originalTitle || movie?.title || "N/A"}</td>
        <td className="p-3">
          {showTime ? formatDateTime(showTime)?.replace("•", " at") : "N/A"}
        </td>
        <td className="p-3">{seats.join(", ") || "N/A"}</td>
        <td className="p-3">
          {currency} {seatCount * price}
        </td>
      </tr>
    );
  })}
</tbody>
        </table>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Listbooking;