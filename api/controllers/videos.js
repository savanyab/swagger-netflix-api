module.exports = {
  findVideoByTitle: findVideoByTitle,
  download: download
}

function findVideoByTitle(req, res) {
  const title = req.swagger.params.title.value;
  const sessionId = req.swagger.params.sessionID.value;
  const videosCollection = req.app.locals.videosCollection;

  if (!sessionId) {
    return res.status(401).json({ message: "Please log in to see video" })
  }

  videosCollection.find({ "title": title }).toArray()
    .then(video => {
      if (!video[0]) {
        return res.status(404).json({ message: "Video not found" })
      }
      res.json({ "id": video[0]._id, "title": video[0].title, "year": video[0].year });
    }).catch(e => {
      res.send({ "Error": e.message });
    });
}

function download(req, res) {
  const queueCollection = req.app.locals.queueCollection;
  const videosCollection = req.app.locals.videosCollection;
  const title = req.swagger.params.download.value.title;
  const userId = req.swagger.params.download.value.userId;
  const sessionId = req.swagger.params.sessionID.value;

  if (!sessionId) {
    return res.status(401).json({ message: "Please log in" });
  }

  videosCollection.findOne({ "title": title }).then(video => {
    if (!video) {
      return res.status(404).json({ "message": "Video not found" });
    }
    const query = { "userId": userId };
    const update = {
      $addToSet: {
        "queue": video
      }
    }
    const options = { upsert: true}
    queueCollection.updateOne(query, update, options)
      .then(queueCollection.findOne(query)
        .then(queueDoc => {
          res.json({ "queue": queueDoc.queue})
        }))
  }).catch(e => res.send({ "Error": e.message }));
} 