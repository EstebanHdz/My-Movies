export const Globals = {
    apiKey: "f628813c",
    apiURL: "http://www.omdbapi.com/",
    toWatchList: "toWatchList",
    watchedList: "watchedList",
    ratingsList: "ratingsList",
    myListName: "myList",
    allTypeString: "",
    moviesTypeString: "movie",
    seriesTypeString: "series",
    gamesTypeString: "game"
}

export const validateIsInSearchTypes = (type) => {
    return (type && (type === "movie" || type === "series" || type === "game")) ? type : ""
}