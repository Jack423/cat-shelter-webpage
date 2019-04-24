var ui = new firebase.auth.AuthUI(firebase.auth());

ui.start('#firebaseui-auth-container', {
	signInOptions: [
		firebase.auth.EmailAuthProvider.PROVIDER_ID
	],
});