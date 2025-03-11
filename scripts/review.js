var hikeDocID = localStorage.getItem("hikeDocID");

function getHikeName(id) {
    db.collection("hikes")
        .doc(id)
        .get()
        .then((thisHike) => {
            var hikeName = thisHike.data().name;
            document.getElementById("hikeName").innerHTML = hikeName;
        });
}

getHikeName(hikeDocID);

const stars = document.querySelectorAll(".star");

stars.forEach((star, index) => {
    star.addEventListener("click", () => {
        for (let i = 0; i <= index; i++) {
            document.getElementById(`star${i + 1}`).textContent = "star";
        }
        for (let i = stars.length - 1; i > index; i--) {
            document.getElementById(`star${i + 1}`).textContent = "star_outline";
        }
    });
});

function writeReview() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            let hikeTitle = document.getElementById("hikeName").innerHTML;
            let hikeLevel = document.getElementById("level").value;
            let hikeSeason = document.getElementById("season").value;
            let hikeDescription = document.getElementById("description").value;
            let hikeFlooded = document.querySelector("input[name='flooded']:checked").value;
            let hikeScrambled = document.querySelector("input[name='scrambled']:checked").value;

            let hikeRating = 0;

            stars.forEach((star) => {
                if (star.textContent == "star"){
                    hikeRating++;
                }
            });

            console.log(hikeTitle, hikeLevel, hikeSeason, hikeDescription, hikeFlooded, hikeScrambled);

            db.collection("reviews").add({
                title: hikeTitle,
                hikeDocID: hikeDocID,
                userID: user.uid,
                level: hikeLevel,
                season: hikeSeason,
                description: hikeDescription,
                flooded: hikeFlooded,
                scrambled: hikeScrambled,
                rating: hikeRating,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                window.location.href = "thanks.html";
            });
        } else {
            console.log("No user is signed in");
            window.location.href = "review.html";
        }

    });
}