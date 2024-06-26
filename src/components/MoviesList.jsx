import React, { useRef, useState, useEffect } from 'react'
import { Link, NavLink, useParams, useLocation } from 'react-router-dom'
import useMovie from '../hooks/useMovie'
import { Globals } from '../helpers/Globals'
import useListManager from '../hooks/useListManager'

export const MoviesList = ({listName}) => {

    const [query, setQuery] = useState("")
    const [resultList, setResultList] = useState([])
    const [nextPage, setNextPage] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [prevPage, setPrevPage] = useState(0)
    const [pagesList, setPagesList] = useState([1])

    const [searchType, setSearchType] = useState("all")

    const [totalResults, setTotalResults] = useState(0)
    const [hasLoaded, setHasLoaded] = useState(false)

    const location = useLocation()
    const {
            myList,
            addToMyList, 
            removeFromToWatch,
            removeFromWatched, 
            removeFromReviewed, 
            getWatchedFromMyList, 
            getToWatchFromMyList,
            getElementByIdFromMyList} = useMovie()

    const {addToWatchList,
        removeToWatchList,
        addWatchedList,
        removeWatchedList,
        validateInLists,
        validateIsInTowatchList,
        validateIsInwatchedList,
        isInToWatchList,
        isInWatchedList,
        isInRatingsList, 
        toWatchList,
        watchedList,
        ratingsList} = useListManager()


    const resetPages = () => {
        setPagesList([1])
        setNextPage(0)
        setCurrentPage(1)
        setPrevPage(0)
    }
    
    const setPages = (totalRes) => {
        let results = Math.ceil(totalRes / 10)
        setTotalResults(results)
        let newPagesList = []
        for(let i = 1; i <= results;  i++){
            newPagesList.push(i)
        }
        console.log("results");
        console.log(results);
        console.log(newPagesList);
        let nP = currentPage + 1
        setPagesList(newPagesList)
        setNextPage(nP + 1)
        setCurrentPage(nP)
        setPrevPage(nP - 1)
    }

    const fetchSearchResults = async (q, p, t) => {
        let url = Globals.apiURL + "?apikey=" + Globals.apiKey + "&s="+ q + "&page=" + p
        console.log(url);
        let options = {
            method: "GET",
        }        

        let petition = await fetch(url, options)

        if (petition.status === 200) {
            let result = await petition.json()
            console.log(result)

            let updatedResults = result.Search.map(element => {
                let m = getElementByIdFromMyList(element.imdbID)
                if(m){
                    console.log("found");
                    let newElement = {...element}
                    newElement.watched = m.watched
                    newElement.toWatch = m.toWatch
                    return newElement
                }
                console.log("not found");
                return element
            });
            console.log("updatedResults");
            console.log(updatedResults);
            setResultList(updatedResults)
            setTotalResults(result.totalResults)
            return(result)
        }
    }





    //CREATE COMPONENT
    const renderPager = () => {
        let pager = []

        if(prevPage != 0){
            pager.push(
                <li className="search-results__filters-option">
                    <button className="button--list-option ">Prev</button> 
                </li>
            )
        }
        
        for(let i of pagesList){
            pager.push(
                <li key={"pagerOption"+i} className="search-results__filters-option">
                    <button className={"button--list-option " + (i == currentPage ? "button--list-option--active" : "")}>{i}</button> 
                </li>
            )
        }
        
        if(nextPage > 1){
            pager.push(
                <li className="search-results__filters-option">
                    <button className="button--list-option">Next</button> 
                </li>
            )
        }

        return pager
    }


    const renderMovies = () => {

    }

    const searchAll = () => {
        let results = []
        resetPages()

        if(listName != "search"){
            results = getToWatchFromMyList(currentPage, null, "dateDesc")
        }else{

        }

        setSearchType("all")
        setResultList(results)
        setTotalResults(results.length)
    }

    const searchMovies = () => {
        let results = []
        resetPages()

        if(listName != "search"){
            results = getToWatchFromMyList(currentPage, "movies", "dateDesc")
        }else{

        }

        console.log(results);
        setSearchType("movies")
        setResultList(results)
        setTotalResults(results.length)
    }

    const searchSeries = () => {
        let results = []
        resetPages()

        if(listName != "search"){
            results = getToWatchFromMyList(currentPage, "series", "dateDesc")
        }else{

        }

        console.log(results);
        setSearchType("series")
        setResultList(results)
        setTotalResults(results.length)
    }

    useEffect(() => {

        if(listName === "search"){
            console.log(listName);
            const queryParameters = new URLSearchParams(window.location.search)
            if(queryParameters.get("query") !== query){
                console.log(queryParameters.get("query"));
                setQuery(queryParameters.get("query"))

                //let r = fetchSearchResults(queryParameters.get("query"), currentPage + 1)
                let r = fetchSearchResults(queryParameters.get("query"), currentPage)
                //let results = r.Search
                //let tResults = r.totalResults
            }

            
            //setPages(tResults)
        }


    }, [location])

    useEffect(() => {

        if(!hasLoaded){
            setHasLoaded(true)
            return
        }

        console.log(listName);
        let results = []
        let tResults = 0

        if(listName === "toWatch"){
            results = getToWatchFromMyList(currentPage, null, "dateDesc")
        }else if(listName === "watched"){
            results = getWatchedFromMyList(currentPage, null, "dateDesc")
            
        }
        
        console.log("results");
        console.log(results);
        console.log(currentPage);

        console.log(results.length);

        setResultList(results)
        setTotalResults(results.length)
        //setPages(results.length)

    }, [myList])

    return (
        <section className="search-results">
            <header className="search-results__title">

            {
                listName === "search" ?
                    <h2 className="main-title">Search Results for: <span className="main-title--higlight">{query}</span></h2>
                :
                (
                    listName === "toWatch" ?
                        <h2 className="main-title">My Movies To <span className="main-title--higlight">Watch</span></h2>
                    :
                    <h2 className="main-title">Movies I have <span className="main-title--higlight">Watched</span></h2>
                )
            }
            </header>

            <div className="search-results__filters">
                <ul className="search-results__filters-list">
                    <li className="search-results__filters-option">
                        <button onClick={searchAll} className={"button--list-option " +  (searchType === "all" ? "button--list-option--active" : "")}>All</button> 
                    </li>
                    <li className="search-results__filters-option">
                        <button onClick={searchMovies} className={"button--list-option " +  (searchType === "movies" ? "button--list-option--active" : "")}>Movies</button> 
                    </li>
                    <li className="search-results__filters-option">
                        <button onClick={searchSeries} className={"button--list-option " +  (searchType === "series" ? "button--list-option--active" : "")}>Series</button> 
                    </li>

                    {
                        listName !== "search" ?
                            <li className="search-results__filters-option">
                                <input id="collapsible-menu" className="collapsible-menu" type="checkbox"/>
                                <label htmlFor="collapsible-menu" className="button--list-option filters-option--last">Sort By <i className="fa-solid fa-caret-down"></i></label> 
                                <ul className="dropdown__menu">
                                    <li>Name Asc.</li>
                                    <li>Name Desc.</li>
                                    <li>Date Added Asc.</li>
                                    <li className="active">Date Added Desc.</li>
                                </ul>
                            </li>
                        :
                        ""
                    }
                </ul>
            </div>

            <div className="search-results__container">
                
                {   
                    resultList.length > 0 ?
                        resultList.map((result, index) => {
                            return (
                                <article className="movie-card" key={index}>
                                    <div className="movie-card__image-container">
                                        <img src={result.Poster} alt="" className="movie-card__image"/>
                                    </div>
                                    <section className="movie-card__content">
                                        <h4 className="movie-card__year">{result.Year}</h4>
                                        <h3 className="movie-card__title"><Link to={"/movie/" + result.imdbID}  > {result.Title}</Link></h3>
                                    </section>
                                    <div className="movie-card__info">
                                        {
                                            result.watched? 
                                                <button onClick={() => removeFromWatched(result)} className="button-toolkit button-toolkit--checked"><i className="fa-solid fa-eye"></i></button>
                                            :
                                                <button onClick={() => addToMyList(result, "watched") } className="button-toolkit"><i className="fa-solid fa-eye-slash"></i></button>
                                        }
                                        {
                                            result.toWatch ?
                                                <button onClick={() => removeFromToWatch(result)} className="button-toolkit button-toolkit--checked"><i className="fa-solid fa-check"></i></button>
                                            :
                                                <button onClick={() => addToMyList(result, "toWatch") } className="button-toolkit"><i className="fa-solid fa-plus"></i></button>
                                        }
                                        
                                    </div>
                                </article>
                            )
                        })
                    : ""
                }
                



            </div>

            <div className="search-results__filters">
                <ul className="search-results__filters-list">

                    {
                        pagesList.length > 0 ? 
                            renderPager()
                        :
                        ""
                    }
                    
                </ul>
            </div>
        </section>
    )
}
