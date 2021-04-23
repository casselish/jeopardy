let express = require('express')
  , router = express.Router();
let request = require('request');
var fs = require('fs');

var categoryIDs = [];
var clues = {};
request("http://jservice.io/api/categories?count=100", function (err, response, body) {
  let categoryResponse = JSON.parse(body);
  //console.log(categoryResponse);
  if (!err) {
    for (var i = 0; i <= categoryResponse.length-1; i++) {
      categoryIDs.push(categoryResponse[i].id);
    }
    console.log(categoryIDs);

    categoryIDs.forEach(function (currentValue, index) {
      //console.log("iteration happening");
      request("http://jservice.io/api/clues?category="+currentValue, function (err, response, body) {
        //console.log("request made");
        let clueResponse = JSON.parse(body);
        if (!err) {
          clueResponse.forEach(function (currentValue, index){
            //console.log("creating new clue");
            let newClue = {
              "id": currentValue.id,
              "authorID": 00000,
              "question": currentValue.question,
              "answer": currentValue.answer,
              "category": currentValue.category.title,
              "creationDate": currentValue.created_at,
              "difficulty": currentValue.value,
            }
            clues[newClue["id"]]=newClue;
          });
            console.log(clues);
            fs.writeFileSync('../../data/question.json', JSON.stringify(clues));
        }
      });
    });
  }
});
