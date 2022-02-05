if(localStorage.getItem('last-search') === null) {
    document.getElementById('first-visit').classList.remove('invisible')
    document.getElementById('search-place-form').classList.add('first-visit')
}

// Init global vars for Google API
let map;
let service;
let infowindow;
let autocomplete;
let attractionsAry = []

// This is for the google places autocomplete 
function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('search-place'),
        {
            types: ['geocode'],
            fields: ['place_id', 'geometry', 'name', 'photo']
        })
}

// Function to handle the search form submit
function searchFormHandler(event) {
    event.preventDefault()
    attractionsAry = []
    let place = autocomplete.getPlace()
    // If invalid place
    if (!place.geometry) {
        document.getElementById('search-place').placeholder = 'Enter a place:'
        return
    } 
    localStorage.setItem('last-search', JSON.stringify(place))
    document.getElementById('first-visit').classList.add('invisible')
    document.getElementById('search-place-form').classList.remove('first-visit')
    let lat = place.geometry.location.lat()
    let lon = place.geometry.location.lng()
    document.getElementById('place-img').src = place.photos[0].getUrl()
    initialize(lat, lon)
}

// https://developers.google.com/maps/documentation/javascript/places#place_search_requests init may and get nearby attractions
// Inits the map
function initialize(lat, lon) {
    let locationSearched = new google.maps.LatLng(lat, lon);
    //Centers map to location searched
    map = new google.maps.Map(document.getElementById('map'), {
        center: locationSearched,
        zoom: 15
    });
    // Below request for Places API search
    let request = {
        location: locationSearched,
        radius: '300',
        query: 'historical attraction' // tourist attraction
    };
    // Calls places API
    service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);
}

// Call back to go through attractions and add map placers as images
function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (let i = 0; i < results.length; i++ && i < 20) {
            let place = results[i];
            createPhotoMarker(results[i]);
        }
    }
}

// Function to get Wikipedia API details
async function wikiAPIcall(placeName) {
    let encName = encodeURIComponent(placeName)
    let wikiResp = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=10&exlimit=1&titles=${encName}&explaintext=1&formatversion=2&format=json&origin=*`).then(response => {return response.json()})
    if(wikiResp.query.pages[0].extract){
        let text = wikiResp.query.pages[0].extract
        return text
    } else {
        let frame = document.createElement('iframe')
        frame.setAttribute('src', `https://en.wikipedia.org/wiki/${placeName}`)
        frame.id = 'wiki-frame'
        document.getElementById("descr-div").appendChild(frame)
    }
}

// function to create map markers with photos
async function createPhotoMarker(place) {
    let photos = await place.photos;
    if (!photos) {
        return;
    }

    let textDetails = await wikiAPIcall(place.name)
    // Creates a attraction object to push to array
    let attractionObj = {
        name: place.name,
        text: textDetails, 
        photo: place.photos[0].getUrl(),
        geotag: place.geometry.location
    }

    attractionsAry.push(attractionObj)
    console.log(attractionsAry)

    let marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        title: place.name,
        icon: photos[0].getUrl({ maxWidth: 35, maxHeight: 35 })
    });
}
//  Function to set a marker UNTESTED
function setMarker(lati,long) {
    const myLatLng = { lat: lati, lng: long };
    new google.maps.Marker({
        position: myLatLng,
        map,
        title: "Hello World!",
      });
      marker.setMap(map);
}

// Event Listener for search form
document.getElementById('search-place-form').addEventListener('submit', searchFormHandler)

