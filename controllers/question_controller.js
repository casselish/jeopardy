let express = require('express')
  , router = express.Router();
let request = require('request');

let Question = require('../models/question_model')

let apikey = 'f09c17eb';

router.get('/', function(req, res){
  res.redirect('/questions');
});

router.get('/questions', function(req, res){
  let questionList = Question.getAllQuestions();
  //console.log(questionList);

  res.status(200);
  res.setHeader('Content-Type', 'text/html');
  res.render('question/show_questions.ejs', {questions: questionList});
});


router.get('/question/create', function(req, res){
  let apiList = Question.getAllAPIs();
  let apiTitles = Object.keys(apiList);
  let searchedTerm = Math.floor((Math.random() * (apiTitles.length-1)) + 1);

  res.status(200);
  res.setHeader('Content-Type', 'text/html');
  res.render('question/new_question.ejs', {apiquestion: apiList[apiTitles[0]]})


  //console.log('routed');
  // let title=req.query.title;
  // title=title.replace(/ /g, '+');
  // let found = false;
  // //console.log("questionTitles: " + questionTitles);
  // questionTitles.forEach( function (index, currentValue) {
  // //  console.log("keywords: " + currentValue["keywords"]);
  //   for (var i = 0; i < currentValue["keywords"].length; i++) {
  //
  //     if (currentValue["keywords"][i].includes(title)) {
  //       let questionResponse = questionList[1];
  //       res.status(200);
  //       res.setHeader('Content-Type', 'text/html');
  //       res.render('question/new_question.ejs', {question: questionResponse})
  //       found = true;
  //     }
  //   }
  // });
  // if (!found) {
    // let errorCode=404;
    // res.status(errorCode);
    // res.setHeader('Content-Type', 'text/html');
    // res.render("error.ejs", {"errorCode":errorCode});

});

router.get('/question/:id', function(req, res) {
  let questionList = Question.getAllQuestions();
  let questionTitles = Object.keys(questionList);
  let id = req.params.id;
  //console.log(id);

  if (questionTitles.includes(id)) {
      res.status(200);
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
  let newIDArray = [Math.floor((Math.random() * 9) + 1),Math.floor((Math.random() * 9) + 1),Math.floor((Math.random() * 9) + 1),Math.floor((Math.random() * 9) + 1),Math.floor((Math.random() * 9) + 1)];
  let newID = "";
  newIDArray.forEach(function (currentValue) {
    newID += currentValue;
  });
  let id = newID;

  let newQuestion={
    "id": newID,
    "authorID": 12345,
    "comments": [],
    "question": "This woman's temptestuous relationship with the press and the royal family resulted in her death in a paparazzi-induced car crash in Paris in 1997",
    "answer": "Princess Diana",
    "category": "Royals",
    "creationDate": "March 16, 2021",
    "likes": [],
    "difficulty": 200,
    "keywords": [
      "royalty",
      "crashes"
    ]
  }
  Question.saveQuestion(newID, newQuestion);
  res.redirect('/questions');
  //             res.redirect('/movies');
  // let newID = (movieResponse.Title+" "+movieResponse.Year).replace(/ /g,"_");
  // Movie.saveMovie(newID, newMovie);
  // res.redirect('/movies');
  // request("http://www.omdbapi.com/?apikey="+apikey+"&i="+movieID+"&r=json", function(err, response, body) {
  //           let movieResponse = JSON.parse(body);
  //           if(!err){
  //             let newMovie={
  //               "title": movieResponse.Title,
  //               "year": movieResponse.Year,
  //               "rating": movieResponse.Rated,
  //               "director": movieResponse.Director,
  //               "actors": movieResponse.Actors,
  //               "plot": movieResponse.Plot,
  //               "poster": movieResponse.Poster,
  //               "showtimes": ["3:00", "5:30", "8:45"]
  //             }
  //             let newID = (movieResponse.Title+" "+movieResponse.Year).replace(/ /g,"_");
  //             Movie.saveMovie(newID, newMovie);
  //             res.redirect('/movies');
  //     }
  //     else{
  //         res.redirect('/movies');
  //     }
  //
  //   });
});

router.get('/question/:id/edit', function(req,res){
  let thisQuestion = Question.getQuestion(req.params.id);
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

router.post('/question/likes/:id', function(req, res) {
  let questionList = Question.getAllQuestions();
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

router.post('/question/comments/:id', function(req, res) {
  let questionList = Question.getAllQuestions();
  let thisQuestion = Question.getQuestion(req.params.id);
  thisQuestion.id=req.params.id;

  //console.log(thisQuestion);

  if(questionList[thisQuestion.id]){
    console.log("contains");
    var newComment = {
      "id": req.body.cid,
      "authorID": 12345,
      "questionPostID": req.body.questionPostID,
      "text": req.body.text,
      "likes": [],
      "creationDate": "March 16, 2021"
    };
//  console.log("newComment: " + newComment);
  //console.log("questionList: " + questionList[req.params.id]);
  //console.log("questionList comments: " + questionList[req.params.id]["comments"]);
  questionList[req.params.id]["comments"].push(newComment);
  let newQuestionData = questionList[req.params.id];
  console.log(newQuestionData);
  Question.updateQuestion(req.params.id, newQuestionData);

    res.status(200);
    res.setHeader('Content-Type', 'text/json');
    res.send(questionList[thisQuestion.id]["comments"]);
  }else{
    res.status(404);
    res.setHeader('Content-Type', 'text/json');
    res.send('{results: "no comment"}');
  }

});


router.delete('/question/:id', function(req, res){
  //console.log(req.params.id);
  Question.deleteQuestion(req.params.id);
  res.redirect('/questions');
});

module.exports = router
