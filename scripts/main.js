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
                var title = doc.data().name;
                var details = doc.data().details;
                var hikeCode = doc.data().code;
                var hikeLength = doc.data().length;
                let newCard = cardTemplate.content.cloneNode(true);

                newCard.querySelector(".card-title").innerHTML = title;
                newCard.querySelector(".card-length").innerHTML = hikeLength + "km";
                newCard.querySelector(".card-text").innerHTML = details;
                newCard.querySelector(".card-image").src = `./images/${hikeCode}.jpg`;
            
                newCard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
                newCard.querySelector('.card-text').setAttribute("id", "ctext" + i);
                newCard.querySelector('.card-image').setAttribute("id", "cimage" + i);
            
                document.getElementById(collection + "-go-here").appendChild(newCard);

                i++;
            });
        });
}

displayCardsDynamically("hikes");