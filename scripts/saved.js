const hikeCardGroup = document.getElementById("hikeCardGroup");

function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            insertNameFromFirestore(user);
            getBookmarks(user);
        } else {
            console.log("No user is signed in");
        }
    });
}
doAll();

function insertNameFromFirestore(user) {
    db.collection("users").doc(user.uid).get().then(userDoc => {
        console.log(userDoc.data().name);
        userName = userDoc.data().name;
        console.log(userName);
        document.getElementById("name-goes-here").innerHTML = userName;
    });
}

function getBookmarks(user) {
    db.collection("users").doc(user.uid).get()
        .then(userDoc => {
            var bookmarks = userDoc.data().bookmarks;
            console.log(bookmarks);

            let newCardTemplate = document.getElementById("savedCardTemplate");

            bookmarks.forEach(thisHikeID => {
                console.log(thisHikeID);
                db.collection("hikes").doc(thisHikeID).get().then(doc => {
                    let title = doc.data().name;
                    let hikeCode = doc.data().code;
                    let hikeLength = doc.data().length;
                    let docID = doc.id;

                    let newCard = newCardTemplate.content.cloneNode(true);

                    newCard.querySelector(".card-title").innerHTML = title;
                    newCard.querySelector(".card-length").innerHTML = hikeLength + "km";
                    newCard.querySelector(".card-image").src = `./images/${hikeCode}.jpg`;
                    newCard.querySelector("a").href = `eachHike.html?docID=${docID}`

                    newCard.querySelector(".card-length").innerHTML =
                        "Length: " + doc.data().length + " km<br>" +
                        "Duration: " + doc.data().hike_time + "min<br>" +
                        "Last updated: " + doc.data().last_updated.toDate().toLocaleDateString();
                    
                    hikeCardGroup.appendChild(newCard);

                });
            });
        });
}