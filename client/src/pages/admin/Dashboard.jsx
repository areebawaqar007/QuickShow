import React, { useEffect, useState } from "react";
import {
  ChartLineIcon,
  CircleDollarSignIcon,
  PlayCircleIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";

import Loading from "../../components/Loading";
import { useAppContext } from "../../context/AppContext";
import Title from "../../components/admin/Title";
import BlurCircle from "../../components/BlurCircle";
import formatDateTime from "../../lib/DateCalculate";

const Dashboard = () => {
  const { axios, getToken, user, image_base_url } = useAppContext();

  const currency = import.meta.env.VITE_CURRENCY;

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

  const fetchDashBoardData = async () => {
    try {
      const { data } = await axios.get("/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      if (data.success) {
        setDashboardData(data.dashBoardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error fetching dashboard data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashBoardData();
    }
  }, [user]);

  return !loading ? (
    <div>
      <Title text1="Admin" text2="Dashboard" />

      <div className="relative">
        <BlurCircle top="0" left="0" />
      </div>

      {/* Dashboard Cards */}
      <div className="mt-8 grid grid-cols-2 gap-6 max-md:gap-3 max-md:pl-5 max-sm:pl-0 min-lg:grid-cols-4">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className="flex justify-between rounded-lg border-2 border-primary/20 bg-primary/10"
          >
            <div className="flex flex-col items-start justify-center py-4 pr-2 pl-4">
              <p className="text-sm">{card.title}</p>
              <p className="pt-1 text-2xl font-semibold max-md:text-xl">
                {card.value}
              </p>
            </div>

            <div className="flex items-center justify-center pr-3">
              <card.icon className="h-7 w-7" />
            </div>
          </div>
        ))}
      </div>

      {/* Active Shows */}
      <p className="mt-10 text-xl font-semibold">Active Shows</p>

      <div className="mt-8 grid grid-cols-1 gap-6 px-2 sm:grid-cols-2 sm:px-5 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {dashboardData.activeShows.length > 0 ? (
          dashboardData.activeShows.map((show) => (
            <div
              key={show._id}
              className="flex flex-col overflow-hidden rounded-lg border-2 border-primary/20 bg-primary/10 shadow-md transition duration-300 hover:-translate-y-1"
            >
              <img
                src={
                  show.movie?.poster_path?.startsWith("http")
                    ? show.movie.poster_path
                    : `${image_base_url}${show.movie?.poster_path || ""}`
                }
                alt={show.movie?.title || "Movie poster"}
                className="h-64 w-full object-cover"
                onError={(e) => {
                  console.error("Failed to load movie poster:", e.currentTarget.src);
                }}
              />

              <p className="px-3 pt-3 text-lg font-semibold text-white">
                {show.movie?.title?.length > 25
                  ? show.movie.title.slice(0, 25) + "..."
                  : show.movie?.title}
              </p>

              <div className="mt-2 flex justify-between px-3 text-white">
                <p className="text-lg font-medium">
                  {currency} {show.showPrice}
                </p>

                <p className="flex items-center gap-1 text-sm text-gray-300">
                  <StarIcon className="h-4 w-4 fill-primary text-primary" />
                  {show.movie?.vote_average?.toFixed(1) ?? "N/A"}
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