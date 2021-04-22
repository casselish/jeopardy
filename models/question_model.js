var fs = require('fs');
var admin = require("firebase-admin");
var serviceAccount = require("../public/js/firebase-config.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Create a database reference
var db = admin.firestore();

exports.getAllQuestions = async function() {
  let allQuestions = {};

  try {
    let questions = await db.collection('questions').get();

    for (question of questions.docs) {
      allQuestions[question.id] = question.data();
    };

    return allQuestions;
  } catch (err) {
    console.log('Error getting documents', err);
  }
}

exports.getAllAPIs = function() {
  var apiData = fs.readFileSync('data/api.json', 'utf8');
//  console.log(questionData);
  return JSON.parse(apiData);
}

exports.getQuestion = async function(id) {
  try {
    let allQuestions = await exports.getAllQuestions();

    if (allQuestions[id]) {
      //console.log(id)
      return allQuestions[id];
    }
  } catch (err) {
    console.log(err)
  }
}

exports.saveQuestion = function(id, newQuestion) {
  //let allQuestions = await exports.getAllQuestions();
  let question = db.collection('questions').doc(id);
  let setQuestion = question.set({
      "id": id,
      "authorID": newQuestion["authorID"],
      "comments": newQuestion["comments"],
      "question": newQuestion["question"],
      "answer": newQuestion["answer"],
      "category": newQuestion["category"],
      "creationDate": newQuestion["creationDate"],
      "likes": newQuestion["likes"],
      "difficulty": newQuestion["difficulty"],
      "keywords": newQuestion["keywords"]
    });
  console.log("id: " + id);
  console.log("new question: " + newQuestion);

  //allQuestions[id] = newQuestion;
  //fs.writeFileSync('data/question.json', JSON.stringify(questionData));
}

exports.updateQuestion = function(id, questionData) {
  exports.saveQuestion(id, questionData)
}

exports.deleteQuestion = async function(id) {
  let allQuestions = await exports.getAllQuestions();
  db.collection('questions').doc(id).delete();
  //delete allQuestions[id];
  //fs.writeFileSync('data/question.json', JSON.stringify(questionData));
}
