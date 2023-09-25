import React from 'react'
import { Routes, Route, BrowserRouter, Navigate, Link } from "react-router-dom"
import { ContextProvider } from '../context/ContextProvider'
import Main from '../components/Main'
import { MoviesList } from '../components/MoviesList'
import MainLayout from '../components/layout/MainLayout'
import Movie from '../components/Movie'
import { ToWatchList } from '../components/ToWatchList'
import { WatchedList } from '../components/WatchedList'
import { MoviesSearchList } from '../components/MoviesSearchList'

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
                </Route>
            </Routes>
    </BrowserRouter>
  )
}

export default Routing