'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
module.exports = app; // for testing

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost';

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  try {
    MongoClient.connect(url, (err, client) => {
      const db = client.db('netflix');
      const usersCollection = db.collection('users');
      const videosCollection = db.collection('videos');
      const port = process.env.PORT || 10010;
      app.locals.usersCollection = usersCollection;
      app.locals.videosCollection = videosCollection;
      app.listen(port);      
    });
  } catch (err) {
    console.log(err);
  }
  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});
