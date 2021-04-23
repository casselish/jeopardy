var admin = require("firebase-admin");
var fs = require('fs');

var serviceAccount = require("./firebase-config.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Create a database reference
var db = admin.firestore();

var questionData = JSON.parse(fs.readFileSync('../../data/question.json', 'utf8'));
var userData = JSON.parse(fs.readFileSync('../../data/user.json', 'utf8'));
//console.log(questionData);

var questionDataIDs = Object.keys(questionData);
var userDataIDs = Object.keys(userData);
//console.log(questionDataIDs);

var categories = [];
var questionsByCategory = {};

questionDataIDs.forEach(function (currentValue, index) {
  if (!categories.includes(questionData[currentValue]["category"])) {
    categories.push(questionData[currentValue]["category"]);
  }
  if (currentValue != "" && questionData[currentValue]["category"] != "" && questionData[currentValue]["question"] != "") {
    let question = db.collection('questions').doc(currentValue);
    let setQuestion = question.set({
        "id": currentValue,
        "authorID": questionData[currentValue]["authorID"],
        "question": questionData[currentValue]["question"],
        "answer": questionData[currentValue]["answer"],
        "category": questionData[currentValue]["category"],
        "creationDate": questionData[currentValue]["creationDate"],

        "difficulty": questionData[currentValue]["difficulty"],

      });
  }
});

userDataIDs.forEach(function (currentValue, index) {
  if (currentValue != "") {
    let user = db.collection('users').doc(currentValue);
    let setUser = user.set({
      "id": currentValue,
      "username": userData[currentValue]["username"],
      "name": userData[currentValue]["name"],
      "email": userData[currentValue]["email"],
      "logins": userData[currentValue]["logins"]
    });
  }
});



db.collection('questions').get()
  .then(function(snapshot){
    snapshot.forEach(function(doc){
      console.log(doc.id, '=>', doc.data());
    });
  })
  .catch(function(err){
    console.log('Error getting documents', err);
  });

  db.collection('users').get()
    .then(function(snapshot){
      snapshot.forEach(function(doc){
        console.log(doc.id, '=>', doc.data());
      });
    })
    .catch(function(err){
      console.log('Error getting documents', err);
    });
