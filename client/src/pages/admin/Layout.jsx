import React,{useEffect} from 'react'
import AdminNavbar from "../../components/admin/AdminNavbar";
import Adminsidebar from "../../components/admin/Adminsidebar";
import { Outlet } from 'react-router-dom'
import Loading from '../../components/Loading';

const Layout = () => {
  

  return  (
    <>
    <AdminNavbar/>
    <div className='flex'>
        <Adminsidebar/>
        <div className='flex flex-1 justify-center px-4 py-10 md:px-10 h-[calc(100vh-72px)] overflow-y-auto'>
            <Outlet/>
        </div>
    </div>
    </> 
  ) 
}

export default Layout