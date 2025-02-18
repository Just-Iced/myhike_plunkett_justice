// -------------------------------------------------------
// Call this function when the "logout" button is clicked
// -------------------------------------------------------
function logout() {
    firebase.auth().signOut().then(() => {
        console.log("Logging out user");
    }).catch((error) => {
        // An error happened
    });
}