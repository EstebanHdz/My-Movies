import React from 'react'
import { Routes, Route, BrowserRouter, Navigate, Link } from "react-router-dom"
import Main from '../components/Main'
import MainLayout from '../components/layout/MainLayout'
import Movie from '../components/Movie'
import { MoviesSearchList } from '../components/MoviesSearchList'
import Error from '../components/Error'

const Routing = () => {
  return (
    <BrowserRouter>
            <Routes>
                <Route path="/" element={<Main/>}/>
                <Route path="/home" element={<Main/>}/>

                <Route path="/" element={<MainLayout/>}>
                    <Route path="/search" element={<MoviesSearchList pageType={"search"}/>}/>
                    <Route path="/myToWatchList" element={<MoviesSearchList pageType={"toWatch"}/>}/>
                    <Route path="/myWatchedList" element={<MoviesSearchList pageType={"watched"}/>}/>
                    <Route path="/movie/:id" element={<Movie/>}/>
                    <Route path="/*" element={<Error/>}/>
                </Route>
            </Routes>
    </BrowserRouter>
  )
}

export default Routing