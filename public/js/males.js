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

// Create a DOM reference
const cardContainer = document.querySelector('.card-container');

// Assign values from doc object to UI elements
function renderCatElement(doc) {
  let div = document.createElement('div');
  let name = document.createElement('h6');
  let gender = document.createElement('p');
  let age = document.createElement('p');
  let photo = document.createElement('img');

  div.setAttribute('data-id', doc.id);
  name.textContent = doc.data().name;
  gender.textContent = doc.data().gender;
  photo.src = doc.data().photoUrl;

  // Add elements as a child to the div variable
  div.appendChild(photo);
  div.appendChild(name);
  div.appendChild(gender);
  div.appendChild(age);

  // Add the div variable as a child to the card container element
  cardContainer.appendChild(div);
}

// Start getting the cats from the database
function startDatabaseQueries() {
	var ref = firebase.firestore(); // Create a firestore reference

    // Get child objects of cats where the cats gender is male
    ref.collection('cats').where('gender', '==', 'Male')
      .get()
      .then((snapshot) => {
      snapshot.docs.forEach(doc => { // For every object retrieved, renderCatElement
        renderCatElement(doc);
      })
    })
}

// When the page loads, this function is called
window.addEventListener('load', function() {
  startDatabaseQueries();
}, false);
