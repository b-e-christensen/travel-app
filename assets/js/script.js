// Function that writes last search from LS to DOM and inits MAP
function writeLastSearch(lastSearched) {
    let lat = lastSearched.geometry.location.lat
    let lon = lastSearched.geometry.location.lng
    let imgEl = document.getElementById('place-img')
    imgEl.src = lastSearched.pic
    // Creates map from apis.js 
    initialize(lat, lon)
}

if (localStorage.getItem('last-search') === null) {
    document.getElementById('first-visit').classList.remove('invisible')
    document.getElementById('search-place-form').classList.add('first-visit')
} 
else {
    // If the local storage object exists write it to DOM
     let lastSearched = JSON.parse(localStorage.getItem('last-search'))
     writeLastSearch(lastSearched)
}


document.getElementById('search-place-form').addEventListener('submit', searchFormHandler)