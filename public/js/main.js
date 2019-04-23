firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    //User is signed in
    document.getElementById("user-div").style.display = "block";
    document.getElementById("login-div").style.display = "none";
  } else {
    //User is not signed in
    document.getElementById("user-div").style.display = "none";
    document.getElementById("login-div").style.display = "block";
  }
});

function login() {
  var userEmail = document.getElementById("email-field").value;
  var userPass = document.getElementById("password-field").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  });
}
