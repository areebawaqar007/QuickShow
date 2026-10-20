// IMPORTS
import React, { useState, useEffect } from 'react';
import { dummyShowsData } from '../../assets/assets';
import Title from '../../components/admin/Title';
import Loading from '../../components/Loading';
import { CheckIcon, StarIcon } from 'lucide-react';
import { KConverter } from '../../lib/kConverter';

const AddShow = () => {
  // Currency symbol from environment variables.
  const currency = import.meta.env.VITE_CURRENCY;

  // STATE: Store movies.
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);

  // STATE: Store the selected movie ID.
  const [selectedMovie, setSelectedMovie] = useState(null);

  // STATE: Store date/time selections separately for each movie.
  const [dateTimeSelection, setDateTimeSelection] = useState({});

  // STATE: Store the current date/time input.
  const [dateTimeInput, setDateTimeInput] = useState('');

  // STATE: Store ticket price.
  const [showprice, setShowPrice] = useState('');

  // LOAD MOVIES.
  const fetchnowplaying = async () => {
    setNowPlayingMovies(dummyShowsData);
  };

  useEffect(() => {
    fetchnowplaying();
  }, []);

  // GET DATE/TIME SELECTIONS FOR THE CURRENTLY SELECTED MOVIE.
  const selectedMovieDateTimes =
    selectedMovie !== null
      ? dateTimeSelection[selectedMovie] || {}
      : {};

  // ADD A DATE AND TIME TO THE SELECTED MOVIE.
  const handleAddTime = () => {
    // Ensure a movie has been selected.
    if (selectedMovie === null) {
      alert('Please select a movie first.');
      return;
    }

    // Ensure date and time have been entered.
    if (!dateTimeInput) {
      alert('Please select a date and time.');
      return;
    }

    // Split the datetime-local value.
    // Example: "2026-10-20T18:30"
    const [date, time] = dateTimeInput.split('T');

    if (!date || !time) {
      alert('Please enter a valid date and time.');
      return;
    }

    // Update the selected movie's date/time selections only.
    setDateTimeSelection((prev) => {
      // Get existing dates and times for this movie.
      const movieDateTimes = prev[selectedMovie] || {};

      // Get existing times for the selected date.
      const existingTimes = movieDateTimes[date] || [];

      // Prevent duplicate times for the same movie and date.
      if (existingTimes.includes(time)) {
        return prev;
      }

      // Return updated selections without affecting other movies.
      return {
        ...prev,
        [selectedMovie]: {
          ...movieDateTimes,
          [date]: [...existingTimes, time].sort(),
        },
      };
    });

    // Clear the input after adding the time.
    setDateTimeInput('');
  };

  // REMOVE A DATE/TIME FROM THE SELECTED MOVIE ONLY.
  const handleRemoveTime = (date, time) => {
    if (selectedMovie === null) return;

    setDateTimeSelection((prev) => {
      // Get this movie's existing selections.
      const movieDateTimes = prev[selectedMovie] || {};

      // Remove the selected time.
      const filteredTimes = (movieDateTimes[date] || []).filter(
        (existingTime) => existingTime !== time
      );

      // Copy existing dates for this movie.
      const updatedMovieDateTimes = { ...movieDateTimes };

      // Remove the date if no times remain.
      if (filteredTimes.length === 0) {
        delete updatedMovieDateTimes[date];
      } else {
        updatedMovieDateTimes[date] = filteredTimes;
      }

      // Update only this movie's selections.
      return {
        ...prev,
        [selectedMovie]: updatedMovieDateTimes,
      };
    });
  };

  // SELECT OR DESELECT A MOVIE.
  const handleMovieSelection = (movieId) => {
    setSelectedMovie((prev) => {
      // Clicking the selected movie deselects it.
      if (prev === movieId) {
        return null;
      }

      // Select the new movie.
      return movieId;
    });

    // Clear the pending input when switching movies.
    setDateTimeInput('');
  };

  // SUBMIT THE SHOW INFORMATION.
  const handleAddShow = () => {
    if (selectedMovie === null) {
      alert('Please select a movie.');
      return;
    }

    if (!showprice || Number(showprice) <= 0) {
      alert('Please enter a valid show price.');
      return;
    }

    const movieDateTimes = dateTimeSelection[selectedMovie] || {};

    if (Object.keys(movieDateTimes).length === 0) {
      alert('Please add at least one date and time.');
      return;
    }

    // Find the selected movie.
    const movie = nowPlayingMovies.find(
      (item) => item.id === selectedMovie
    );

    // Prepare the selected movie's show data.
    const showData = {
      movieId: selectedMovie,
      movieTitle: movie?.originalTitle || movie?.title,
      showPrice: Number(showprice),
      dateTimeSelection: movieDateTimes,
    };

    // Display the selected movie's information.
    console.log('Show Data:', showData);

    // Display all movies' date/time selections for verification.
    console.log('All Movie Selections:', dateTimeSelection);

    // NOTE: Send showData to your backend API here
    // when your backend endpoint is ready.
  };

  // RENDER THE PAGE.
  return nowPlayingMovies.length > 0 ? (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* PAGE TITLE */}
      <Title text1="Add" text2="Shows" />

      {/* MOVIE SECTION */}
      <p className="mt-8 text-lg font-medium">
        Now Playing Movies
      </p>

      {/* MOVIE GRID */}
      <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {nowPlayingMovies.slice(0, 22).map((movie) => (
          <div
            key={movie.id}
            className="relative cursor-pointer rounded-lg transition duration-300 hover:-translate-y-1.5"
            onClick={() => handleMovieSelection(movie.id)}
          >
            {/* MOVIE POSTER */}
            <div className="relative">
              <img
                src={movie.poster_path}
                alt={
                  movie.title ||
                  movie.originalTitle ||
                  'Movie poster'
                }
                className="w-full rounded-lg object-cover brightness-90"
              />

              {/* MOVIE RATING */}
              <div className="absolute bottom-0 left-0 flex w-full items-center justify-between rounded-b-lg bg-black/70 p-2">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <StarIcon className="h-4 w-4 fill-primary text-primary" />
                  <p>
                    {movie.vote_average?.toFixed(1) || 'N/A'}
                  </p>
                </div>

                <p className="text-xs text-gray-400">
                  {KConverter(movie.vote_count || 0)} Votes
                </p>

                {/* SELECTED MOVIE CHECKMARK */}
                {selectedMovie === movie.id && (
                  <div className="absolute -top-2 right-2 flex h-5 w-5 items-center justify-center rounded-md bg-primary">
                    <CheckIcon
                      className="h-4 w-4 text-white"
                      strokeWidth={2.5}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* MOVIE DETAILS */}
            <p className="mt-2 truncate text-base font-semibold">
              {movie.originalTitle || movie.title}
            </p>

            <p className="text-sm text-gray-400">
              {movie.release_date || movie.releaseDate || ''}
            </p>

            {/* SHOW SELECTED MOVIE'S SCREENING COUNT */}
            {Object.keys(dateTimeSelection[movie.id] || {}).length >
              0 && (
              <p className="mt-1 text-xs text-green-400">
                {
                  Object.values(dateTimeSelection[movie.id] || {})
                    .flat().length
                }{' '}
                time(s) added
              </p>
            )}
          </div>
        ))}
      </div>

      {/* SELECTED MOVIE INDICATOR */}
      {selectedMovie !== null && (
        <p className="mt-5 text-sm text-green-400">
          Selected Movie:{' '}
          {nowPlayingMovies.find(
            (movie) => movie.id === selectedMovie
          )?.originalTitle ||
            nowPlayingMovies.find(
              (movie) => movie.id === selectedMovie
            )?.title}
        </p>
      )}

      {/* SHOW PRICE */}
      <div className="mt-8 space-y-6">
        <div>
          <label className="text-sm font-medium">
            Show Price
          </label>

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

        {/* DATE AND TIME INPUT */}
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

            <button
              type="button"
              className="cursor-pointer rounded-lg bg-primary/80 px-4 py-2 text-sm text-white hover:bg-primary"
              onClick={handleAddTime}
            >
              Add Time
            </button>
          </div>

          {selectedMovie === null && (
            <p className="mt-2 text-sm text-gray-400">
              Select a movie before adding its date and time.
            </p>
          )}
        </div>
      </div>

      {/* SELECTED DATE/TIMES FOR THE CURRENT MOVIE */}
      {selectedMovie !== null &&
        Object.keys(selectedMovieDateTimes).length > 0 && (
          <div className="mt-6">
            <h2 className="mb-2 text-xl font-semibold">
              Selected Date-Time
            </h2>

            <ul className="space-y-3">
              {Object.entries(selectedMovieDateTimes)
                .sort(([dateA], [dateB]) =>
                  dateA.localeCompare(dateB)
                )
                .map(([date, times]) => (
                  <li key={date}>
                    <p className="font-medium text-white">
                      {date}
                    </p>

                    <div className="mt-1 flex flex-wrap gap-2 text-sm">
                      {times.map((time) => (
                        <span
                          key={`${date}-${time}`}
                          className="flex items-center rounded border border-primary bg-primary/10 px-2 py-1 text-white"
                        >
                          {time}

                          <button
                            type="button"
                            aria-label={`Remove ${time} on ${date}`}
                            className="ml-2 cursor-pointer text-red-400 hover:text-red-300"
                            onClick={() =>
                              handleRemoveTime(date, time)
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

      {/* ADD SHOW BUTTON */}
      <button
        type="button"
        className="mt-5 flex cursor-pointer items-center justify-center rounded-lg bg-primary px-5 py-2 font-medium transition hover:bg-primary-dull max-sm:text-sm max-md:px-3"
        onClick={handleAddShow}
      >
        Add Show
      </button>
    </div>
  ) : (
    <Loading />
  );
};

export default AddShow;