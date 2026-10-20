import React, { useState, useEffect } from "react";
import Title from "../../components/admin/Title";
import Loading from "../../components/Loading";
import { CheckIcon, StarIcon } from "lucide-react";
import { KConverter } from "../../lib/kConverter";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddShow = () => {
  const { axios, getToken, user, image_base_url } = useAppContext();

  const currency = import.meta.env.VITE_CURRENCY;

  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Shape: { [movieId]: { [date]: [time, time, ...] } }
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [showprice, setShowPrice] = useState("");
  const [addingShow, setAddingShow] = useState(false);

  const fetchnowplaying = async () => {
    try {
      const { data } = await axios.get("/api/show/now-playing", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setNowPlayingMovies(data.movies);
      }
    } catch (error) {
      console.error("Error Fetching Movies: ", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchnowplaying();
    }
  }, [user]);

  const selectedMovieDateTimes =
    selectedMovie !== null ? dateTimeSelection[selectedMovie] || {} : {};

  const selectedMovieData = nowPlayingMovies.find(
    (movie) => movie.id === selectedMovie
  );

  const handleSubmit = async () => {
    if (selectedMovie === null || !showprice || Number(showprice) <= 0) {
      return toast("Missing Required Fields");
    }

    const movieDateTimes = dateTimeSelection[selectedMovie] || {};

    if (Object.keys(movieDateTimes).length === 0) {
      return toast("Please add at least one date and time");
    }

    try {
      setAddingShow(true);

      // [{ date: "2026-10-20", time: ["18:30", "21:00"] }]
      const showsInput = Object.entries(movieDateTimes).map(([date, times]) => ({
        date,
        time: times,
      }));

      const payload = {
        movieId: selectedMovie,
        showsInput,
        showPrice: Number(showprice),
      };

      const { data } = await axios.post("/api/show/add", payload, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        toast.success(data.message);
        setSelectedMovie(null);
        setDateTimeSelection({});
        setShowPrice("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Submission Error: ", error);
      toast.error("An error occurred. Please try again");
    } finally {
      setAddingShow(false);
    }
  };

  const handleAddTime = () => {
    if (selectedMovie === null) {
      return toast("Please select a movie first");
    }

    if (!dateTimeInput) {
      return toast("Please select a date and time");
    }

    const [date, time] = dateTimeInput.split("T");

    if (!date || !time) {
      return toast("Please enter a valid date and time");
    }

    setDateTimeSelection((prev) => {
      const movieDateTimes = prev[selectedMovie] || {};
      const existingTimes = movieDateTimes[date] || [];

      if (existingTimes.includes(time)) {
        return prev;
      }

      return {
        ...prev,
        [selectedMovie]: {
          ...movieDateTimes,
          [date]: [...existingTimes, time].sort(),
        },
      };
    });

    setDateTimeInput("");
  };

  const handleRemoveTime = (date, time) => {
    if (selectedMovie === null) return;

    setDateTimeSelection((prev) => {
      const movieDateTimes = prev[selectedMovie] || {};
      const filteredTimes = (movieDateTimes[date] || []).filter(
        (existingTime) => existingTime !== time
      );

      const updatedMovieDateTimes = { ...movieDateTimes };

      if (filteredTimes.length === 0) {
        delete updatedMovieDateTimes[date];
      } else {
        updatedMovieDateTimes[date] = filteredTimes;
      }

      return {
        ...prev,
        [selectedMovie]: updatedMovieDateTimes,
      };
    });
  };

  const handleMovieSelection = (movieId) => {
    setSelectedMovie((prev) => (prev === movieId ? null : movieId));
    setDateTimeInput("");
  };

  return nowPlayingMovies.length > 0 ? (
    <div className="px-4 sm:px-6 lg:px-8">
      <Title text1="Add" text2="Shows" />

      <p className="mt-8 text-lg font-medium">Now Playing Movies</p>

      <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {nowPlayingMovies.slice(0, 22).map((movie) => (
          <div
            key={movie.id}
            className="relative cursor-pointer rounded-lg transition duration-300 hover:-translate-y-1.5"
            onClick={() => handleMovieSelection(movie.id)}
          >
            <div className="relative">
              <img
                src={image_base_url + movie.poster_path}
                alt={movie.title || movie.originalTitle || "Movie poster"}
                className="w-full rounded-lg object-cover brightness-90"
              />

              <div className="absolute bottom-0 left-0 flex w-full items-center justify-between rounded-b-lg bg-black/70 p-2">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <StarIcon className="h-4 w-4 fill-primary text-primary" />
                  <p>{movie.vote_average?.toFixed(1) || "N/A"}</p>
                </div>

                <p className="text-xs text-gray-400">
                  {KConverter(movie.vote_count || 0)} Votes
                </p>

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

            <p className="mt-2 truncate text-base font-semibold">
              {movie.originalTitle || movie.title}
            </p>

            <p className="text-sm text-gray-400">
              {movie.release_date || movie.releaseDate || ""}
            </p>

            {Object.keys(dateTimeSelection[movie.id] || {}).length > 0 && (
              <p className="mt-1 text-xs text-green-400">
                {Object.values(dateTimeSelection[movie.id] || {}).flat().length}{" "}
                time(s) added
              </p>
            )}
          </div>
        ))}
      </div>

      {selectedMovie !== null && (
        <p className="mt-5 text-sm text-green-400">
          Selected Movie:{" "}
          {selectedMovieData?.originalTitle || selectedMovieData?.title}
        </p>
      )}

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

        <div>
          <label className="text-sm font-medium">Select Date and Time</label>

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

      {selectedMovie !== null &&
        Object.keys(selectedMovieDateTimes).length > 0 && (
          <div className="mt-6">
            <h2 className="mb-2 text-xl font-semibold">Selected Date-Time</h2>

            <ul className="space-y-3">
              {Object.entries(selectedMovieDateTimes)
                .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
                .map(([date, times]) => (
                  <li key={date}>
                    <p className="font-medium text-white">{date}</p>

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
                            onClick={() => handleRemoveTime(date, time)}
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

      <button
        type="button"
        className="mt-5 flex cursor-pointer items-center justify-center rounded-lg bg-primary px-5 py-2 font-medium transition hover:bg-primary-dull disabled:cursor-not-allowed disabled:opacity-60 max-sm:text-sm max-md:px-3"
        onClick={handleSubmit}
        disabled={addingShow}
      >
        {addingShow ? "Adding..." : "Add Show"}
      </button>
    </div>
  ) : (
    <Loading />
  );
};

export default AddShow;