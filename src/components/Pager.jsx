import React from 'react'

const Pager = ({currentPage, changePage, totalPages}) => {

    const renderPager = () => {
        let pager = []

        //if(pagesList.length == 1){
        if(totalPages === 1){
            console.log(totalPages);
            return <li key={"pagerOption"+1} className="search-results__filters-option">
                    <button onClick={() => changePage(1)} className={"button--list-option " + (1 == currentPage ? "button--list-option--active" : "")}>1</button> 
                </li>
        }

        let lowerOffset = currentPage - 2
        let upperOffset = currentPage + 2

        if(currentPage != 1){
            pager.push(
                <li key={"pagerNavPrev"} className="search-results__filters-option">
                    <button onClick={() => changePage(currentPage - 1)} className="button--list-option ">Prev</button> 
                </li>
            )
        }

        pager.push(
            <li key={"pagerOption"+1} className="search-results__filters-option">
                <button onClick={() => changePage(1)} className={"button--list-option " + (1 == currentPage ? "button--list-option--active" : "")}>1</button> 
            </li>
        )

        if(lowerOffset > 2){
           
            pager.push(
                <li key={"pagerOptionExtraP"} className="search-results__filters-option">
                    <button className={"button--list-option "}>...</button> 
                </li>
            )
        }


        //for(let i of pagesList){
        for(let i = 2; i < totalPages; i++){
            //if(  i != 1 && i != pagesList.length && (i >= lowerOffset && i <= upperOffset)){
            if(i >= lowerOffset && i <= upperOffset){
                pager.push(
                    <li key={"pagerOption"+i} className="search-results__filters-option">
                        <button onClick={() => changePage(i)} className={"button--list-option " + (i == currentPage ? "button--list-option--active" : "")}>{i}</button> 
                    </li>
                )
            }
            
        }
        
        //if(upperOffset < pagesList.length ){
        if(upperOffset < totalPages ){
            pager.push(
                <li key={"pagerOptionExtraN"} className="search-results__filters-option">
                    <button className={"button--list-option "}>...</button> 
                </li>
            )
        }

        pager.push(
            /*<li key={"pagerOption"+pagesList.length} className="search-results__filters-option">*/
            <li key={"pagerOption"+totalPages} className="search-results__filters-option">
                {/*<button onClick={() => changePage(pagesList.length)} className={"button--list-option " + (pagesList.length == currentPage ? "button--list-option--active" : "")}>{pagesList.length}</button>*/}
                <button onClick={() => changePage(totalPages)} className={"button--list-option " + (totalPages == currentPage ? "button--list-option--active" : "")}>{totalPages}</button> 
            </li>
        )

        //if(currentPage < pagesList.length){
        if(currentPage < totalPages){
            pager.push(
                <li key={"pagerNavNext"} className="search-results__filters-option">
                    <button onClick={() => changePage(currentPage + 1)} className="button--list-option">Next</button> 
                </li>
            )
        }

        return pager
    }

    return renderPager()
}

export default Pager