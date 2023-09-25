import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Globals } from '../helpers/Globals'
import { useParams, useLocation, NavLink } from 'react-router-dom'
import useMovie from '../hooks/useMovie'
import useAddRemoveFromMyList from '../hooks/useAddRemoveFromMyList'

const Error = () => {

    


    return (
        <section key="1" className="movie">
            <div className='error-header'>
                <h1>Page Not Found...</h1>
                <NavLink to={"/home"}><h2>Go Back to <br/> home</h2></NavLink>
                
            </div>
        </section>
    )
}

export default Error