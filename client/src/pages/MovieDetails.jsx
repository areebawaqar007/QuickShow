import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PlayCircleIcon, Star, Heart } from 'lucide-react';
import BlurCircle from '../components/BlurCircle';
import { dummyShowsData, dummyDateTimeData } from '../assets/assets';
import DateSelect from '../components/DateSelect';

const MovieDetails = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
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
    return <div className="text-white text-center mt-32">Loading...</div>;
  }

  const { movie, datetime } = show;

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-20 py-12 mt-28 max-md:mt-15 overflow-hidden">
      {/* Movie Details */}
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        <img
          src={movie.poster_path}
          alt={movie.title}
          className="rounded-xl w-[250px] h-[370px] md:w-[320px] md:h-[450px] object-cover shadow-lg"
        />

        <div className="text-white relative flex flex-col gap-4 max-w-xl">
          <BlurCircle top="0px" left="50px" />

          <p className="text-xl uppercase text-primary font-medium">
            {movie.original_language === 'en'
              ? 'English'
              : movie.original_language}
          </p>

          <h1 className="text-4xl font-bold leading-snug">
            {movie.title}
          </h1>

          <div className="flex items-center gap-2">
            <Star className="fill-primary text-primary w-5 h-5" />
            <p className="text-md text-gray-200">
              {movie.vote_average ?? 'N/A'} User Rating
            </p>
          </div>

          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            {movie.overview}
          </p>

          <p className="text-sm text-gray-100 font-medium">
            {movie.genres?.map((genre) => genre.name ?? genre).join(', ')} •{' '}
            {movie.release_date
              ? new Date(movie.release_date).getFullYear()
              : ''}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-4 max-md:gap-2">
            <a
              href={movie.trailer}
              target="_blank"
              rel="noreferrer"
              className="flex items-center px-5 py-2 bg-gray-700 hover:bg-gray-800 transition rounded-lg text-sm font-medium max-md:px-3"
            >
              <PlayCircleIcon className="w-5 h-5 mr-2" />
              Watch Trailer
            </a>

            <button
              onClick={() => navigate(`/movies/${id}/shows`)}
              className="px-6 py-3 bg-primary hover:bg-primary-dull transition rounded-lg text-sm font-medium max-md:px-4"
            >
              Buy Tickets
            </button>

            {/* Favorite Button */}
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className="p-3 bg-gray-700 hover:bg-gray-600 transition rounded-full"
            >
              <Heart
                className={`w-5 h-5 transition ${
                  isFavorite ? 'text-primary fill-primary' : 'text-white'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Movie Cast */}
      <p className="text-gray-300 font-medium text-lg mt-24 mb-4 max-md:text-base max-md:mt-15">
        Movie Cast
      </p>

      <div id="cast" className="overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-5 w-max px-1 pb-2">
          {movie.casts?.slice(0, 12).map((cast, index) => (
            <div
              key={cast.id || index}
              className="flex flex-col items-center text-center min-w-[80px]"
            >
              <img
                src={cast.primaryImage || cast.profile_path || '/no-cast.jpg'}
                alt={cast.fullName || cast.name || 'Cast member'}
                className="rounded-full h-20 w-20 md:h-24 md:w-24 object-cover"
              />

              <p className="text-xs md:text-sm text-white mt-2 font-medium truncate w-20">
                {cast.fullName || cast.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      <DateSelect datetime={datetime} id={id} />
    </div>
  );
};

export default MovieDetails;


// Get movie ID → Find movie → Store movie and dates in state → Extract data → Display movie details → Pass dates to DateSelect.