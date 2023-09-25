import React, { useRef } from 'react'
import Logo from "../assets/imgs/logo.png"
import { Link, useNavigate } from 'react-router-dom'

const Main = () => {

    const searchField = useRef("SearchField")
    const searchNavigate = useNavigate()

    const search = (e) =>{
        e.preventDefault()
        let form = new FormData(e.target)

        console.log(form.get("navbar-searchbar"))
        searchNavigate("/search?query="+form.get("navbar-searchbar")+"&page=1")
    }

    return (
        <div className="main__hero">
            <div className="hero__logo-container">
                <img src={Logo} className="logo-img"></img>

                <h1 className="hero__logo-title">Tiny Movies</h1>
                <h3>Create simple lists of your favourite movies</h3>
            </div>
            <div className="hero__search-bar">
                <form onSubmit={search} className="search-bar__form">
                    <input type="text" name="navbar-searchbar" id="" placeholder="Search Movies or Series" className="search-bar__search-input"/>
                    {/*<input type="submit" value="&#xf002" className="search-bar__search-button"/>*/}
                    <button  type="submit" className="search-bar__search-button"><i className="fa-solid fa-magnifying-glass search-bar__search"></i></button>
                    
                </form>
            </div>

            <div className="hero__menu-container">
                <Link to="/myToWatchList" className="hero-button button--secondary">My To-Watch List</Link>
                <Link to="/myWatchedList" className="hero-button button--secondary" >My Watched List</Link>
            </div>
        </div>
    )
}

export default Main