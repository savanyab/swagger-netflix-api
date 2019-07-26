module.exports = {
  findVideoByTitle: findVideoByTitle
}

function findVideoByTitle(req, res) {
  const title = req.swagger.params.title.value;
  const sessionId = req.swagger.params.sessionID.value;
  const collection = req.app.locals.videosCollection;

  if (!sessionId) {
    return res.status(401).json({message: "Please log in to see video"})
  }

  collection.find({ "title": title }).toArray()
    .then(video => {
      if (!video[0]) {
        return res.status(404).json({message: "Video not found"})
      }
      res.json({ "id": video[0]._id, "title": video[0].title, "year": video[0].year });
    }).catch(e => {
      res.send(e.message);
    });

}