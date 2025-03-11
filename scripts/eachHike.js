function displayHikeInfo() {
    let params = new URL(window.location.href);
    let ID = params.searchParams.get("docID");
    console.log(ID);

    db.collection("hikes")
        .doc(ID)
        .get()
        .then(doc => {
            thisHike = doc.data();
            hikeCode = thisHike.code;
            hikeName = doc.data().name;

            document.getElementById("hikeName").innerHTML = hikeName;
            let imgEvent = document.querySelector(".hike-img");
            imgEvent.src = `../images/${hikeCode}.jpg`
        });
}
displayHikeInfo();

function saveHikeDocumentIDAndRedirect() {
    let params = new URL(window.location.href);
    let ID = params.searchParams.get("docID");
    localStorage.setItem("hikeDocID", ID);
    window.location.href = "review.html";
}

function populateReviews() {
    console.log("test");
    let hikeCardTemplate = document.getElementById("reviewCardTemplate");
    let hikeCardGroup = document.getElementById("reviewCardGroup");

    let params = new URL(window.location.href); // Get the URL from the search bar
    let hikeID = params.searchParams.get("docID");

    // Double-check: is your collection called "Reviews" or "reviews"?
    db.collection("reviews")
        .where("hikeDocID", "==", hikeID)
        .get()
        .then((allReviews) => {
            reviews = allReviews.docs;
            console.log(reviews);
            reviews.forEach((doc) => {
                var title = doc.data().title;
                var level = doc.data().level;
                var season = doc.data().season;
                var description = doc.data().description;
                var flooded = doc.data().flooded;
                switch (flooded) {
                    case "Yes":
                        flooded = "<span class='material-symbols-outlined' style='color:#00db25;'>check</span>";
                        break;
                    case "No":
                        flooded = "<span class='material-symbols-outlined' style='color:#ff0000;'>close</span>";
                        break;
                    default:
                        flooded = "<span class='material-symbols-outlined' style='color:#c5c900;'>question_mark</span>";
                }
                var scrambled = doc.data().scrambled;
                switch (scrambled) {
                    case "Yes":
                        scrambled = "<span class='material-symbols-outlined' style='color:#00db25;'>check</span>";
                        break;
                    case "No":
                        scrambled = "<span class='material-symbols-outlined' style='color:#ff0000;'>close</span>";
                        break;
                    default:
                        scrambled = "<span class='material-symbols-outlined' style='color:#c5c900;'>question_mark</span>";
                        break;
                }
                var time = doc.data().timestamp.toDate();
                var rating = doc.data().rating; // Get the rating value
                console.log(rating)

                console.log(time);

                let reviewCard = hikeCardTemplate.content.cloneNode(true);
                reviewCard.querySelector(".hikeTitle").innerHTML = title;
                reviewCard.querySelector(".time").innerHTML = new Date(
                    time
                ).toLocaleString();
                reviewCard.querySelector(".level").innerHTML = `Level: ${level}`;
                reviewCard.querySelector(".season").innerHTML = `Season: ${season}`;
                reviewCard.querySelector(".scrambled").innerHTML = `Scrambled: ${scrambled}`;
                reviewCard.querySelector(".flooded").innerHTML = `Flooded: ${flooded}`;
                reviewCard.querySelector(".description").innerHTML = `Description: ${description}`;

                colour = "";
                switch (rating) {
                    case 5:
                        colour = "#76ad0f";
                        break;
                    case 4:
                        colour = "#9dad0f";
                        break;
                    case 3:
                        colour = "#ccad00";
                        break;
                    case 2:
                        colour = "#cc7400";
                        break;
                    default:
                        colour = "#aa4b25";
                        break;
                }
                reviewCard.querySelector(".card").style = `background-color: ${colour};`
                let starRating = "";
                // This loop runs from i=0 to i<rating, where 'rating' is a variable holding the rating value.
                for (let i = 0; i < rating; i++) {
                    starRating += '<span class="material-icons">star</span>';
                }
                // After the first loop, this second loop runs from i=rating to i<5.
                for (let i = rating; i < 5; i++) {
                    starRating += '<span class="material-icons">star_outline</span>';
                }
                reviewCard.querySelector(".star-rating").innerHTML = starRating;

                hikeCardGroup.appendChild(reviewCard);
            });
        });
}

populateReviews();