var fs = require('fs');

exports.getAllQuestions = function() {
  var questionData = fs.readFileSync('data/question.json', 'utf8');
//  console.log(questionData);
  return JSON.parse(questionData);
}

exports.getAllAPIs = function() {
  var apiData = fs.readFileSync('data/api.json', 'utf8');
//  console.log(questionData);
  return JSON.parse(apiData);
}

exports.getQuestion = function(id) {
  var questionData = exports.getAllQuestions();

  if (questionData[id]) return questionData[id];

  return {};
}

exports.saveQuestion = function(id, newQuestion) {
  var questionData = exports.getAllQuestions();
  questionData[id] = newQuestion;
  fs.writeFileSync('data/question.json', JSON.stringify(questionData));
}

exports.updateQuestion = function(id, questionData) {
  exports.saveQuestion(id, questionData)
}

exports.deleteQuestion = function(id) {
  var questionData = exports.getAllQuestions();
  delete questionData[id];
  fs.writeFileSync('data/question.json', JSON.stringify(questionData));
}
