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
  console.log(id);
  let question = db.collection('questions').doc(id);
  let setQuestion = question.set({
      "id": id,
      "authorID": newQuestion["authorID"],
      "question": newQuestion["question"],
      "answer": newQuestion["answer"],
      "category": newQuestion["category"],
      "creationDate": newQuestion["creationDate"],
      "difficulty": newQuestion["difficulty"],
    });
  console.log("id: " + id);
  console.log("new question: " + newQuestion);

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
