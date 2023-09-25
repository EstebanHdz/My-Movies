import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Globals } from '../helpers/Globals'
import { useParams, useLocation } from 'react-router-dom'
import useMovie from '../hooks/useMovie'
import useAddRemoveFromMyList from '../hooks/useAddRemoveFromMyList'

const Movie = () => {

    const location = useLocation()
    const {id} = useParams()
    const [movie, setMovie] = useState({})

    const [reviewRating, setReviewRating] = useState(0)
    const [reviewText, setReviewText] = useState("")
    
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const { addToMyList, removeFromToWatch, removeFromWatched, removeFromReviewed, getElementByIdFromMyList, getSingleMovie} = useMovie()

    
    const {addWatched,
        addToWatch,
        removeToWatch,
        removeWatched} = useAddRemoveFromMyList(movie, setMovie)



    const fetchMovie = async () => {

        if( Object.keys(movie).length > 0){
            return {}
        }

        let url = Globals.apiURL + "?apikey=" + Globals.apiKey + "&i="+id
        let options = {
            method: "GET",
        }        
            
        let m = await getSingleMovie(url, options)
        setLoading(false)

        if(m.Error){
            setError(m)
            setMovie({})
            return m
        }


        setMovie(m)

        if(m.review){
            setReviewRating(m.review.rating)
            setReviewText(m.review.review)
        }

        return m
    }


    const submitReview = (e) => {
        e.preventDefault()
        let newReview = {rating: reviewRating, review: reviewText}
        addToMyList(movie, "review", newReview)

        let newM = {...movie}
        newM.review = newReview
        setMovie(newM)
    }

    const removeReview = (movie) => {
        setReviewRating(0)
        setReviewText("")
        removeFromReviewed(movie)
        let newM = {...movie}
        newM.review = null
        setMovie(newM)
    }



    const changeHover = (action, id) => {
        if(action === "enter"){
            let i = id
            while(i > 0 ){
                let element = document.getElementById("labelStar"+i)
                element.classList.add("star-hover")
                i = i - 0.5
            }

        }else if(action === "exit"){
            let i = id
            while(i > 0 ){
                let element = document.getElementById("labelStar"+i)
                element.classList.remove("star-hover")
                i = i - 0.5
            }
        }
    }


    const starsRender = () => {
        let offset = 1
        let arr = []
        for(let i = 0; i < 5; i++){
            let star1 = i + 0.5
            let star2 = star1 + 0.5
            arr.push(
                <div key={i} className="star-group">
                    <input type="radio" id={"star"+star1} name="rating" value={star1}  checked={reviewRating === star1} onChange={(e) => {setReviewRating(e.target.value)}}/>
                    <label onMouseEnter={(e) => changeHover("enter", star1)} onMouseLeave={(e) => changeHover("exit", star1)} id={"labelStar"+star1} className={"star--left full " + ((star1 <= reviewRating ) ? "star-active": "")} htmlFor={"star"+star1} title="Awesome - 5 stars">
                        <i className="fa-solid fa-star-half"></i>
                    </label>
                    <input type="radio" id={"star"+star2} name="rating" value={star2} checked={reviewRating === star2} onChange={(e) => {setReviewRating(e.target.value)}}/>
                    <label onMouseEnter={(e) => changeHover("enter", star2)} onMouseLeave={(e) => changeHover("exit", star2)} id={"labelStar"+star2} className={"star--right full "+ ((star2 <= reviewRating ) ? "star-active": "")} htmlFor={"star"+star2} title="Great - 4.5 stars">
                        <i className="fa-solid fa-star-half"></i>
                    </label>
                </div>
            )
            offset += 1
        }

        return arr
    }


    useEffect(() => {
        setError(false)
        setLoading(true)
        let mov =  fetchMovie()
    }, [location]) 


    return (
        <>
            <section key="1" className="movie">
            {
                loading ? 
                        <span className="loader"></span>
                :
                    (
                        error ?
                            <div className='error-header'>
                                <h1>Movie not found</h1>
                                <h2>Try Searching <br/> something else...</h2>
                            </div>
                        :

                        <>
                            <div className="movie__img-container">
                                <img className="movie__img" src={movie.Poster} alt=""/>
                            </div>
                            <div className="movie__info-container">

                                            
                                        <>
                                            <header className="movie__header">
                                                <div className="movie__quick-info">
                                                    <ul className="movie__quick-info-list">
                                                        <li className="movie__year">{movie.Year}</li>
                                                        <li className="movie__runtime">{movie.Runtime}</li>
                                                        <li className="movie__country">{movie.Rated}</li>
                                                    </ul>
                                                    <h1 className="movie__title">{movie.Title}</h1>
                                                    <h2 className="movie__director">{movie.Director}</h2>



                                                    <ul className="movie__action-list">
                                                        <li className="movie__action">

                                                            {
                                                                !movie.watched ?
                                                                    <button className="button-toolkit--light" onClick={() => addWatched(movie)} ><i className="fa-solid fa-eye-slash"></i>
                                                                        Not Watched
                                                                    </button>
                                                                :
                                                                    <button className="button-toolkit--light button-toolkit--light-checked" onClick={() => removeWatched(movie)}><i className="fa-solid fa-eye"></i>
                                                                        Watched
                                                                    </button>
                                                            }
                                                            
                                                        </li>
                                                        <li className="movie__action">
                                                            {
                                                                !movie.toWatch  ? 
                                                                    <button className="button-toolkit--light" onClick={() => addToWatch(movie)}><i className="fa-solid fa-plus"></i>
                                                                        Add to My List
                                                                    </button>
                                                                :
                                                                    <button className="button-toolkit--light button-toolkit--light-checked" onClick={() => removeToWatch(movie)}><i className="fa-solid fa-check"></i>
                                                                        In my list
                                                                    </button>
                                                            }
                                                            
                                                        </li>
                                                        <li className="movie__action">
                                                            {
                                                                !movie.review ? 
                                                                    <button className="button-toolkit--light"><label className="rating-edit-modal__label" htmlFor="rating-edit-modal__state"> <i className="fa-regular fa-star"></i>
                                                                        Review
                                                                    </label></button>
                                                                :
                                                                    <button className="button-toolkit--light button-toolkit--light-checked"><label className="rating-edit-modal__label" htmlFor="rating-edit-modal__state"> <i className="fa-solid fa-star"></i>
                                                                        Reviewed
                                                                    </label></button>
                                                            }
                                                            
                                                        </li>
                                                    </ul>

                                                </div>
                                                <ul className="movie__rating-list">

                                                    {
                                                        movie.review ? 
                                                            <li className="movie__rating-element movie__rating-element--main">
                                                                <p className="movie__rating-number">{movie.review.rating}<span>/5</span></p>
                                                                <h4 className="movie__rating-site">My Rating</h4>
                                                            </li>
                                                        :
                                                        ""
                                                    }
                                                    
                                                    {
                                                        movie.Ratings.imdb?

                                                            <li className="movie__rating-element">
                                                                <p className="movie__rating-number">{movie.Ratings.imdb}<span>/10</span></p>
                                                                <h4 className="movie__rating-site">IMDb</h4>
                                                            </li>
                                                        :
                                                            <li className="movie__rating-element">
                                                                <p className="movie__rating-number">N/A</p>
                                                                <h4 className="movie__rating-site">IMDb</h4>
                                                            </li>
                                                    }
                                                    {
                                                        movie.Ratings.rottenTomatoes?

                                                            <li className="movie__rating-element">
                                                                <p className="movie__rating-number">{movie.Ratings.rottenTomatoes}<span>%</span></p>
                                                                <h4 className="movie__rating-site">R. Tomatoes</h4>
                                                            </li>
                                                        :
                                                            <li className="movie__rating-element">
                                                                <p className="movie__rating-number">N/A</p>
                                                                <h4 className="movie__rating-site">R. Tomatoes</h4>
                                                            </li>
                                                    }
                                                    {
                                                        movie.Ratings.metacritic?

                                                            <li className="movie__rating-element">
                                                                <p className="movie__rating-number">{movie.Ratings.metacritic}<span>%</span></p>
                                                                <h4 className="movie__rating-site">Metacritic</h4>
                                                            </li>
                                                        :
                                                            <li className="movie__rating-element">
                                                                <p className="movie__rating-number">N/A</p>
                                                                <h4 className="movie__rating-site">Metacritic</h4>
                                                            </li>
                                                    }
                                                    
                                                    
                                                </ul>
                                            </header>



                                            <section className="movie__main-info">

                                                <ul className="movie__main-info-list">
                                                    <li className="movie__main-info-element">
                                                        <h4>Writers</h4>
                                                        <ul>
                                                            {
                                                                movie.Writer.map((writer, id) => (<li key={id}>{writer}</li>))
                                                            }
                                                        </ul>
                                                    </li>
                                                    <li className="movie__main-info-element">
                                                        <h4>Country</h4>
                                                        <ul>
                                                            {
                                                                movie.Country.map((country, id) => <li key={id}>{country}</li>)
                                                            }
                                                        </ul>
                                                    </li>
                                                    <li className="movie__main-info-element">
                                                        <h4>Languages</h4>
                                                        <ul>
                                                            {
                                                                movie.Language.map((language, id) => <li key={id}>{language}</li>)
                                                            }
                                                        </ul>
                                                    </li>
                                                    <li className="movie__main-info-element">
                                                        <h4>Main Cast</h4>
                                                        <ul>
                                                            {
                                                                movie.Actors.map((actors, id) => <li key={id}>{actors}</li>)
                                                            }
                                                        </ul>
                                                    </li>
                                                    <li className="movie__main-info-element">
                                                        <h4>Genre</h4>
                                                        <ul>
                                                            {
                                                                movie.Genre.map((genre, id) => <li key={id}>{genre}</li>)
                                                            }
                                                        </ul>
                                                    </li>
                                                </ul>

                                                <div className="movie__short-plot">
                                                    <h3>Summary</h3>
                                                    <p>{movie.Plot}</p>
                                                </div>

                                                {
                                                    movie.review ? 
                                                        <div className="movie__short-plot">
                                                            <h3>My Review</h3>
                                                            <p>{movie.review.review}</p>
                                                        </div>
                                                    :
                                                    ""
                                                }
                                                

                                            </section>
                                        </>
                                
                            </div>
                        </>
                    )
                }
            </section>

            <input key="2" className="rating-edit-modal__state" id="rating-edit-modal__state" type="checkbox" />
            <div className="rating-edit-modal">
                <label className="rating-edit-modal__bg" htmlFor="rating-edit-modal__state"></label>
                <div className="rating-edit-modal__inner">
                    <label className="rating-edit-modal__close" htmlFor="rating-edit-modal__state"></label>
                    <div className="rating-edit-modal__content">
                        <h2 className="main-title">My rating for: <br/><span className="main-title--higlight">Parasite</span></h2>
                        <form onSubmit={submitReview} className="rating-edit-modal__form">
                            <fieldset className="rating__demo2">
                                {
                                    starsRender()
                                }
                            </fieldset>


                            <textarea className="rating-edit-modal__review" name="my-review" id="my-review" placeholder="My review for this movie..." onChange={(e) => setReviewText(e.target.value)} value={reviewText}></textarea>
                            <div className="rating-edit-modal__action-buttons">
                                {
                                    movie.review ? 
                                        <button onClick={() => removeReview(movie)} className="button--secondary rating-edit-modal__action-button rating-edit-modal__action-button--extra" type="button" >Delete Review</button>
                                    :
                                        ""
                                }

                            
                                <label htmlFor="rating-edit-modal__state" className=" rating-edit-modal__action-button button--secondary">Cancel</label>
                                <input className="button--principal rating-edit-modal__action-button" type="submit" value="Save Review"/>
                            </div>
                        </form>
                    </div>


                </div>
            </div>
                
            
        </>
    )
}

export default Movie