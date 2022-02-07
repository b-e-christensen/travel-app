// Init global vars for Google API
let map;
let service;
let infowindow;
let autocomplete;
let attractionsAry = []
let attractionIndex = 0

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
    document.querySelector('body').setAttribute('style', 'animation: none')
    let place = autocomplete.getPlace()
    // If invalid place
    if (!place.geometry) {
        document.getElementById('search-place').placeholder = 'Enter a place:'
        return
    }
    // Format and add search to Localstorage 
    let lastSrc = place
    lastSrc.pic = place.photos[0].getUrl()
    localStorage.setItem('last-search', JSON.stringify(lastSrc))
    // Show Divs and hide first visit 
    document.getElementById('first-visit').classList.add('invisible')
    document.getElementById('search-place-form').classList.remove('first-visit')
    // writes image to DOM from search API
    let imgEl = document.getElementById('place-img')
    imgEl.src = place.photos[0].getUrl()
    // Get lat and lng send to map init 
    let lat = place.geometry.location.lat()
    let lon = place.geometry.location.lng()
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
    let wikiResp = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=10&exlimit=1&titles=${encName}&explaintext=1&formatversion=2&format=json&origin=*`).then(response => { return response.json() })
    if (wikiResp.query.pages[0].extract) {
        let text = wikiResp.query.pages[0].extract
        return text
    } else {
        return false
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
    // Creates an array of attractions for later use 
    attractionsAry.push(attractionObj)
    // Calls func to write attractions to DOM
    writeAtrractions(attractionObj)

    let marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        title: place.name,
        icon: photos[0].getUrl({ maxWidth: 35, maxHeight: 35 })
    });
}
//  Function to set a marker UNTESTED
function setMarker(lati, long) {
    const myLatLng = { lat: lati, lng: long };
    new google.maps.Marker({
        position: myLatLng,
        map,
        title: "Hello World!",
    });
    marker.setMap(map);
}

// Function to write attraction props to DOM 
function writeAtrProps(attraction) {
    document.getElementById('place-img').src = attraction.photo
    if (!attraction.text) {
        let aTag = document.createElement('a')
        aTag.setAttribute('href', '#')
        aTag.textContent = 'click here.'
        document.getElementById("place-descr").textContent = `Details for ${attraction.name} were not found. To learn more about it `
        aTag.addEventListener('click', wikiIFrame)
        document.getElementById("place-descr").appendChild(aTag)
        function wikiIFrame() {
            let frame = document.createElement('iframe')
            frame.setAttribute('src', 'https://en.wikipedia.org/wiki/' + attraction.name)
            frame.id = 'wiki-frame'
            document.getElementById('frame-closer').classList.remove('invisible')
            document.querySelector('main').classList.add('blur')
            document.querySelector("body").appendChild(frame)
        }
    } else {
        document.getElementById('place-descr').textContent = attraction.text
    }
}

// Function handling clicks of populated attractions 
function attractionsSelected(event) {
    // TO DO
    console.log(attractionsAry);
    const btnClicked = event.target
    let attraction = attractionsAry[btnClicked.getAttribute('data-index')]
    // Adds the last clicked attraction to localStorage
    localStorage.setItem('attrHistory', JSON.stringify(attraction))
    // as of right now this populates the background image. Thinking of adding a function that'll allow you to click the body and have the background image overlap the content of the page. 
    writeAtrProps(attraction)
}


// Function to write attractions to DOM
function writeAtrractions(attractionObj) {
    // Create Div and Button to add to DOM
    let itemEL = document.createElement('div')
    let itemBtn = document.createElement('button')
    itemBtn.textContent = attractionObj.name
    itemEL.appendChild(itemBtn)
    itemBtn.classList.add('attractions-btns')
    itemBtn.setAttribute('data-index', attractionIndex)
    attractionIndex++
    document.getElementById('search-results').appendChild(itemEL)
    itemBtn.addEventListener('click', attractionsSelected)
}

function removeFrame() {
    document.querySelector('body').removeChild(document.getElementById('wiki-frame'))
    document.getElementById('frame-closer').classList.add('invisible')
    document.querySelector('main').classList.remove('blur')
}
