module.exports = {
  createUser: createUser
}

function createUser(req, res) {
  const email = req.swagger.params.user.value.email;
  const password = req.swagger.params.user.value.password;
  
  const collection = req.app.locals.usersCollection;
  collection.insert({ "email": email, "password": password });
  collection.find({ "email": email }).toArray()
    .then(newUser => {
      res.status(201);
      res.json({ "id": newUser[0]._id, "email": newUser[0].email, "password": "Saved" });
    });
}