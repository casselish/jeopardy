var fs = require('fs');
var admin = require("firebase-admin");
var serviceAccount = require("../public/js/firebase-config.json");

// Create a database reference
var db = admin.firestore();


exports.getAllUsers = async function() {
  let allUsers = {};

  try {
    let users = await db.collection('users').get();

    for (user of users.docs) {
      allUsers[user.id] = user.data();
    };
    console.log("allUsers: " + allUsers);
    return allUsers;
  } catch (err) {
    console.log('Error getting documents', err);
  }
}

exports.getUser = async function(id) {
  var userData = await exports.getAllUsers();

  if (userData[id]) return userData[id];

  return {};
}

exports.saveUser = async function(id, newUser) {

  let user = db.collection('users').doc(id);
  let setUser = user.set({
      "id": id,
      "username": newUser["username"],
      "name": newUser["name"],
      "email": newUser["email"],
      "comments": newUser["comments"],
      "commentLikes": newUser["commentLikes"],
      "questionLikes": newUser["questionLikes"],
      "logins": newUser["logins"]
    });
  console.log("user: " + user);
}

exports.updateUser = function(id, userData) {
  exports.saveUser(id, userData)
}

exports.deleteUser = async function(id) {
  var userData = await exports.getAllUsers();
  db.collection('users').doc(id).delete();
  //fs.writeFileSync('data/user.json', JSON.stringify(userData));
}
