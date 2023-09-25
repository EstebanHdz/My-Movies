export const SaveElementInLocalStorage = (newElementToAdd, key) => {

    //READ OBJECTS IN LOCAL STORAGE
    let localList = JSON.parse(localStorage.getItem(key))

    if(Array.isArray(localList)){

        if (localList.find(element => {
            if (element.imdbID == newElementToAdd.imdbID) return true
        })) return

        localList.push(newElementToAdd)
    }else{
        localList = [newElementToAdd]
    }

    localStorage.setItem(key, JSON.stringify(localList))

    return newElementToAdd
}