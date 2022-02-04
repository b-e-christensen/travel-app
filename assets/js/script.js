
// This is for the google places autocomplete 
let autocomplete;
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
    let place = autocomplete.getPlace()
    if (!place.geometry) {
        document.getElementById('search-place').placeholder = 'Enter a place:'
    } else {
        console.log(place)
    }
    let lat = place.geometry.location.lat()
    let lon = place.geometry.location.lng()
    document.getElementById('place-img').src = place.photos[0].getUrl()
    initialize(lat, lon)
}

// https://developers.google.com/maps/documentation/javascript/places#place_search_requests init may and get nearby attractions
let map;
let service;
let infowindow;
function initialize(lat, lon) {
    let locationSearched = new google.maps.LatLng(lat, lon);

    map = new google.maps.Map(document.getElementById('map'), {
        center: locationSearched,
        zoom: 15
    });

    let request = {
        location: locationSearched,
        radius: '300',
        query: 'attraction'
    };

    service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            var place = results[i];
            createPhotoMarker(results[i]);
            // console.log(place)
        }
    }
}

function createPhotoMarker(place) {
    var photos = place.photos;
    if (!photos) {
        return;
    }

    var marker = new google.maps.Marker({
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
