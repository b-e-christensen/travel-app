// Function that writes last search from LS to DOM and inits MAP
function writeLastSearch(lastSearched) {
    let lat = lastSearched.geometry.location.lat
    let lon = lastSearched.geometry.location.lng
    // Creates map from apis.js 
    initialize(lat, lon)
}

if (localStorage.getItem('last-search')) {
    // If the local storage object exists write it to DOM
    let lastSearched = JSON.parse(localStorage.getItem('last-search'))
    writeLastSearch(lastSearched)
    writeCityWikiData(lastSearched)
} 
else {
    window.location.replace('./pages/search.html')
}


document.getElementById('search-place-form').addEventListener('submit', searchFormHandler)