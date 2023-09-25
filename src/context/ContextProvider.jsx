import React, { useState, useEffect, createContext } from 'react'
import { SaveElement, 
    RemoveElementById,
    RetrieveElements, 
    UpdateElement, 
    GetToWatchElementsPaginated, 
    GetWatchedElementsPaginated,
    RetrieveElementByID } from '../helpers/LocalStorageHelper'
import { useLocation } from 'react-router-dom'
import { Globals } from '../helpers/Globals'


const StateContext = createContext()   

export const ContextProvider = ({children}) => {

    const  [watchedList, setWatchedList] = useState([])
    const  [toWatchList, setToWatchList] = useState([])
    const  [ratingsList, setRatingsList] = useState([])
    const  [myList, setMyList] = useState([])
    const  [resultList, setResultList] = useState([])

    
    const location = useLocation()


    const addToMyList = (movie, list, review = null) => {

        console.log("add to list");
        console.log(movie);

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

    const updateResultList = (resList = null) => {
        if(!resList){
            resList = resultList
        }
        let updatedResults = resList.map(element => {
            let m = getElementByIdFromMyList(element.imdbID)
            if(m){
                let newElement = {...element}
                newElement.watched = m.watched
                newElement.toWatch = m.toWatch
                return newElement
            }
            let newElement = {...element}
            newElement.watched = false
            newElement.toWatch = false
                
            return newElement
        });
        console.log("updatedResults");
        console.log(updatedResults);
        setResultList(updatedResults)
        return updatedResults
    }












    const addToMyToWatchList = (movie) => {
        let newMovieElement = {
            imdbID: movie.imdbID,
            Title: movie.Title,
            Poster: movie.Poster,
            Year: movie.Year,
            added: Date.now(),
        }
        SaveElement(newMovieElement, Globals.toWatchList)
        setToWatchList([...toWatchList, newMovieElement])
    }

    const removeFromMyToWatchList = (id) => {
        let newList = toWatchList.filter(element => {
            return element.imdbID != id
        })
        setToWatchList(newList)
        RemoveElementById(id, Globals.toWatchList)
    }


    


    const addToMyWatchedList = (movie) => {
        let newMovieElement = {
            imdbID: movie.imdbID,
            Title: movie.Title,
            Poster: movie.Poster,
            Year: movie.Year,
            added: Date.now()
        }
        SaveElement(newMovieElement, Globals.watchedList)
        setWatchedList([...watchedList, newMovieElement])
    }

    const removeFromMyWatchedList = (id) => {
        let newList = watchedList.filter(element => {
            return element.imdbID != id
        })
        setWatchedList(newList)
        RemoveElementById(id, Globals.watchedList)
    }

    const addToMyRatingsList = (rating, movie) => {
        let newReviewElement = {
            imdbID: movie.imdbID,
            Title: movie.Title,
            Poster: movie.Poster,
            rating: rating.rating,
            review: rating.review
        }
        UpdateElement(newReviewElement, Globals.ratingsList)
        setRatingsList([...ratingsList, newReviewElement])
    }

    //REFACTOR / remove
    useEffect(() => {
        console.log("here");
        setMyList(RetrieveElements(Globals.myListName))
        //setResultList([])
        //setWatchedList(RetrieveElementsInLocalStorage(Globals.toWatchList))
    }, [location])

    useEffect(() => {
        updateResultList()
    }, [myList])

    return <StateContext.Provider
                value = {{
                    watchedList, 
                    setWatchedList,
                    toWatchList,
                    setToWatchList,
                    addToMyToWatchList,
                    removeFromMyToWatchList,
                    addToMyWatchedList,
                    removeFromMyWatchedList,
                    ratingsList, 
                    setRatingsList,
                    addToMyRatingsList,
                    myList,
                    addToMyList,
                    removeFromToWatch,
                    removeFromWatched,
                    removeFromReviewed, 
                    getWatchedFromMyList,
                    getToWatchFromMyList,
                    getElementByIdFromMyList,
                    setResultList,
                    resultList,
                    updateResultList
                }}
            >
        {children}
    </StateContext.Provider>
}

export default StateContext