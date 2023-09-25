import React from 'react'
import { Link } from 'react-router-dom'
import { Globals } from '../helpers/Globals'


import MovieDefault from "../assets/imgs/movieDefault.jpg"
import SeriesDefault from "../assets/imgs/seriesDefault.jpg"
import GameDefault from "../assets/imgs/gameDefault.jpg"

const MoviePill = ({
    resultList,
    addToWatch,
    addWatched,
    removeToWatch,
    removeWatched}) => {


    const getPoster = (poster, type) => {
        console.log(type);
        if(poster === "N/A"){
            switch (type) {
                case Globals.moviesTypeString:
                    return MovieDefault
                    break;
    
                case Globals.seriesTypeString:
                    return SeriesDefault
                    break;
    
                case Globals.gamesTypeString:
                    return GameDefault
                    break;
            
                default:
                    break;
            }
        }
        return poster
    }

    let arr = resultList.map((element, index) => {

                            
        return (
            <article className="movie-card" key={index}>
                <div className="movie-card__image-container">
                    <img src={getPoster(element.Poster, element.Type)} alt="" className="movie-card__image" />
                </div>
                <section className="movie-card__content">
                    <h4 className="movie-card__type">{element.Type}</h4>
                    <h4 className="movie-card__year">{element.Year}</h4>
                    <h3 className="movie-card__title"><Link to={"/movie/" + element.imdbID}  > {element.Title}</Link></h3>
                </section>
                <div className="movie-card__info">
                    {
                        element.watched ?
                            <button onClick={() => removeWatched(element,)} className="button-toolkit button-toolkit--checked"><i className="fa-solid fa-eye"></i></button>
                            :
                            <button onClick={() => addWatched(element)} className="button-toolkit"><i className="fa-solid fa-eye-slash"></i></button>
                    }
                    {
                        element.toWatch ?
                            <button onClick={() => removeToWatch(element)} className="button-toolkit button-toolkit--checked"><i className="fa-solid fa-check"></i></button>
                            :
                            <button onClick={() => addToWatch( element)} className="button-toolkit"><i className="fa-solid fa-plus"></i></button>
                    }

                </div>
                    {
                        element.review ?
                                <h2 className="button-toolkit--rating">{element.review.rating} 
                                <span>/ 5</span></h2>
                        :
                        ""
                    }
            </article>
        )
    })

    return arr
}

export default MoviePill