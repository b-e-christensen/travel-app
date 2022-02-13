function initFormHandler(event) {
    event.preventDefault()
    let place = autocomplete.getPlace()
    // If invalid place
    if (!place || !place.geometry) {
        document.getElementById('search-place').placeholder = 'Enter a place:'
        return
    }
    // Format and add search to Localstoarage 
    let lastSrc = place
    lastSrc.pic = place.photos[0].getUrl()
    localStorage.setItem('last-search', JSON.stringify(lastSrc))
    checkforRedirect()
}
// Will redirect to main page if search has been performed 
function checkforRedirect() {
    if (localStorage.getItem('last-search') || localStorage.attrHistory) {
        window.location.replace('../index.html')
    }
}
checkforRedirect()

// Adds event listen for search submit 
document.getElementById('first-visit-search-form').addEventListener('submit', initFormHandler)
