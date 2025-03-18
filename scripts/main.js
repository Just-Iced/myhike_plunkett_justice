var currentUser;

function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid);
            console.log(currentUser);

            const weekday = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
            const d = new Date();
            let day = weekday[d.getDay()];

            readQuote(day);
            insertNameFromFirestore();
            displayCardsDynamically("hikes");
        } else {
            console.log("No users is signed in");
            window.location.href = "login.html";
        }
    });
}

doAll();

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

function insertNameFromFirestore() {
    currentUser.get().then((userDoc) => {
        var userName = userDoc.data().name;
        console.log(userName);
        $("#name-goes-here").text(userName);
    });
}

function readQuote(day) {
    db.collection("quotes").doc(day)
        .onSnapshot(dayDoc => {
            console.log("Current doc data: " + dayDoc.data());
            document.getElementById("quote-goes-here").innerHTML = dayDoc.data().quote;
        }, (error) => {
            console.log("Error callin onSnapshot", error);
        });
}
//readQuote("tuesday");

function writeHikes() {
    var hikeRefs = db.collection("hikes");
    hikeRefs.add({
        code: "BBY01",
        name: "Bunraby Mountain Park Trail",
        city: "Burnaby",
        province: "BC",
        level: "medium",
        details: "A nice trail by a park",
        length: 10,
        hike_time: 75,
        lat: 49.246445,
        lon: -122.994560,
        last_updated: firebase.firestore.FieldValue.serverTimestamp()
    });
    hikeRefs.add({
        code: "CWK01",
        name: "Teapot Hill Trailhead",
        city: "Chilliwack",
        province: "BC",
        level: "medium",
        details: "A trail with a steep incline",
        length: 15,
        hike_time: 65,
        lat: 49.042288,
        lon: -121.984937,
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("March 4, 2023"))
    });
    hikeRefs.add({
        code: "NV01",
        name: "Mount Seymour Trail",
        city: "North Vancouver",
        province: "BC",
        level: "hard",
        details: "Amazing ski slope views",
        length: 8.2,
        hike_time: 120,
        lat: 49.38847101455571,
        lon: -122.94092543551031,
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("January 1, 2023"))
    });
}

function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("hikeCardTemplate");

    db.collection(collection).get()
        .then(allHikes => {
            var i = 1;
            allHikes.forEach(doc => {
                let title = doc.data().name;
                let details = doc.data().details;
                let hikeCode = doc.data().code;
                let hikeLength = doc.data().length;
                let docID = doc.id;
                let newCard = cardTemplate.content.cloneNode(true);

                newCard.querySelector(".card-title").innerHTML = title;
                newCard.querySelector(".card-length").innerHTML = "Length: " + hikeLength + "km<br>"
                                                                + "Duration: " + doc.data().hike_time + "min<br>"
                                                                + "Last updated: " + doc.data().last_updated.toDate().toLocaleDateString();
                newCard.querySelector(".card-text").innerHTML = details;
                newCard.querySelector(".card-image").src = `./images/${hikeCode}.jpg`;
                newCard.querySelector("a").href = `eachHike.html?docID=${docID}`
            
                newCard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
                newCard.querySelector('.card-text').setAttribute("id", "ctext" + i);
                newCard.querySelector('.card-image').setAttribute("id", "cimage" + i);
                newCard.querySelector("i").id = "save-" + docID;
                newCard.querySelector("i").onclick = () => saveBookmark(docID);

                currentUser.get().then(userDoc => {
                    let bookmarks = userDoc.data().bookmarks;
                    if (bookmarks.includes(docID)) {
                       document.getElementById('save-' + docID).innerText = 'bookmark';
                    }
              })

                document.getElementById(collection + "-go-here").appendChild(newCard);

                i++;
            });
        });
}

displayCardsDynamically("hikes");

function saveBookmark(hikeDocID) {
    currentUser.get().then((userDoc) => {
        if (userDoc.data().bookmarks.includes(hikeDocID)) {
            currentUser.update({
                bookmarks: firebase.firestore.FieldValue.arrayRemove(hikeDocID)
            })
            .then(() => {
                console.log("Bookmark has been removed for " + hikeDocID);
                let iconID = "save-" + hikeDocID;
        
                document.getElementById(iconID).innerText = "bookmark_border";
            });
        } else {
            currentUser.update({
                bookmarks: firebase.firestore.FieldValue.arrayUnion(hikeDocID)
            })
            .then(() => {
                console.log("Bookmark has been saved for " + hikeDocID);
                let iconID = "save-" + hikeDocID;
        
                document.getElementById(iconID).innerText = "bookmark";
            });
        }
            
    })
    
}