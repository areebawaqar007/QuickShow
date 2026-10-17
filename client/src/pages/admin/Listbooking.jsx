// import React, { useEffect, useState } from "react";
// import Loading from "../../components/Loading";
// import Title from "../../components/admin/Title";
// import { dummyBookingsData } from "../../assets/assets";

// const Listbooking = () => {
//   const currency = import.meta.env.VITE_CURRENCY;

//   const [bookings, setBookings] = useState([]);
//   const [loading, setIsLoading] = useState(true);

//   const getAllBookings = async () => {
//     try {
//       setBookings(dummyBookingsData);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     getAllBookings();
//   }, []);

//   return !loading ? (
//     <>
//       <Title text1="List" text2="Bookings" />

//       <div className="max-w-4xl mt-6 overflow-x-auto">
//         <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
//           <thead>
//             <tr className="bg-primary/20 text-left text-white">
//               <th className="p-2 font-medium pl-5">User Name</th>
              
//               <th className="p-2 font-medium pl-5">Movie Name</th>
//               <th className="p-2 font-medium">Show Time</th>
//               <th className="p-2 font-medium">Seats</th>
//               <th className="p-2 font-medium">Amount</th>
//             </tr>
//           </thead>

         
//         </table>
//       </div>
//     </>
//   ) : (
//     <Loading />
//   );
// };

// export default Listbooking;


import React from 'react'

const Listbooking = () => {
  return (
    <div>
      
    </div>
  )
}

export default Listbooking
