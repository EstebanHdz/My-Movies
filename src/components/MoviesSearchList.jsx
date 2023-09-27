import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useMovie from '../hooks/useMovie'
import { Globals, validateIsInSearchTypes } from '../helpers/Globals'

import { FetchData } from '../helpers/LocalStorageHelper'
import Pager from './Pager'
import MoviePill from './MoviePill'
import useAddRemoveFromMyList from '../hooks/useAddRemoveFromMyList'



export const MoviesSearchList = ({pageType}) => {

    const [query, setQuery] = useState("")
    const [resultList, setResultList] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [sortType, setSortType] = useState("dateAsc")

    const [searchType, setSearchType] = useState("")

    const [totalPages, setTotalPages] = useState(1)
    
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const {addWatched,
        addToWatch,
        removeToWatch,
        removeWatched} = useAddRemoveFromMyList(resultList, setResultList)
    
    
    const searchNavigate = useNavigate()

    const location = useLocation()
    const {getWatchedFromMyList, getToWatchFromMyList} = useMovie()


    

    const resetPages = () => {
        setCurrentPage(1)
        setTotalPages(1)
    }
    
    const setPages = (totalRes) => {
        setTotalPages(Math.ceil(totalRes / 10))
    }

    const fetchSearchResults = async (q, p = 1, t = "", s = "dateAsc") => {
        let res = {}
        console.log(s);
        switch (pageType) {
            case "search":
                if(searchType === "all"){
                    t = ""
                }
                let url = Globals.apiURL + "?apikey=" + Globals.apiKey + "&s="+ q + "&page=" + p + "&type=" + t
                let options = {
                    method: "GET",
                }        
                res =  await FetchData(url, options)

                if(res.Error){
                    setError(res)
                    setResultList([])
                    break;
                }

                setResultList(res.Search)
                setPages(res.totalResults)
                setSearchType(t)
                break;
                

            case "toWatch":
                console.log("toWatch");
                res = getToWatchFromMyList(p, t, s)
                console.log(res.length);
                if(res.Search){
                    setResultList(res.Search)
                    setPages(res.totalResults)
                }else{
                    setResultList([])
                    setError({Error: "No movies in your list...", Response: "False"})
                }
                break;

            case "watched":
                console.log("watched");
                res = getWatchedFromMyList(p, t, s)
                if(res.Search){
                    setResultList(res.Search)
                    setPages(res.totalResults)
                }else{
                    setResultList([])
                    setError({Error: "No movies in your list...", Response: "False"})
                }
                break;
            
            default:
                break;
        }
        setTimeout(() => {

            setLoading(false)
        }, 500)
        
    }

    const filterSearch = (sortT) => {
        let results = []
        resetPages()
        setSortType(sortT)
        fetchSearchResults(null, 1, searchType, sortT)
    }


    const updatePager = (newPage, q = null) => {
        let res =[]
        switch (pageType) {
            case "search":
                searchNavigate("/search?query=" + query + "&page="+ newPage + "&type=" + searchType)
                break;
                
            case "toWatch":
                setCurrentPage(newPage)
                res = getToWatchFromMyList(newPage, searchType, sortType)
                setResultList(res.Search)
                setPages(res.totalResults)
                break;

            case "watched":
                
                setCurrentPage(newPage)
                res = getWatchedFromMyList(newPage, searchType, sortType)
                setResultList(res.Search)
                setPages(res.totalResults)
                break;
            
            default:
                break;
        }
    }
    
    const searchBy = (type) => {
        setLoading(true)
        resetPages()
        switch (pageType) {
            case "search":
                searchNavigate("/search?query=" + query + "&page=1&type=" + type)
                break;
                
            case "toWatch":
                searchNavigate("/myToWatchList?page=1&type=" + type)
                break;

            case "watched":
                searchNavigate("/myWatchedList?page=1&type=" + type)
                break;
            
            default:
                break;
        }
    }


    useEffect(() => {
        setLoading(true)
        setError(false)
        setSortType("dateAsc")
        const queryParameters = new URLSearchParams(window.location.search)
        let queryParam = queryParameters.get("query")
        let pageParam = queryParameters.get("page") ? parseInt(queryParameters.get("page")) : 1 
        let typeParam = queryParameters.get("type") ? queryParameters.get("type"): ""

        setTotalPages(1)

        if(queryParam !== query && queryParam){

            setQuery(queryParam)
            setCurrentPage(pageParam)
            let type = validateIsInSearchTypes(typeParam)
            fetchSearchResults(queryParam, pageParam, type)

        }else if(pageParam !== currentPage){
            setCurrentPage(pageParam)
            let type = validateIsInSearchTypes(typeParam)
            fetchSearchResults(queryParam, pageParam, type)

        }else if(typeParam !== searchType){
            let type = validateIsInSearchTypes(typeParam)
            setSearchType(type)
            setCurrentPage(pageParam)
            fetchSearchResults(queryParam, pageParam, type)
        }else{
            setSearchType("")
            setCurrentPage(1)
            //fetchSearchResults("", 1, "")
            fetchSearchResults(queryParam, 1, typeParam)
        }
    }, [location])

    return (
        <section className="search-results">

                    <>
                        <header className="search-results__title">

                                        
                            {   
                                pageType === "search" ?
                                    <h2 className="main-title">Search Results for: <span className="main-title--higlight">{query}</span></h2>
                                :
                                (
                                    pageType === "toWatch" ? 
                                        <h2 className="main-title">My Movies To <span className="main-title--higlight">Watch</span></h2>
                                    :
                                        <h2 className="main-title">Movies I have <span className="main-title--higlight">Watched</span></h2>
                                )
                            }



                        </header>

                        {
                            error ? ""
                            :
                            <div className="search-results__filters">
                                <ul className="search-results__filters-list">
                                    <li className="search-results__filters-option">
                                        <button onClick={() => searchBy(Globals.allTypeString)} className={"button--list-option " +  (searchType === Globals.allTypeString ? "button--list-option--active" : "")}>All</button> 
                                    </li>
                                    <li className="search-results__filters-option">
                                        <button onClick={() => searchBy(Globals.moviesTypeString)} className={"button--list-option " +  (searchType === Globals.moviesTypeString ? "button--list-option--active" : "")}>Movies</button> 
                                    </li>
                                    <li className="search-results__filters-option ">
                                        <button onClick={() => searchBy(Globals.seriesTypeString)} className={"button--list-option " +  (searchType === Globals.seriesTypeString ? "button--list-option--active" : "")}>Series</button> 
                                    </li>

                                    {
                                        pageType != "search"?
                                            <li className="search-results__filters-option search-results__filters-option--last">
                                                <input id="collapsible-menu" className="collapsible-menu" type="checkbox"/>
                                                <label htmlFor="collapsible-menu" className="button--list-option filters-option--last">Sort By <i className="fa-solid fa-caret-down"></i></label> 
                                                <ul className="dropdown__menu">
                                                    <li className = {sortType === "dateAsc" ? "active" : ""}><button  onClick={() => filterSearch("dateAsc")}>Newest Added</button></li>
                                                    <li className = {sortType === "dateDesc" ? "active" : ""}><button  onClick={() => filterSearch("dateDesc")}>Oldest Added</button></li>
                                                    <li className = {sortType === "nameAsc" ? "active" : ""}><button onClick={() => filterSearch("nameAsc")}>Name Asc.</button></li>
                                                    <li className = {sortType === "nameDesc" ? "active" : ""}><button  onClick={() => filterSearch("nameDesc")}>Name Desc.</button></li>
                                                    <li className = {sortType === "ratingAsc" ? "active" : ""}><button  onClick={() => filterSearch("ratingAsc")}>Best Rated</button></li>
                                                    <li className = {sortType === "ratingDesc" ? "active" : ""}><button  onClick={() => filterSearch("ratingDesc")}>Worst Rated</button></li>
                                                </ul>
                                            </li>
                                        :
                                            ""
                                    }

                                </ul>
                            </div>
                        }

                            <div className="search-results__container">

                                {
                                    error ?
                                        <div className='error-header'>
                                            <h1>{error.Error}</h1>
                                            <h2>Try Searching <br/> something else...</h2>
                                        </div>    
                                    : (
                                
                                        resultList.length > 0  && !loading ?
                                            <MoviePill resultList={resultList} removeToWatch={removeToWatch} removeWatched={removeWatched} addToWatch={addToWatch} addWatched={addWatched}/>
                                            
                                        : 
                                            <span className="loader"></span>
                                    )
                                }
                            </div>

                            <div className="search-results__filters">
                            <ul className="search-results__filters-list">
                                {
                                    totalPages > 0 ? 
                                        //renderPager()
                                        <Pager currentPage={currentPage} changePage={updatePager} totalPages={totalPages}/>
                                    :
                                    ""
                                }

                            </ul>
                        </div>
                    </>
        
            
            
        </section>
    )
}
