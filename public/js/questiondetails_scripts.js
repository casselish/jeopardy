let questionID = document.getElementById("id").innerText;

document.getElementById("like_button").addEventListener('click', function(){
    let xmlhttp = new XMLHttpRequest();

    // Specify details of the POST request
    xmlhttp.open("POST", "/question/likes/"+questionID, true);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    let postData = {
     "like": 1
    };

    // Make a POST request with your data in the body of the request
    xmlhttp.send(JSON.stringify(postData));

    // Do something once the Response (Good or Bad) has been received
    xmlhttp.onreadystatechange = function(data) {
      //console.log(i);
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          var likeNotif = document.createElement("p");
          var likeNotifText = document.createTextNode("Someone pressed the like button!");
          likeNotif.appendChild(likeNotifText);
          (document.getElementById("comment_likes")).appendChild(likeNotif);
          //document.getElementById("comment_likes").innerText="Someone pressed the like button!";
        }else{

        }
    }
});

document.getElementById("comment_form").addEventListener('click', function(){
 console.log("starting");
  let xmlhttp = new XMLHttpRequest();

  // Specify details of the POST request
  xmlhttp.open("POST", "/question/comments/"+questionID, true);
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  let newCIDArray = [Math.floor((Math.random() * 9) + 1),Math.floor((Math.random() * 9) + 1),Math.floor((Math.random() * 9) + 1),Math.floor((Math.random() * 9) + 1)];
  let newCID = "";
  newCIDArray.forEach(function (currentValue) {
    newCID += currentValue;
  });


  let commentData = {
    "cid": newCID,
    "cauthorID": 12345,
    "questionPostID": questionID,
    "text": "this was a hard one!",
    "likes": [],
    "creationDate": "March 16, 2021"
  };

  console.log("sending data: " +commentData);
//console.log(postData);

// Make a POST request with your data in the body of the request
xmlhttp.send(JSON.stringify(commentData));
console.log("data sent");

xmlhttp.onreadystatechange = function(data) {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        let thisQuestion=JSON.parse(xmlhttp.responseText);

        var comment = document.createElement("p");
        var commentText = document.createTextNode("comments: that was a hard one!");
        comment.appendChild(commentText);

        // var newButton = document.createElement("BUTTON");
        // newButton.innerHTML = "Like";
        // newButton.id = "like_button_";
        //console.log("id: " + newButton.id);
        // newButton.type = "button";

        document.getElementById("commentsdiv").appendChild(comment);
        // // document.getElementById("commentsdiv").appendChild(newButton);
        //
        // document.getElementById(newButton.id).addEventListener('click', function(){
        //   console.log("here");
        //     let xmlhttp = new XMLHttpRequest();
        //
        //     // Specify details of the POST request
        //     xmlhttp.open("POST", "/question/likes/"+questionID, true);
        //     xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        //
        //     let postData = {
        //      "like": 1
        //     };
        //
        //     // Make a POST request with your data in the body of the request
        //     console.log("sent");
        //     xmlhttp.send(JSON.stringify(postData));
        //
        //     // Do something once the Response (Good or Bad) has been received
        //     xmlhttp.onreadystatechange = function(data) {
        //       //console.log(i);
        //         if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        //           var likeNotif = document.createElement("p");
        //           var likeNotifText = document.createTextNode("Someone pressed the like button!");
        //           likeNotif.appendChild(likeNotifText);
        //           (document.getElementById("comment_likes")).appendChild(likeNotif);
        //           //document.getElementById("comment_likes").innerText="Someone pressed the like button!";
        //         }else{
        //
        //         }
        //     }
        // });

    }else{

    }
}
});
