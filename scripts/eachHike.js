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