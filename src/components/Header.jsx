import React, { useEffect, useRef, useState } from 'react'
import Logo from "../assets/imgs/logo.png"
import { NavLink, useParams, useNavigate, useLocation } from 'react-router-dom'

const Header = () => {

    const [queryValue, setQueryValue] = useState("")

    const location = useLocation()

    const searchNavigate = useNavigate()

    const updateSearch = (e) =>{
        setQueryValue(e.target.value);
    }

    const search = (e) =>{
        e.preventDefault()
        searchNavigate("/search?query="+queryValue+"&page=1")
    }

    useEffect(() => {
        const queryParameters = new URLSearchParams(window.location.search)
        if(queryParameters.get("query") != null){

            setQueryValue(queryParameters.get("query"))
        }else{
            setQueryValue("")
        }

    }, [location])
    
    return (
        <nav className="main__navbar">
            <div className="navbar__logo-container">
                <NavLink className="navbar__logo-container" to="/">
                    <img src={Logo} alt="" className="logo-img"/>
                    <h2 className="navbar__logo-title">Tiny Movies</h2>
                </NavLink>
            </div>

            <div className="navbar__search-bar">
                <form onSubmit={search} className="search-bar__form">
                    <input className="search-bar__search-input" type="text" name="navbar-searchbar" id="" placeholder="Search Movies or Series" onChange={updateSearch} value={queryValue}/>
                    {/*<input className="search-bar__search-button" type="submit" value="&#xf002"/>*/}
                    <button type="submit" className="search-bar__search-button"><i className="fa-solid fa-magnifying-glass search-bar__search"></i></button>
                </form>
            </div>

            <div className="navbar__menu-container">
                <ul className="menu-container__items-list">
                    <li className={"menu-container__item " + (location.pathname === "/myToWatchList" ? "menu-link--active" : "")} >
                        <NavLink to="/myToWatchList" className="">To Watch List</NavLink>
                        <i className="fa-solid fa-circle"></i>
                    </li>
                    <li className={"menu-items__item " + (location.pathname === "/myWatchedList" ? "menu-link--active" : "")}>
                        <NavLink to="/myWatchedList" className="menu-link">Watched List</NavLink>
                        <i className="fa-solid fa-circle"></i>
                    </li>
                </ul>
            </div>
        </nav>
  )
}

export default Header