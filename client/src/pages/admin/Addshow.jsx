// IMPORTS: Bring in React hooks, dummy movie data, and UI components.
import React, { useState, useEffect } from 'react';
import { dummyShowsData, dummyDateTimeData } from '../../assets/assets';
import Title from '../../components/admin/Title';
import Loading from '../../components/Loading';
import { CheckIcon, StarIcon } from 'lucide-react';

const AddShow = () => {
  // Get the currency symbol from your environment variables.
  const currency = import.meta.env.VITE_CURRENCY;

  // STATES: Store the movies, selected movie, selected showtimes, input date/time, and ticket price.
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState('');
  const [showprice, setShowPrice] = useState('');

  // LOAD MOVIES: Put the dummy movie data into state.
  const fetchnowplaying = async () => {
    setNowPlayingMovies(dummyShowsData);
  };

  // RUN ONCE: Load the movies when the component first appears.
  useEffect(() => {
    fetchnowplaying();
  }, []);

  // CONDITIONAL RENDERING: Show the page if movies exist; otherwise, show a loading screen.
  return nowPlayingMovies.length > 0 ? (
    <div className="px-4 sm:px-6 lg:px-8">

      {/* PAGE TITLE */}
      <Title text1="Add" text2="Shows" />

      {/* MOVIE SECTION HEADING */}
      <p className="mt-8 text-lg font-medium">Now Playing Movies</p>

      {/* MOVIE GRID: Display up to 22 movies in a responsive grid. */}
      <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">

        {nowPlayingMovies.slice(0, 22).map((movie) => (

          // MOVIE CARD: Each movie gets its own clickable card.
          <div
            key={movie.id}
            className="relative cursor-pointer rounded-lg transition duration-300 hover:-translate-y-1.5"

            // SELECTION LOGIC: Select a movie, or deselect it if clicked again.
            onClick={() =>
              setSelectedMovie((prev) =>
                prev === movie.id ? null : movie.id
              )
            }
          >
            {/* MOVIE POSTER AND DETAILS */}
            <div className="relative">
              <img
                src={movie.poster_path}
                alt={movie.title || movie.originalTitle || 'Movie poster'}
                className="w-full rounded-lg object-cover brightness-90"
              />

              {/* MOVIE RATING AND VOTE COUNT OVERLAY */}
              <div className="absolute bottom-0 left-0 flex w-full items-center justify-between rounded-b-lg bg-black/70 p-2">

                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <StarIcon className="h-4 w-4 fill-primary text-primary" />
                  <p>{movie.vote_average?.toFixed(1) || 'N/A'}</p>
                </div>

                <p className="text-xs text-gray-400">
                  {movie.vote_count || 0} Votes
                </p>

                {/* SELECTION INDICATOR: Show a checkmark on the selected movie. */}
                {selectedMovie === movie.id && (
                  <div className="absolute -top-2 right-2 flex h-5 w-5 items-center justify-center rounded-md bg-primary">
                    <CheckIcon className="h-4 w-4 text-white" strokeWidth={2.5} />
                  </div>
                )}
              </div>
            </div>

            {/* MOVIE TITLE AND RELEASE DATE */}
            <p className="mt-2 truncate text-base font-semibold">
              {movie.originalTitle || movie.title}
            </p>

            <p className="text-sm text-gray-400">
              {movie.release_date || movie.releaseDate || ''}
            </p>
          </div>
        ))}
      </div>

      {/* PRICE INPUT: Let the admin enter the ticket price. */}
      <div className="mt-8 space-y-6">
        <div>
          <label className="text-sm font-medium">Show Price</label>

          <div className="mt-2 flex w-full max-w-md items-center gap-2 rounded-md border border-gray-600 px-3 py-2">
            <p className="text-gray-400">{currency}</p>

            <input
              min="0"
              placeholder="Enter show price"
              className="flex-1 bg-transparent font-medium text-white outline-none"
              type="number"
              value={showprice}
              onChange={(e) => setShowPrice(e.target.value)}
            />
          </div>
        </div>

        {/* DATE AND TIME INPUT: Let the admin choose a screening date and time. */}
        <div>
          <label className="text-sm font-medium">
            Select Date and Time
          </label>

          <div className="mt-2 flex max-w-md flex-col items-stretch gap-3 rounded-lg border border-gray-600 p-2 sm:flex-row sm:items-center">
            <input
              className="w-full rounded-md bg-transparent font-medium text-white outline-none"
              type="datetime-local"
              value={dateTimeInput}
              onChange={(e) => setDateTimeInput(e.target.value)}
            />

            {/* ADD TIME: Split the input into date and time, then save the selection. */}
            <button
              className="cursor-pointer rounded-lg bg-primary/80 px-4 py-2 text-sm text-white hover:bg-primary"
              onClick={() => {
                // Require a movie and a date/time before adding a screening.
                if (!selectedMovie) return;
                if (!dateTimeInput) return;

                // Example: "2026-10-20T18:30" becomes date and time.
                const [date, time] = dateTimeInput.split('T');

                // Add the selected time to the list for that date.
                setDateTimeSelection((prev) => {
                  const times = prev[date] || [];

                  // Prevent adding the same time twice.
                  if (times.includes(time)) return prev;

                  // Keep existing dates and add the new time.
                  return {
                    ...prev,
                    [date]: [...times, time],
                  };
                });
              }}
            >
              Add Time
            </button>
          </div>
        </div>
      </div>

      {/* SELECTED SCREENINGS: Display the dates and times added by the admin. */}
      {Object.keys(dateTimeSelection).length > 0 && (
        <div className="mt-6">
          <h2 className="mb-2 text-xl font-semibold">
            Selected Date-Time
          </h2>

          <ul className="space-y-3">
            {/* Loop through each date and its selected times. */}
            {Object.entries(dateTimeSelection).map(([date, times]) => (
              <li key={date}>
                <p className="font-medium text-white">{date}</p>

                <div className="mt-1 flex flex-wrap gap-2 text-sm">
                  {/* Display each screening time as a removable item. */}
                  {times.map((time) => (
                    <span
                      key={time}
                      className="flex items-center rounded border border-primary bg-primary/10 px-2 py-1 text-white"
                    >
                      {time}

                      {/* REMOVE TIME: Delete this time from the selected screenings. */}
                      <button
                        className="ml-2 cursor-pointer text-red-400 hover:text-red-300"
                        onClick={() =>
                          setDateTimeSelection((prev) => {
                            const filteredTimes = prev[date].filter(
                              (t) => t !== time
                            );

                            // If no times remain for this date, remove the date itself.
                            if (filteredTimes.length === 0) {
                              const { [date]: removed, ...rest } = prev;
                              return rest;
                            }

                            // Otherwise, keep the date and its remaining times.
                            return { ...prev, [date]: filteredTimes };
                          })
                        }
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* FINAL BUTTON: Currently logs the selected information to the console. */}
      <button
        className="mt-5 flex cursor-pointer items-center justify-center rounded-lg bg-primary px-5 py-2 font-medium transition hover:bg-primary-dull max-sm:text-sm max-md:px-3"
        onClick={() => {
          console.log({
            selectedMovie,
            dateTimeSelection,
            showprice,
          });
        }}
      >
        Add Show
      </button>
    </div>
  ) : (
    // LOADING FALLBACK: Display while no movies are available in state.
    <Loading />
  );
};

export default AddShow;