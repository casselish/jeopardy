let express = require('express')
  , router = express.Router();
let request = require('request');

let Question = require('../models/question_model')

let apikey = 'f09c17eb';

router.get('/', function(req, res){
  res.redirect('/questions');
});

router.get('/questions', async function(req, res){
  let questionList = await Question.getAllQuestions();
  //console.log("questionList: " + questionList);

  res.status(200);
  res.setHeader('Content-Type', 'text/html');
  res.render('question/show_questions.ejs', {questions: questionList});
});

router.get('/question/create', function(req, res){

  request("http://jservice.io/api/clues?question=h", function(err, response, body) {
      if(!err){
        let questionResponse = JSON.parse(body);
        let responseArray = Object.keys(questionResponse);
        let newQuestion = Math.floor(Math.random() * responseArray.length-1);
        res.status(200);
        res.setHeader('Content-Type', 'text/html');
        res.render('question/new_question.ejs', {question: questionResponse[newQuestion]})
      }
      else{
        res.redirect('/questions');
      }
    });
});

router.get('/question/:id', async function(req, res) {
  //console.log("something is working");
  let questionList = await Question.getAllQuestions();
  let questionTitles = Object.keys(questionList);
  let id = req.params.id;
  //console.log(id);

  if (questionTitles.includes(id)) {
      res.status(200);
      //console.log(questionList[id]);
      res.setHeader('Content-Type', 'text/html')
      res.render("question/question_details.ejs",{
        questions: questionList[id],
      });
    }else{
      let errorCode=404;
      res.status(errorCode);
      res.setHeader('Content-Type', 'text/html');
      res.render("error.ejs", {"errorCode":errorCode});
    }
});


router.post('/question/:apiID', function(req, res){

  let apiID = req.params.apiID;
  console.log("question at controller: " + req.body.question);

  let newQuestion={
    "id": apiID,
    "authorID": 0000,
    "question": req.body.question,
    "answer": req.body.answer,
    "category": req.body.category,
    "creationDate": "March 16, 2021",
    "difficulty": req.body.value,
  }
  Question.saveQuestion(apiID, newQuestion);
  res.redirect('/questions');
});

router.get('/question/:id/edit', async function(req,res){
  let thisQuestion = await Question.getQuestion(req.params.id);
  thisQuestion.id=req.params.id;

  if(thisQuestion){
    res.status(200);
    res.setHeader('Content-Type', 'text/html');
    res.render("question/edit_question.ejs", {questions: thisQuestion} );
  }
  else{
    let errorCode=404;
    res.status(errorCode);
    res.setHeader('Content-Type', 'text/html');
    res.render("error.ejs", {"errorCode":errorCode});
  }
});

router.put('/question/:id', function(req,res){
  console.log("here");
  let newQuestionData = {};
  console.log(req.body.id);
  let id= req.body.id;
  newQuestionData["id"] = id;
  newQuestionData["authorID"] = req.body.authorID;
  newQuestionData["question"]= req.body.question;
  newQuestionData["answer"]= req.body.answer;
  newQuestionData["category"]= req.body.category;
  newQuestionData["creationDate"]= req.body.creationDate;
  newQuestionData["difficulty"] = req.body.difficulty;

  Question.updateQuestion(id, newQuestionData);
  res.redirect('/questions');
});

// router.post('/question/likes/:id', async function(req, res) {
//   let questionList = await Question.getAllQuestions();
//   let thisQuestion = Question.getQuestion(req.params.id);
//   thisQuestion.id=req.params.id;
//
//   if(questionList[thisQuestion.id]){
//   res.status(200);
//   res.setHeader('Content-Type', 'text/json');
//   res.send(thisQuestion);
//   }else{
//     res.status(404);
//     res.setHeader('Content-Type', 'text/json');
//     res.send('{results: "no comment"}');
//   }
//
// });

// router.post('/question/comments/:id', async function(req, res) {
//   let questionList = await Question.getAllQuestions();
//   let thisQuestion = Question.getQuestion(req.params.id);
//   thisQuestion.id=req.params.id;
//
//   //console.log(thisQuestion);
//
//   if(questionList[thisQuestion.id]){
//     console.log("contains");
//     var newComment = {
//       "id": req.body.cid,
//       "authorID": 12345,
//       "questionPostID": req.body.questionPostID,
//       "text": req.body.text,
//       "likes": [],
//       "creationDate": "March 16, 2021"
//     };
//   questionList[req.params.id]["comments"].push(newComment);
//   let newQuestionData = questionList[req.params.id];
//   //console.log(newQuestionData);
//   Question.updateQuestion(req.params.id, newQuestionData);
//
//     res.status(200);
//     res.setHeader('Content-Type', 'text/json');
//     res.send(questionList[thisQuestion.id]["comments"]);
//   }else{
//     res.status(404);
//     res.setHeader('Content-Type', 'text/json');
//     res.send('{results: "no comment"}');
//   }
//
// });


router.delete('/question/:id', async function(req, res){
  //console.log(req.params.id);
  Question.deleteQuestion(req.params.id);
  let questionList = await Question.getAllQuestions();
  res.redirect('/questions');
});

module.exports = router
