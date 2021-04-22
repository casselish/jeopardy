let express = require('express')
  , router = express.Router();
let req = require('request');

let User = require('../models/user_model');
let Question = require('../models/question_model');

let apikey = 'f09c17eb';

router.get('/', function(req, res){
  res.redirect('/questions');
});

router.get('/users', async function(req, res){
  let userList = await User.getAllUsers();

  res.status(200);
  res.setHeader('Content-Type', 'text/html');
  res.render('user/show_users.ejs', {users: userList});
});

router.get('/user/create', async function(req, res){
  let userList = await User.getAllUsers();

  res.status(200);
  res.setHeader('Content-Type', 'text/html');
  res.render('user/new_user.ejs', {users: userList});

});

router.post('/user/:id', function(req, res) {
  let newIDArray = [Math.floor((Math.random() * 9) + 1),Math.floor((Math.random() * 9) + 1),Math.floor((Math.random() * 9) + 1),Math.floor((Math.random() * 9) + 1),Math.floor((Math.random() * 9) + 1)];
  let newID = "";
  newIDArray.forEach(function (currentValue) {
    newID += currentValue;
  });
  let id = newID;
  //console.log(request);
  let newestUserData = {};
  //console.log("request " + req.body);
  newestUserData["id"] = newID;
  newestUserData["username"]= req.body.username;
  newestUserData["name"]= req.body.name;
  newestUserData["email"]= req.body.email;
  newestUserData["comments"]= [];
  newestUserData["commentLikes"]= [];
  newestUserData["questionLikes"]= [];
  newestUserData["logins"] = [];
  newestUserData["owner"] = false;

  User.saveUser(newID, newestUserData);
  res.redirect('/users');

});

router.get('/user/:id', async function(req, res) {
  let userList = await User.getAllUsers();
  let userTitles = Object.keys(userList);
  let id = req.params.id;
  let questionList = Question.getAllQuestions();
  let questionTitles = Object.keys(questionList);
  let questionVar = "";
  //console.log(id);
  console.log(userTitles);

  if (userTitles.includes(id)) {
    for (let i =0; i <= userList[id]["comments"].length -1; i ++) {
      console.log(userList[id]["comments"][i]);
      questionTitles.forEach(function (currentValue, index){
        Object.keys(questionList[currentValue]["comments"]).forEach(function (question){
          if (userList[id]["comments"][i] == question) {
            questionVar = currentValue;
          }
        });
      });
    }
      res.status(200);
      res.setHeader('Content-Type', 'text/html')
      res.render("user/user_details.ejs",{
        users: userList[id],
        userID: id,
        questionID: questionVar,
        questions: questionList
      });
    }else{
      let errorCode=404;
      res.status(errorCode);
      res.setHeader('Content-Type', 'text/html');
      res.render("error.ejs", {"errorCode":errorCode});
    }
});

router.get('/user/:id/edit', function(req,res){
  let thisUser = User.getUser(req.params.id);
  thisUser.id=req.params.id;

  if(thisUser){
    res.status(200);
    res.setHeader('Content-Type', 'text/html');
    res.render("user/edit_user.ejs", {user: thisUser} );
  }
  else{
    let errorCode=404;
    res.status(errorCode);
    res.setHeader('Content-Type', 'text/html');
    res.render("error.ejs", {"errorCode":errorCode});
  }
});

router.put('/user/:id', function(req,res){
  let newUserData = {};
  let id= req.body.id;
  newUserData["id"] = req.body.id;
  newUserData["username"]= req.body.username;
  newUserData["name"]= req.body.name;
  newUserData["email"]= req.body.email;
  newUserData["comments"]= req.body.comments.split(",");
  newUserData["commentLikes"]= req.body.commentLikes.split(",");
  newUserData["questionLikes"]= req.body.questionLikes.split(",");
  newUserData["logins"] = req.body.logins.split(",");

  User.updateUser(id, newUserData);
  res.redirect('/users');
});

router.delete('/user/:id', function(req, res){
  //console.log(req.params.id);
  User.deleteUser(req.params.id);
  res.redirect('/users');
});

module.exports = router
