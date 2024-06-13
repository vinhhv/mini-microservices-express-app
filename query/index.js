const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data, status) => {
  if (type === "PostCreated") {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, content, postId } = data;

    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === "CommentUpdated") {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    const comment = post.comments.find((comment) => {
      return comment.id === id;
    });

    comment.status = status;
    comment.content = content;
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data, status } = req.body;

  handleEvent(type, data, status);

  res.send({});
});

app.listen(4002, async () => {
  console.log("Listening on 4002");

  try {
    const res = await axios.get("http://localhost:4005/events");
  } catch (error) {
    console.log(error.message);
  }

  for (let event of res.data) {
    console.log("Processing event:", event.type);
    handleEvent(event.type, event.data, event.status);
  }
});
