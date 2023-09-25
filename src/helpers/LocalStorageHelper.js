import { Globals } from "./Globals";


const cleanJSONResponse = (result) => {
    let newResult = {...result}


    let ratings = {}

    let imdb = result.Ratings.find((rating) => 
             rating.Source === "Internet Movie Database"
        )
    
    imdb ?  ratings.imdb = imdb.Value.split("/10")[0] : null 
    
    let rt = result.Ratings.find((rating) => 
             rating.Source === "Rotten Tomatoes"
        )

    rt ?  ratings.rottenTomatoes = rt.Value.split("%")[0]: null 

    let mc = result.Ratings.find((rating) => 
             rating.Source === "Metacritic"
        )

    mc ? ratings.metacritic = mc.Value.split("/")[0] : null



    newResult.Actors = result.Actors.split(", ")
    newResult.Writer = result.Writer.split(", ")
    newResult.Language = result.Language.split(", ")
    newResult.Country = result.Country.split(", ")
    newResult.Genre = result.Genre.split(", ")
    newResult.Ratings = ratings
    return newResult
}


const updateResultList = (resList = null) => {
    let updatedResults = resList.map(element => {
        let m = RetrieveElementByID(Globals.myListName, element.imdbID)

        let newElement = {...element}

        if(newElement.Poster === "N/A"){
            switch (newElement.Type) {
                case Globals.moviesTypeString:
                    newElement.Poster = "/src/assets/imgs/movieDefault.jpg"
                    break;

                case Globals.seriesTypeString:
                    newElement.Poster = "/src/assets/imgs/seriesDefault.jpg"
                    break;

                case Globals.gamesTypeString:
                    newElement.Poster = "/src/assets/imgs/gameDefault.jpg"
                    break;
            
                default:
                    break;
            }
        }

        if(m){
            newElement.watched = m.watched
            newElement.toWatch = m.toWatch
            newElement.review = m.review
            return newElement
        }
        newElement.watched = false
        newElement.toWatch = false
        newElement.review = null
            
        return newElement
    });
    //setResultList(updatedResults)
    return updatedResults
}

const updateResultElement = (res) => {
    let m = RetrieveElementByID(Globals.myListName, res.imdbID)

    let newMovie = {...res}

    /*if(newMovie.Poster === "N/A"){
        switch (newMovie.Type) {
            case Globals.moviesTypeString:
                newMovie.Poster = "/src/assets/imgs/movieDefault.jpg"
                break;

            case Globals.seriesTypeString:
                newMovie.Poster = "/src/assets/imgs/seriesDefault.jpg"
                break;

            case Globals.gamesTypeString:
                newMovie.Poster = "/src/assets/imgs/gameDefault.jpg"
                break;
        
            default:
                break;
        }
    }*/

    newMovie = cleanJSONResponse(newMovie)

    if(m){
        newMovie.watched = m.watched
        newMovie.toWatch = m.toWatch
        newMovie.review = m.review
        return newMovie
    }
    newMovie.watched = false
    newMovie.toWatch = false
    newMovie.review = null
        
    return newMovie
}


const SaveElement = (newElementToAdd, key) => {

    //READ OBJECTS IN LOCAL STORAGE
    let localList = JSON.parse(localStorage.getItem(key))

    if(Array.isArray(localList)){

        let index = localList.findIndex(element => {
            return element.imdbID == newElementToAdd.imdbID
        })

        /*let newList = localList.filter((element) => {
            if(element.imdbID == newElementToAdd.imdbID){
                return ({...element, ...newElementToAdd})
            }
        })*/
        if(index == -1){
            localList.push(newElementToAdd)
        }else{
            localList.splice(index, 1, {...localList[index], ...newElementToAdd})
            if(!localList[index].toWatch && !localList[index].watched && !localList[index].review){
                localList.splice(index, 1)
            }
        }

    }else{
        localList = [newElementToAdd]
    }

    localStorage.setItem(key, JSON.stringify(localList))
    return localList
}
const UpdateElement = (elementToUpdate, key) => {
    let localList = JSON.parse(localStorage.getItem(key))

    if(Array.isArray(localList)){

        let newList = localList.filter(element => {
            return element.imdbID != elementToUpdate.imdbID
        })
        newList.push(elementToUpdate)
        localList = newList
    }else{
        localList = [elementToUpdate]
    }

    localStorage.setItem(key, JSON.stringify(localList))

    return elementToUpdate
}

const RemoveElementById = (id, key) => {

    //READ OBJECTS IN LOCAL STORAGE
    let localList = JSON.parse(localStorage.getItem(key))
    if(Array.isArray(localList)){

        let newList = localList.filter(element => {
            return element.imdbID != id
        })

        localStorage.setItem(key, JSON.stringify(newList))
    }

}

const RetrieveElements = (key) => {
    let elementList = JSON.parse(localStorage.getItem(key))

    if(!elementList){
        return []
    }

    return elementList
}

const RetrieveElementByID = (key, id) => {
    let elementList = JSON.parse(localStorage.getItem(key))

    if(!elementList){
        return null
    }

    let e = elementList.find((element) => {
        return element.imdbID == id
    })

    return e 
}

const GetToWatchElementsPaginated = (key, page, type = null, sort = null) => {
    let elementList = JSON.parse(localStorage.getItem(key))
    let filteredList = []
    let response = {Search: [], totalResults: 0}

    if(!elementList){
        return []
    }

    filteredList = elementList.filter((element) => {
        if(element.toWatch == true){
            return element
        }
    })
    
    if(!type && !sort){
        response.totalResults = filteredList.length
        response.Search = filteredList.slice((page * 10) - 10, page * 10)
        console.log(response);
        return response
    }
    
    if(type){
        switch(type){
            case Globals.moviesTypeString:
                filteredList = filteredList.filter((element) => {
                    if(element.Type == "movie"){
                        return element
                    }
                })
                break;
            
            case Globals.seriesTypeString:
                filteredList = filteredList.filter((element) => {
                    if(element.Type == "series"){
                        return element
                    }
                })
                break;

            default:
                break;
        }
    }


    if(sort){
        switch(sort){
            case "nameAsc":
                filteredList = filteredList.sort((a, b) => {
                    return a.Title.localeCompare(b.Title) 
                })
                break;
            
            case "nameDesc":
                filteredList = filteredList.sort((a, b) => {
                    return b.Title.localeCompare(a.Title)
                })
                break;
            
            case "dateAsc":
                filteredList = filteredList.sort((a, b) => {
                    return b.addedToToWatch - a.addedToToWatch
                })
                break;
            
            case "dateDesc":
                filteredList = filteredList.sort((a, b) => {
                    return a.addedToToWatch - b.addedToToWatch
                })
                break;

            case "ratingAsc":
                filteredList = filteredList.sort((a, b) => {
                    if(!a.review || !b.review){
                        return -6
                    }
                    return b.review.rating - a.review.rating
                })
                break;

            case "ratingDesc":
                filteredList = filteredList.sort((a, b) => {
                    if(!a.review || !b.review){
                        return 6
                    }
                    return a.review.rating - b.review.rating
                })
                break;
        }
    }
    response.totalResults = filteredList.length

    response.Search = filteredList.slice((page * 10) - 10, page * 10)
    return response
}

const GetWatchedElementsPaginated = (key, page, type = null, sort = null) => {
    let elementList = JSON.parse(localStorage.getItem(key))
    let filteredList = []
    let response = {Search: [], totalResults: 0}
    if(!elementList){
        return []
    }


    filteredList = elementList.filter((element) => {
        if(element.watched == true){
            return element
        }
    })

    console.log(sort);
    if(!type && !sort){
        response.totalResults = filteredList.length
        response.Search = filteredList.slice((page * 10) - 10, page * 10)
        return response
    }

    
    if(type){
        switch(type){
            case Globals.moviesTypeString:
                filteredList = filteredList.filter((element) => {
                    if(element.Type == "movie"){
                        return element
                    }
                })
                break;
            
            case Globals.seriesTypeString:
                filteredList = filteredList.filter((element) => {
                    if(element.Type == "series"){
                        return element
                    }
                })
                break;
            
        }
    }

    console.log(sort);
    if(sort){
        switch(sort){
            case "nameAsc":
                filteredList = filteredList.sort((a, b) => {
                    return a.Title.localeCompare(b.Title) 
                })
                break;
            
            case "nameDesc":
                filteredList = filteredList.sort((a, b) => {
                    return b.Title.localeCompare(a.Title)
                })
                break;
            
            case "dateAsc":
                filteredList = filteredList.sort((a, b) => {
                    return b.addedToWatched - a.addedToWatched
                })
                break;
            
            case "dateDesc":
                filteredList = filteredList.sort((a, b) => {
                    return a.addedToWatched - b.addedToWatched
                })
                break;

            case "ratingAsc":
                filteredList = filteredList.sort((a, b) => {
                    if(!a.review || !b.review){
                        return -6
                    }
                    return b.review.rating - a.review.rating
                })
                break;

            case "ratingDesc":
                filteredList = filteredList.sort((a, b) => {
                    if(!a.review || !b.review){
                        return 6
                    }
                    return a.review.rating - b.review.rating
                })
                break;
        }
    }
    response.totalResults = filteredList.length

    response.Search = filteredList.slice((page * 10) - 10, page * 10)
    return response
}

const GetAllElementsPaginated = (key, page, filter = null, sort = null) => {
    let elementList = JSON.parse(localStorage.getItem(key))

    if(!elementList){
        return []
    }

    if( !filter && !sort){
        return elementList.slice((page * 10) - 10, page * 10)
    }


    if(filter){
        switch(filter){
            case "movies":
                filteredList = filteredList.filter((element) => {
                    if(element.Type == "movie"){
                        return element
                    }
                })
                break;
            
            case "series":
                filteredList = filteredList.filter((element) => {
                    if(element.Type == "series"){
                        return element
                    }
                })
                break;
            
        }
    }

    if(sort){
        switch(sort){
            case "nameAsc":

                break;
            
            case "nameDesc":
                break;
            
            case "dateAsc":
                //filteredList.sort((a.) => {})
                break;
            
            case "dateDesc":
                break;
        }
    }
    

    return filteredList.slice((page * 10) - 10, page * 10)
}

const FetchSingleMovie = async (url, options) => {
    let petition = await fetch(url, options)

    if (petition.status === 200) {
        let result = await petition.json()

        if(result.Error){
            return result
        }

        return updateResultElement(result)
    }
}


const FetchData = async (url, options) => {
    let petition = await fetch(url, options)

    if (petition.status === 200) {
        let result = await petition.json()

        if(result.Error){
            return result
        }

        let res = {Search:null, totalResults: null}
        res.Search = updateResultList(result.Search)
        res.totalResults = result.totalResults
        //setTotalResults(result.totalResults)
        //setPages(result.totalResults)
        return res
    }

}

//const GetElementsPaginated


export {
    RemoveElementById,
    SaveElement,
    UpdateElement,
    RetrieveElements,
    GetAllElementsPaginated,
    GetToWatchElementsPaginated,
    GetWatchedElementsPaginated,
    RetrieveElementByID, 
    FetchData,
    FetchSingleMovie
}