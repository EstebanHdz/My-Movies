import StateContext from '../context/ContextProvider'
import React, { useState, useEffect, createContext } from 'react'
import { SaveElement, 
    RemoveElementById,
    RetrieveElements, 
    UpdateElement, 
    GetToWatchElementsPaginated, 
    GetWatchedElementsPaginated,
    RetrieveElementByID, 
    FetchSingleMovie } from '../helpers/LocalStorageHelper'
import { useLocation } from 'react-router-dom'
import { Globals } from '../helpers/Globals'


const useMovie = () => {

    const  [myList, setMyList] = useState([])
    const  [resultList, setResultList] = useState([])

    
    const location = useLocation()


    const updateResultList = (resList = null) => {
        if(!resList){
            resList = resultList
        }
        let updatedResults = resList.map(element => {
            let m = getElementByIdFromMyList(element.imdbID)
            let newElement = {...element}
            if(m){
                newElement.watched = m.watched
                newElement.toWatch = m.toWatch
                newElement.review = m.review
                return newElement
            }
            newElement.watched = false
            newElement.toWatch = false
            newElement.review = null
                
            return newElement
        });
        setResultList(updatedResults)
        return updatedResults
    }


    const addToMyList = (movie, list, review = null) => {

        let newMovieElement = {
            imdbID: movie.imdbID,
            Title: movie.Title,
            Poster: movie.Poster,
            Type: movie.Type,
            Year: movie.Year,
        }

        switch(list){
            case "toWatch":
                newMovieElement.addedToToWatch =  Date.now()
                newMovieElement.toWatch =  true
                break;
            case "watched":
                newMovieElement.addedToWatched =  Date.now()
                newMovieElement.watched =  true
                break;
            case "review":
                newMovieElement.review = review
                break;
            default:
                newMovieElement.addedToToWatch = null
                newMovieElement.toWatch = false
                newMovieElement.addedToWatched = null
                newMovieElement.watched = false
        }

        setMyList(SaveElement(newMovieElement, Globals.myListName))
        updateResultList()
        //setMyList([...myList, newMovieElement])
    }

    const removeFromToWatch = (movie) => {
        let newMovieElement = {imdbID: movie.imdbID}

        newMovieElement.addedToToWatch =  null
        newMovieElement.toWatch =  false

        setMyList(SaveElement(newMovieElement, Globals.myListName))
    }

    const removeFromWatched = (movie) => {
        let newMovieElement = {imdbID: movie.imdbID}

        newMovieElement.addToWatchedList =  null
        newMovieElement.watched =  false
        let res = SaveElement(newMovieElement, Globals.myListName)
        setMyList(res)
    }

    const removeFromReviewed = (movie) => {
        let newMovieElement = {imdbID: movie.imdbID}

        newMovieElement.review =  null
        let res = SaveElement(newMovieElement, Globals.myListName)
        setMyList(res)
    }

    const getElementByIdFromMyList = (id) => {
        return RetrieveElementByID(Globals.myListName, id)
    }

    const getWatchedFromMyList = (page, type = null, sort = null) => {
        return GetWatchedElementsPaginated(Globals.myListName, page, type, sort)
    }
    const getToWatchFromMyList = (page, type = null, sort = null) => {
        return GetToWatchElementsPaginated(Globals.myListName, page, type, sort)
    }

    const getSingleMovie = async (url, options) => {
        return await FetchSingleMovie(url, options)
    }

    return { 
        addToMyList, 
        removeFromToWatch,
        removeFromWatched, 
        removeFromReviewed, 
        getWatchedFromMyList, 
        getToWatchFromMyList,
        getElementByIdFromMyList,
        updateResultList,
        getSingleMovie
    }
}

export default useMovie