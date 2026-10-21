import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import Loading from '../components/Loading';
import { ArrowRight, ClockIcon } from 'lucide-react';
import isoTimeFormat from '../lib/isoTimeFormat';
import BlurCircle from '../components/BlurCircle';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
const SeatLayout = () => {
  const { id, date } = useParams();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const navigate = useNavigate();
  const groupRows = [
    ['A', 'B'],
    ['C', 'D'],
    ['E', 'F'],
    ['G', 'H'],
    ['I', 'J'],
  ];

  const { axios, getToken, user } = useAppContext();

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`);

      if (data.success) {
        console.log('URL date:', date);
        console.log(
          'Available date keys:',
          Object.keys(data.dateTime || {})
        );
        console.log('Show dateTime:', data.dateTime);

        setShow(data);
      } else {
        toast.error(data.message || 'Failed to load show details');
      }
    } catch (error) {
      console.error('Error fetching show:', error);
      toast.error('Failed to load show details');
    }
  };

  // Safely get timings for the selected date.
  // Returns an empty array if the date or timings are unavailable.
  const availableTimes = show?.dateTime?.[date] ?? [];

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast('Please select a time first');
    }

    if (
      !selectedSeats.includes(seatId) &&
      selectedSeats.length >= 5
    ) {
      return toast('You can only select up to 5 seats');
    }

    if (occupiedSeats.includes(seatId)) {
      return toast('This seat is already booked');
    }

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  const renderSeats = (row, count = 9) => (
    <div key={row} className="flex gap-2 mt-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          const isSelected = selectedSeats.includes(seatId);
          const isOccupied = occupiedSeats.includes(seatId);

          return (
            <button
              key={seatId}
              type="button"
              disabled={isOccupied}
              onClick={() => handleSeatClick(seatId)}
              className={`h-8 w-8 rounded border border-primary/60
                ${isSelected ? 'bg-primary text-white' : ''}
                ${isOccupied
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'
                }`}
            >
              {seatId}
            </button>
          );
        })}
      </div>
    </div>
  );

  const getOccupiedSeats = async () => {
    try {
      if (!selectedTime?.showId) {
        setOccupiedSeats([]);
        return;
      }

      console.log(
        'Getting occupied seats for showId:',
        selectedTime.showId
      );

      const { data } = await axios.get(
        `/api/booking/seats/${selectedTime.showId}`
      );

      if (data.success) {
        setOccupiedSeats(data.occupiedSeats || []);
      } else {
        toast.error(data.message || 'Failed to fetch occupied seats');
      }
    } catch (error) {
      console.error('Error fetching occupied seats:', error);
      toast.error('Failed to fetch occupied seats');
    }
  };

  // const bookTickets = async () => {
  //   try {
  //     if (!user) {
  //       return toast.error('Please Login to Proceed');
  //     }

  //     if (!selectedTime || selectedSeats.length === 0) {
  //       return toast.error('Please select a time and seats');
  //     }

  //     const token = await getToken();

  //     const { data } = await axios.post(
  //       '/api/booking/create',
  //       {
  //         showId: selectedTime.showId,
  //         selectedSeats,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (data.success) {
  //       window.location.href = data.url;
  //     } else {
  //       toast.error(data.message || 'Booking failed');
  //     }
  //   } catch (error) {
  //     console.error('Error booking tickets:', error);
  //     toast.error(error.response?.data?.message || error.message);
  //   }
  // };


  const bookTickets = async () => {
  try {
    if (!user) {
      toast.error('Please Login to Proceed');
      return;
    }

    if (!selectedTime || selectedSeats.length === 0) {
      toast.error('Please select a time and seats');
      return;
    }

    const token = await getToken();

    const { data } = await axios.post(
      '/api/booking/create',
      {
        showId: selectedTime.showId,
        selectedSeats,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (data.success) {
      navigate('/my-bookings');
    } else {
      toast.error(data.message || 'Booking failed');
    }
  } catch (error) {
    console.error('Booking error:', error);
    toast.error(error.response?.data?.message || error.message);
  }
};
  useEffect(() => {
    getShow();
  }, [id]);

  useEffect(() => {
    setSelectedTime(null);
    setSelectedSeats([]);
    setOccupiedSeats([]);
  }, [date]);

  useEffect(() => {
    if (selectedTime) {
      getOccupiedSeats();
    }
  }, [selectedTime]);

  return show ? (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50">
      {/* Timings */}

      <div className="w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30">
        <p className="text-lg font-semibold px-6">
          Available Timings
        </p>

        <div className="mt-5 space-y-1">
          {availableTimes.length > 0 ? (
            availableTimes.map((item) => (
              <div
                key={item.showId || item.time}
                onClick={() => {
                  setSelectedTime(item);
                  setSelectedSeats([]);
                }}
                className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition ${
                  selectedTime?.showId === item.showId
                    ? 'bg-primary text-white'
                    : 'hover:bg-primary/20'
                }`}
              >
                <ClockIcon className="size-4" />
                <p className="text-sm">
                  {isoTimeFormat(item.time)}
                </p>
              </div>
            ))
          ) : (
            <p className="px-6 py-3 text-sm text-gray-400">
              No timings available for this date.
            </p>
          )}
        </div>
      </div>

      {/* Seat Layout */}

      <div className="relative flex flex-1 flex-col items-center max-md:mt-16">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="0px" right="0px" />

        <h1 className="text-2xl font-semibold mb-4">
          Select Your Seats
        </h1>

        <img src={assets.screenImage} alt="screen" />

        <p className="text-gray-400 text-sm mb-6">
          SCREEN SIDE
        </p>

        <div className="flex flex-col items-center mt-10 text-xs text-gray-300">
          <div className="grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6">
            {groupRows[0].map((row) => renderSeats(row))}
          </div>

          <div className="grid grid-cols-2 gap-11">
            {groupRows.slice(1).map((group, idx) => (
              <div key={idx}>
                {group.map((row) => renderSeats(row))}
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={bookTickets}
          className="flex items-center gap-1 mt-20 px-20 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95"
        >
          Proceed To CheckOut
          <ArrowRight strokeWidth={3} className="w-4 h-4" />
        </button>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default SeatLayout;