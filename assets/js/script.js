
// This is for the google places autocomplete 
let autocomplete;
function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('search-place'), 
        {
        types: ['geocode'],
        fields: ['place_id', 'geometry', 'name']
        })
}

// Function to handle the search form submit
function searchFormHandler(event) {
    event.preventDefault()
    let place = autocomplete.getPlace()
    if(!place.geometry) {
        document.getElementById('search-place').placeholder = 'Enter a place:'
    } else {
        console.log(place)
        /* This is the Object place 
{
    "geometry": {
        "location": {
            "lat": 39.7392358,
            "lng": -104.990251
        },
        "viewport": {
            "south": 39.61443097092009,
            "west": -105.1099269730715,
            "north": 39.91424694425041,
            "east": -104.6002959250625
        }
    },
    "name": "Denver",
    "place_id": "ChIJzxcfI6qAa4cR1jaKJ_j0jhE",
    "html_attributions": []
}
*/
    }
}

// Event Listener for search form
document.getElementById('search-place-form').addEventListener('submit', searchFormHandler)
