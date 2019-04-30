'use strict';

var config = {
  apiKey: "AIzaSyDAbRSxaBe1BqxI9WO7pBeSivIlbaxmbJg",
  authDomain: "tbap-website.firebaseapp.com",
  databaseURL: "https://tbap-website.firebaseio.com",
  projectId: "tbap-website",
  storageBucket: "tbap-website.appspot.com",
  messagingSenderId: "435392249301"
};

const testButton = document.getElementById('test');

firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.

    document.getElementById("user_div").style.display = "block";
    document.getElementById("login_div").style.display = "none";

    var user = firebase.auth().currentUser;

    if(user != null){

      var email_id = user.email;
      //document.getElementById("user_para").innerHTML = "Welcome User : " + email_id;
    }

  } else {
    // No user is signed in.
    document.getElementById("user_div").style.display = "none";
    document.getElementById("login_div").style.display = "block";
  }
});

function login(){
  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);
  });

}

function logout(){
  firebase.auth().signOut();
}

function addCat() {
	var firestore = firebase.firestore();
	var photoUrl = "";
	var catImage = document.querySelector('#cat-image').files[0];
	var name = document.getElementById('name');
	var gender = document.getElementById('gender');
	var breed = document.getElementById('breed');
	var age = document.getElementById('age');
	var description = document.getElementById('description');

	var storageBucket = firebase.storage().ref(name.value);

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
			catImage.files[0] = null;
	  });
	});
}

function createCatElement(catId, name, gender, age, photoUrl) {
	var uid = firebase.auth().currentUser.uid;
	var html =
		'<div class="card">' +
			'<img id="photo" src="">' +
			'<h6 id="name"></h6>' +
			'<p id="gender"></p>' +
			'<p id="age"></p>' +
		'</div>';

	// Create DOM element from the HTML
	var div = document.createElement('div');
	div.innerHTML = html;
	var catElement = div.firstChild;

	catElement.getElementById('name')[0].innerText = name;
	catElement.getElementById('gender')[0].innerText = gender;
	catElement.getElementById('age')[0].innerText = age;
	catElement.getElementById('photo')[0].style.backgroundImage = 'url("' +
      (photoUrl || './silhouette.jpg') + '")';

	return catElement;
}

function startDatabaseQueriesMales() {
	var ref = firebase.firestore();

	ref.collection("cats").where("gender", "==", "Male")
		.get()
		.then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
				var containerElement = sectionElement.getElementsByClassName('card-container')[0];
				containerElement.insertBefore(
					createCatElement(doc.key, doc.val().name, doc.val().gender, data.val().age, data.val().photoUrl),
					containerElement.firstChild);
			});
		})
		.catch(function(error) {
			console.log("Error getting some documents: ", error);
		});
}

function startDatabaseQueriesFemales() {
	var ref = firebase.firestore();

	ref.collection("cats").where("gender", "==", "Female")
		.get()
		.then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
				createCatElement(doc.key, doc.val().name, doc.val().gender, data.val().age, data.val().photoUrl);
			})
		})
		.catch(function(error) {
			console.log("Error getting some documents: ", error);
		});
}

function startDatabaseQueriesAdults() {
	var ref = firebase.firestore();

	ref.collection("cats").where("age", ">=", 2)
		.get()
		.then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
				createCatElement(doc.key, doc.val().name, doc.val().gender, data.val().age, data.val().photoUrl);
			})
		})
		.catch(function(error) {
			console.log("Error getting some documents: ", error);
		});
}

function startDatabaseQueriesKittens() {
	var ref = firebase.firestore();

	ref.collection("cats").where("age", "<=", 1)
		.get()
		.then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
				createCatElement(doc.key, doc.val().name, doc.val().gender, data.val().age, data.val().photoUrl);
			})
		})
		.catch(function(error) {
			console.log("Error getting some documents: ", error);
		});
}
