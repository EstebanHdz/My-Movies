export const RetrieveElementsInLocalStorage = (key) => {
    let elementList = JSON.parse(localStorage.getItem(key))

    return elementList
}