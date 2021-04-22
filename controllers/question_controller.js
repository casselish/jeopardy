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
  let title=req.query.title;
  title=title.replace(/ /g, '+');

  request("http://jservice.io/api/clues?question="+title, function(err, response, body) {
      if(!err){
        let questionResponse = JSON.parse(body);
        res.status(200);
        res.setHeader('Content-Type', 'text/html');
        res.render('question/new_question.ejs', {question: questionResponse[0]})
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
    "comments": [],
    "question": req.body.question,
    "answer": req.body.answer,
    "category": req.body.category,
    "creationDate": "March 16, 2021",
    "likes": [],
    "difficulty": req.body.value,
    "keywords": []
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
  let newQuestionData = {};
  let id= req.body.id;
  newQuestionData["authorID"] = req.body.authorID;
  newQuestionData["comments"]= req.body.comments.split(",");
  newQuestionData["question"]= req.body.question;
  newQuestionData["answer"]= req.body.answer;
  newQuestionData["category"]= req.body.category;
  newQuestionData["creationDate"]= req.body.creationDate;
  newQuestionData["likes"]= req.body.likes.split(",");
  newQuestionData["difficulty"] = req.body.difficulty;
  newQuestionData["keywords"] = req.body.keywords;

  Question.updateQuestion(id, newQuestionData);
  res.redirect('/questions');
});

router.post('/question/likes/:id', async function(req, res) {
  let questionList = await Question.getAllQuestions();
  let thisQuestion = Question.getQuestion(req.params.id);
  thisQuestion.id=req.params.id;

  if(questionList[thisQuestion.id]){
  res.status(200);
  res.setHeader('Content-Type', 'text/json');
  res.send(thisQuestion);
  }else{
    res.status(404);
    res.setHeader('Content-Type', 'text/json');
    res.send('{results: "no comment"}');
  }

});

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





//CUT FROM question DETAILS.ejs
//
// <!-- else if (key == 'comments') {%>
//  <h2>Comments: <span id="comment_display">
//    <% Object.keys(questions[key]).forEach(function(comment){ %>
//    <h3><%= key %>:<%= questions[key][comment]["text"] %></h3>
//    <h3> </h3>
//    <h3>comment made by user <%=questions[key][comment]["authorID"] %> </h3>
//    <br />
//
// </h2>
// <%});%>
// <h3> LIKES: <span id="comment_likes">></span> </h2>
// <button id="like_button" type="button"> Like (this button is a stand-in for all of the like buttons (one per comment) that will be on this page )</button>
// <div id="commentsdiv"> </div>
// <label for="commentText">Comment:</label><br>
//  <input type="text" id="commentText" name="commentText"><br>
//
// <label for="commentAuthorID">AuthorID:</label><br>
//  <input type="text" id="commentAuthorID" name="commentAuthorID"><br>
//
// <label for="commentCreationDate">Date:</label><br>
//  <input type="text" id="commentCreationDate" name="commentCreationDate"><br>
//
// <input type="button" id= "comment_form" value="Submit">
// <%}%> -->
