var currentUser;
function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid);
            currentUser.get()
                .then(userDoc => {
                    let userName = userDoc.data().name;
                    let userSchool = userDoc.data().school;
                    let userCity = userDoc.data().city;

                    if (userName != null) {
                        document.getElementById("nameInput").value = userName;
                    }
                    if (userSchool != null) {
                        document.getElementById("schoolInput").value = userSchool;
                    }
                    if (userCity != null) {
                        document.getElementById("cityInput").value = userCity;
                    }
                });
        } else {
            console.log("No user is signed in");
        }
    });
}
populateUserInfo();

function editUserInfo() {
    document.getElementById("personalInfoFields").disabled = false;
}

function saveUserInfo() {
    let userName = document.getElementById("nameInput").value;
    let userSchool = document.getElementById("schoolInput").value;
    let userCity = document.getElementById("cityInput").value;

    currentUser.set({
        name: userName,
        school: userSchool,
        city: userCity
    });

    document.getElementById("personalInfoFields").disabled = true;
}
