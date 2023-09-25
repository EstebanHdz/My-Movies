import React from 'react'
import useMovie from '../hooks/useMovie'
import { useState } from 'react'

const useListManager = () => {

    const { addToMyToWatchList, removeFromMyToWatchList,  toWatchList,
        addToMyWatchedList,  removeFromMyWatchedList, watchedList,
        addToMyRatingsList, ratingsList,
        addToMyList } = useMovie()

    const [isInToWatchList, setIsInToWatchList] = useState(false)
    const [isInWatchedList, setIsInWatchedList] = useState(false)
    const [isInRatingsList, setIsInRatingsList] = useState(false)


    const addToList = (element, list) => {
        addToMyList(element, list)
    }

    const addToWatchList = (element) => {
        addToMyToWatchList(element)
        setIsInToWatchList(true)
    }
    const removeToWatchList = (element) => {
        removeFromMyToWatchList(element.imdbID)
        setIsInToWatchList(false)
    }


    const addWatchedList = (element) => {
        addToMyWatchedList(element)
        setIsInWatchedList(true)
    }
    const removeWatchedList = (element) => {
        removeFromMyWatchedList(element.imdbID)
        setIsInWatchedList(false)
    }


    const addRatingsList = (rating, movie) => {
        addToMyRatingsList(rating, movie)
    }


    const validateIsInTowatchList = (movie) => {
        let res = toWatchList.find(element => {
            return element.imdbID == movie.imdbID
        })
        console.log("res");
        console.log(res);
        if (res){
            setIsInToWatchList(true)
            return true
        }
        setIsInToWatchList(false)
        return false
    }
    const validateIsInwatchedList = (movie) => {
        let res = watchedList.find(element => {
            return element.imdbID == movie.imdbID
        })
        console.log("res");
        console.log(res);
        if (res){
            setIsInWatchedList(true)
            return true
        }
        setIsInWatchedList(false)
        return false
    }
    const validateIsInRatingsList = (movie) => {
        let res = ratingsList.find(element => {
            return element.imdbID == movie.imdbID
        })
        console.log("res");
        console.log(res);
        if (res){
            setIsInRatingsList(true)
        } else {
            setIsInRatingsList(false)
        }
    }


    const validateInLists = (movie) => {
        validateIsInwatchedList(movie)
        validateIsInTowatchList(movie)
        validateIsInRatingsList(movie)
    }

    return{
        addToWatchList,
        removeToWatchList,
        addWatchedList,
        removeWatchedList,
        addRatingsList,
        validateIsInTowatchList,
        validateIsInwatchedList,
        validateInLists,
        isInToWatchList,
        isInWatchedList,
        isInRatingsList, 
        toWatchList, 
        watchedList, 
        ratingsList
    }
}

export default useListManager