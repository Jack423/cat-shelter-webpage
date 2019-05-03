'use strict';

// Required statement for Firebase API shit
var config = {
  apiKey: "AIzaSyDAbRSxaBe1BqxI9WO7pBeSivIlbaxmbJg",
  authDomain: "tbap-website.firebaseapp.com",
  databaseURL: "https://tbap-website.firebaseio.com",
  projectId: "tbap-website",
  storageBucket: "tbap-website.appspot.com",
  messagingSenderId: "435392249301"
};

// Use that thing we just made and use the initializeApp function to do the config
firebase.initializeApp(config);

// When a user is logged in, run this function
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in
    // Display content for logged in user
    document.getElementById("user_div").style.display = "block";
    document.getElementById("login_div").style.display = "none";

    var user = firebase.auth().currentUser;

    if(user != null){
      var email_id = user.email;
    }

  } else {
    // No user is signed in.
    document.getElementById("user_div").style.display = "none";
    document.getElementById("login_div").style.display = "block";
  }
});

/*
When a user clicks the login button, this function is called and grabs the
email and password and uses the Firebase API to check if the user's password
is actually correct.

You cannot register an account here due to security measures. So new accounts
can only be created in the Firebase developer console.
*/
function login(){
  // Get the value out of the email field
  var userEmail = document.getElementById("email_field").value;
  // Get the value out of the password field
  var userPass = document.getElementById("password_field").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    // Handle Errors
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);
  });

}

// When the user clicks the logout button, then logout function is called
function logout(){
  firebase.auth().signOut();
}

/*
This function grabs the data from the elements in the form, stores their data
in variables, then calls the firebase firestore function to send the data to
the database.

The function also uploads the cat images to the Firebase storage and assigns a
URL to each image so it can be accessed that way vs having the image stored
locally.
*/
function addCat() {
	var firestore = firebase.firestore(); // Create firestore reference
  // Grab the values of the UI elements
	var catImage = document.querySelector('#cat-image').files[0];
	var name = document.getElementById('name');
	var gender = document.getElementById('gender');
	var breed = document.getElementById('breed');
	var age = document.getElementById('age');
	var description = document.getElementById('description');

	var storageBucket = firebase.storage().ref(name.value); //Create a firebase storage reference

	var uploadTask = storageBucket.put(catImage);
	// Register three observers:
	// 1. 'state_changed' observer, called any time the state changes
	// 2. Error observer, called on failure
	// 3. Completion observer, called on successful completion
	uploadTask.on('state_changed', function(snapshot){
	  // Observe state change events such as progress, pause, and resume
	  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
	  var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
	  console.log('Upload is ' + progress + '% done');
	  switch (snapshot.state) {
	    case firebase.storage.TaskState.PAUSED: // or 'paused'
	      console.log('Upload is paused');
	      break;
	    case firebase.storage.TaskState.RUNNING: // or 'running'
	      console.log('Upload is running');
	      break;
	  }
	}, function(error) {
	  // Handle unsuccessful uploads
	}, function() {
	  // Handle successful uploads on complete
	  uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
			console.log(downloadURL);
      // Add the data to the cats colleciton
			firestore.collection("cats").add({
				name: name.value,
				gender: gender.value,
				breed: breed.value,
				age: age.value,
				description: description.value,
				photoUrl: downloadURL
			})
			.then(function(docRef) {
				console.log("Document is written with ID: ", docRef.id);
			})
			.catch(function(error) {
				console.error("Error adding document: ", docRef);
			});

      // This makes the snackbar show up when the cat has been created
			// Get the snackbar DIV
			var x = document.getElementById("snackbar")
			// Add the "show" class to DIV
			x.className = "show";
			// After 3 seconds, remove the show class from DIV
			setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);

			// Clear values in the text boxes
			name.value = "";
			gender.value = "";
			breed.value = "";
			age.value = "";
			description.value = "";
			catImage.files[0] = null; //This doesn't fucking work but what ever
	  });
	});
}
