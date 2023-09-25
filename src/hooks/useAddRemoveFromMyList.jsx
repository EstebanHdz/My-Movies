import React, { useState } from 'react'

import useMovie from '../hooks/useMovie'

const useAddRemoveFromMyList = (state, stateSetter) => {

    const {
        addToMyList, 
        removeFromToWatch,
        removeFromWatched} = useMovie()
    
    const updateState = (updatedElement) => {
        console.log("updateState");
        if (Array.isArray(state)){
            let index = state.findIndex((element) => {
                return element.imdbID === updatedElement.imdbID
            })
            state.splice(index, 1, updatedElement)
    
            stateSetter(state)
        }else{
            stateSetter(updatedElement)
        }
    }


    const addWatched = (element) => {
        addToMyList(element, "watched")
        
        let updatedElement = {...element}
        updatedElement.watched = true
        updateState(updatedElement)
    }

    const addToWatch = (element) => {

        let updatedElement = {...element}
        updatedElement.toWatch = true
        updateState(updatedElement)
        addToMyList(element, "toWatch")
    }

    const removeWatched = (element) => {
        removeFromWatched(element)
        
        let updatedElement = {...element}
        updatedElement.watched = false
        updateState(updatedElement)
    }

    const removeToWatch = (element) => {
        removeFromToWatch(element)

        let updatedElement = {...element}
        updatedElement.toWatch = false
        updateState(updatedElement)
    }

    return {
        addWatched,
        addToWatch,
        removeToWatch,
        removeWatched
    }
}

export default useAddRemoveFromMyList