const randomstring = require('randomstring');

module.exports = {
  createUser: createUser,
  login: login,
  getQueue: getQueue
}


function createUser(req, res) {
  const email = req.swagger.params.user.value.email;
  const password = req.swagger.params.user.value.password;

  const usersCollection = req.app.locals.usersCollection;
  usersCollection.insert({ "email": email, "password": password }).then(
    usersCollection.find({ "email": email }).toArray()
      .then(newUser => {
        res.status(201);
        res.json({ "id": newUser[0]._id, "email": newUser[0].email, "password": "Saved" });
      }))
    .catch(e => res.send(e.message));
}

function login(req, res) {
  const email = req.swagger.params.credentials.value.email;
  const password = req.swagger.params.credentials.value.password;
  const usersCollection = req.app.locals.usersCollection;
  const sessionId = randomstring.generate(32);

  usersCollection.find({ "email": email }).toArray()
    .then(user => {
      if (!user[0] || user[0].password !== password) {
        return res.status(401).json({ message: "Invalid email or password" })
      }
      res.json({ "sessionID": sessionId });
    }).catch(e => {
      res.status(401);
      res.send(e.message);
    });
}

function getQueue(req, res) {
  const userId = req.swagger.params.userId.value;
  const sessionID = req.swagger.params.sessionID.value;
  const queueCollection = req.app.locals.queueCollection;

  if (!sessionID) {
    return res.status(401).json({ message: "Please log in" });
  }

  queueCollection.findOne({ "userId": userId })
    .then(queueDoc => {
      if (!queueDoc) {
        return res.status(404).json({ "message": "Queue not found" });
      }

      res.json({ "queue": queueDoc.queue });
    });
}