import BlurCircle from "../components/BlurCircle";
import MovieCard from "../components/MovieCard";
import { dummyShowsData } from "../assets/assets";

const Favorite = () => {
  return (
    <div className="relative px-6 md:px-8 lg:px-16 xl:px-20 overflow-hidden py-10 max-md:py-0">
      <div className="relative flex items-center justify-between pt-20 pb-5 pl-10 text-lg max-md:pl-0">
        <BlurCircle top="80px" right="-40px" />
        <p className="text-gray-300 font-medium max-md:text-md text-lg">
          Your Favorite Movies
        </p>
        <BlurCircle top="500px" left="0px" />
      </div>

      <div className="flex flex-wrap justify-center gap-8 mt-8">
        {dummyShowsData
          .filter(Boolean)
          .map((movie) =>
            movie._id ? <MovieCard key={movie._id} movie={movie} /> : null,
          )}
      </div>
    </div>
  );
};

export default Favorite;
