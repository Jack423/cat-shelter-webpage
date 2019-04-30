'use strict';

var config = {
  apiKey: "AIzaSyDAbRSxaBe1BqxI9WO7pBeSivIlbaxmbJg",
  authDomain: "tbap-website.firebaseapp.com",
  databaseURL: "https://tbap-website.firebaseio.com",
  projectId: "tbap-website",
  storageBucket: "tbap-website.appspot.com",
  messagingSenderId: "435392249301"
};

firebase.initializeApp(config);

const cardContainer = document.querySelector('.card-container');

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

  div.appendChild(photo);
  div.appendChild(name);
  div.appendChild(gender);
  div.appendChild(age);

  cardContainer.appendChild(div);
}

function startDatabaseQueries() {
	var ref = firebase.firestore();

    ref.collection('cats').where('gender', '==', 'Male')
      .get()
      .then((snapshot) => {
      snapshot.docs.forEach(doc => {
        renderCatElement(doc);
      })
    })
}

window.addEventListener('load', function() {
  startDatabaseQueries();
}, false);
