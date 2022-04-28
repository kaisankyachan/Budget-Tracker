// sets up express
const express = require("express");
// sets up mongoose as connection to mongoDB
const mongoose = require("mongoose");
// compresses content during transmission
const compression = require("compression");
// sets up the port for which the user must use to access to website
// http://localhost:8080/
const PORT = process.env.PORT || 8080;
// sets up express to use as the app back-end
const app = express();
// sets the app to use compression
app.use(compression());
// sets the app to url-encode
app.use(express.urlencoded({ extended: true }));
// sets up the app to use JSON
app.use(express.json());
// allowing users to access files stored in the folder
app.use(express.static("public"));
// defines the mongDB database we will connect to
mongoose.connect("mongodb://localhost/budget", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
// sets up the routes we will use within the app to do different things
app.use(require("./routes/api.js"));
// sets up a listner to let us know when the app is running
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});