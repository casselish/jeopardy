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
  var userData = await exports.getAllUsers();
  userData[id] = newUser;
  fs.writeFileSync('data/user.json', JSON.stringify(userData));
}

exports.updateUser = function(id, userData) {
  exports.saveUser(id, userData)
}

exports.deleteUser = async function(id) {
  var userData = await exports.getAllUsers();
  delete userData[id];
  fs.writeFileSync('data/user.json', JSON.stringify(userData));
}
