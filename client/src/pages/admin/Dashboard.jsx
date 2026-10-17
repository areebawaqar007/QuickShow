import React, { useEffect, useState } from "react";
import {
  ChartLineIcon,
  CircleDollarSignIcon,
  PlayCircleIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react";
import Loading from "../../components/Loading";
import { dummyDashboardData } from "../../assets/assets";
import Title from "../../components/admin/Title";
import BlurCircle from "../../components/BlurCircle";
import formatDateTime from "../../lib/DateCalculate";
const Dashboard = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const image_base_url = "https://image.tmdb.org/t/p/w500";

  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUser: 0,
  });

  const [loading, setLoading] = useState(true);

  const dashboardCards = [
    {
      title: "Total Bookings",
      value: dashboardData.totalBookings,
      icon: ChartLineIcon,
    },
    {
      title: "Total Revenue",
      value: `${currency} ${dashboardData.totalRevenue}`,
      icon: CircleDollarSignIcon,
    },
    {
      title: "Active Shows",
      value: dashboardData.activeShows.length,
      icon: PlayCircleIcon,
    },
    {
      title: "Total Users",
      value: dashboardData.totalUser,
      icon: UsersIcon,
    },
  ];

  const fetchDashboardData = async () => {
    setDashboardData(dummyDashboardData);
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return !loading ? (
    <div>
      <Title text1="Admin" text2="Dashboard" />

      <div className="relative">
        <BlurCircle top="0" left="0" />
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-2 min-lg:grid-cols-4 gap-6 max-md:gap-3 mt-8 max-md:pl-5 max-sm:pl-0">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className="flex justify-between rounded-lg bg-primary/10 border-2 border-primary/20"
          >
            <div className="flex flex-col py-4 items-start justify-center pr-2 pl-4">
              <p className="text-sm">{card.title}</p>
              <p className="text-2xl font-semibold pt-1 max-md:text-xl">
                {card.value}
              </p>
            </div>

            <div className="flex items-center justify-center pr-3">
              <card.icon className="w-7 h-7" />
            </div>
          </div>
        ))}
      </div>

      {/* Active Shows */}
      <p className="mt-10 text-xl font-semibold">Active Shows</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mt-8 px-2 sm:px-5">
        {dashboardData.activeShows.length > 0 ? (
          dashboardData.activeShows.map((show) => (
            <div
              key={show._id}
              className="flex flex-col rounded-lg bg-primary/10 border-2 border-primary/20 overflow-hidden shadow-md hover:-translate-y-1 transition duration-300"
            >
              <img
                src={
                  show.movie.poster_path?.startsWith("http")
                    ? show.movie.poster_path
                    : image_base_url + show.movie.poster_path
                }
                alt="poster"
                className="w-full h-64 object-cover"
              />

              <p className="pt-3 px-3 text-lg font-semibold text-white">
                {show.movie.title?.length > 25
                  ? show.movie.title.slice(0, 25) + "..."
                  : show.movie.title}
              </p>

              <div className="flex justify-between mt-2 px-3 text-white">
                <p className="text-lg font-medium">
                  {currency} {show.showPrice}
                </p>

                <p className="flex items-center gap-1 text-gray-300 text-sm">
                  <StarIcon className="w-4 h-4 text-primary fill-primary" />
                  {show.movie.vote_average?.toFixed(1) ?? "N/A"}
                </p>
              </div>

              <p className="px-3 py-3 text-sm text-gray-500">
                {formatDateTime(show.showDateTime)?.replace("•", " at")}
              </p>
            </div>
          ))
        ) : (
          <p className="text-white">No active shows found.</p>
        )}
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Dashboard;