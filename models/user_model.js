var fs = require('fs');

exports.getAllUsers = function() {
  var userData = fs.readFileSync('data/user.json', 'utf8');
  return JSON.parse(userData);
}

exports.getUser = function(id) {
  var userData = exports.getAllUsers();

  if (userData[id]) return userData[id];

  return {};
}

exports.saveUser = function(id, newUser) {
  var userData = exports.getAllUsers();
  userData[id] = newUser;
  fs.writeFileSync('data/user.json', JSON.stringify(userData));
}

exports.updateUser = function(id, userData) {
  exports.saveUser(id, userData)
}

exports.deleteUser = function(id) {
  var userData = exports.getAllUsers();
  delete userData[id];
  fs.writeFileSync('data/user.json', JSON.stringify(userData));
}
