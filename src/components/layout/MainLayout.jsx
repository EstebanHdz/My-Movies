import React from 'react'
import Header from '../Header'
import { Navigate, Outlet } from 'react-router-dom'

const MainLayout = () => {
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}

export default MainLayout