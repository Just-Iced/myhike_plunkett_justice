function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        // Checks if a user is signed in
        if (user) {
            // Do something for the currently logged-in user here
            console.log(user.uid);
            console.log(user.displayName)
            userName = user.displayName;

            $('#name-goes-here').text(userName);
        } else {
            // No user is signed in
            console.log("No user is signed in.");
        }
    });
}
getNameFromAuth();

function readQuote(day) {
    db.collection("quotes").doc(day)
        .onSnapshot(dayDoc => {
            console.log("Current doc data: " + dayDoc.data());
            document.getElementById("quote-goes-here").innerHTML = dayDoc.data().quote;
        }, (error) => {
            console.log("Error callin onSnapshot", error);
        });
}
readQuote("tuesday");