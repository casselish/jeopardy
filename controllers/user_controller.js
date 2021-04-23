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

router.post('/user/:id', async function(req, res) {
  let newIDArray = [Math.floor((Math.random() * 9) + 1),Math.floor((Math.random() * 9) + 1),Math.floor((Math.random() * 9) + 1),Math.floor((Math.random() * 9) + 1),Math.floor((Math.random() * 9) + 1)];
  let newID = "";
  newIDArray.forEach(function (currentValue) {
    newID += currentValue;
  });
  let id = newID;
  //console.log(request);
  let newUser = {
    "id": id,
    "username": req.body.username,
    "name": req.body.name,
    "email": req.body.email,
    "logins": []
  }

  User.saveUser(id, newUser);
  let userList = await User.getAllUsers();
  res.redirect('/users');

});

router.get('/user/:id', async function(req, res) {
  let userList = await User.getAllUsers();
  let userTitles = Object.keys(userList);
  let id = req.params.id;
  let questionList = await Question.getAllQuestions();
  let questionTitles = Object.keys(questionList);
  //console.log(id);
  console.log(userTitles);

  if (userTitles.includes(id)) {
      res.status(200);
      res.setHeader('Content-Type', 'text/html')
      res.render("user/user_details.ejs",{
        users: userList[id],
        userID: id,
        questions: questionList
      });
    }else{
      let errorCode=404;
      res.status(errorCode);
      res.setHeader('Content-Type', 'text/html');
      res.render("error.ejs", {"errorCode":errorCode});
    }
});

router.get('/user/:id/edit', async function(req,res){
  let thisUser = await User.getUser(req.params.id);
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

router.put('/user/:id', async function(req,res){
  let newUserData = {};
  let id= req.body.id;
  newUserData["id"] = req.body.id;
  newUserData["username"]= req.body.username;
  newUserData["name"]= req.body.name;
  newUserData["email"]= req.body.email;
  newUserData["logins"] = req.body.logins.split(",");

  User.updateUser(id, newUserData);
  let thisUser = await User.getUser(req.params.id);
  res.redirect('/users');
});

router.delete('/user/:id', async function(req, res){
  //console.log(req.params.id);
  User.deleteUser(req.params.id);
  let userList = await User.getAllUsers();
  res.redirect('/users');
});

module.exports = router
