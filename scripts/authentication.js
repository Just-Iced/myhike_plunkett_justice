var ui = new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to the developer to handdle
            return true;
        },
        uiShown: function () {
            // The widget is rendered
            // Hide the loader
            document.getElementById('loader').style.display = 'none';
        }
    },
    // Wil user popup for the IDP Providers sign in flow instead of the default, redirect
    signInFlow: 'popup',
    signInSuccessUrl: 'main.html',
    signInOptions: [
        // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        // firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        // firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>',
    // Pricacy policy url.
    privacyPolicyUrl: '<your-privacy-policy-url>'
};
ui.start('#firebaseui-auth-container', uiConfig);