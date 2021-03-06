const User = require('../models/User');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
class UserController {
//[GET] /user
show(req, res) {
User.find()
.then((user) => {
res.send({ user });
})
.catch(res.status(400).send(e));
}
//[]GET /user/create
create(req, res, next) {
var user = new User({
userName: req.body.userName,
password: req.body.password,
name: req.body.name,
email: req.body.email,
});
//Add the new user to the database
user
.save()
.then(() => {
res.send({ user });
})
.catch(next);
}
showById(req, res) {
const { username, password } = req.body;
//find the user by username and password
User.findOne({ username, password })
.then((user) => {
res.send({ user });
})
.catch(res.status(400).json({ message: 'User not found' }));
}
//[POST] /courses/Store
update(req, res) {
var query = { userName: req.params.userName, password: req.params.password };
//find user and update
User.findOneAndUpdate(query, req.body)
.then(() => {
res.send({ user });
})
.catch(res.status(400).send(e));
}
delete(req, res) {
var query = { userName: req.params.userName };
//find user and delete
User.findOneAndDelete(query)
.then(() => {
res.send({ user });
})
.catch(res.status(400).send(e));
}
async register(req, res) {
const { username, password } = req.body;
//Validate username and password
if (!username || !password) {
return res
.status(400)
.send({ success: false, message: 'Please enter all fields' });
}
try {
const user = await User.findOne({ username });
if (user) {
return res.status(400).send({ success: false, message: 'User already taken' });
}
const hashedPassword = argon2.hash(password);
const newUser = new User({
username,
password: hashedPassword,
});
await newUser.save();
//return token for the user
const token = jwt.sign({ _id: newUser._id }, process.env.TOKEN_SECRET);
res.json({ success: true, message: 'User created', token });
} catch (error) {}
}
}
//create an instance of the object
module.exports = new UserController();
