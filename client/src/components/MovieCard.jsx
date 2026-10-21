import { StarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import timeFormat from "../lib/timeFormat";
import { useAppContext } from "../context/AppContext";
const MovieCard = ({ movie }) => {
    const navigate = useNavigate();
    const { image_base_url} = useAppContext();

    return (
        <div className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-66">
            <img
                className="rounded-lg h-52 w-full object-cover object-right-bottom cursor-pointer"
                src={`${image_base_url}${movie.backdrop_path}`}
                alt={movie.title}
                onClick={() => {
                    navigate(`/movies/${movie._id}`);
                    window.scrollTo(0, 0);
                }}
            />

            <p className="font-semibold mt-2 truncate">
                {movie.title}
            </p>

            <p className="text-sm text-gray-400 mt-2">
                {new Date(movie.release_date).getFullYear()} &middot;{" "}
                {movie.genres.slice(0, 2).map((genre) => genre.name).join(" | ")}{" "}
                &middot; {timeFormat(movie.runtime)}
            </p>

            <div className="flex items-center justify-between mt-4 pb-3">
                <button
                    className="px-4 py-2 text-xs bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
                    onClick={() => {
                        navigate(`/movies/${movie._id}`);
                        window.scrollTo(0, 0);
                    }}
                >
                    Buy Tickets
                </button>

                <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
                    <StarIcon className="size-4 text-primary fill-primary" />
                    {movie.vote_average.toFixed(1)}
                </p>
            </div>
        </div>
    );
};

export default MovieCard;



// .filter(Boolean) — Removes falsy values such as null, undefined, and false from the array.
// .map((movie) => ...) — Loops through each remaining movie and renders a MovieCard.
// movie._id ? ... : null — Displays the card only if the movie has an _id; otherwise, it renders nothing.
// key={movie._id} — Gives each card a unique key so React can track list items.
// movie={movie} — Passes the movie object to the MovieCard component through props