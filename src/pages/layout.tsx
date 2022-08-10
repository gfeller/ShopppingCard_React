import Paper from '@mui/material/Paper';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Appbar } from '../components/app-bar';

import './layout.css'

export const Layout = () =>  {
    return <div className='layout'>
        <Appbar/>
        <Outlet />
    </div>
}