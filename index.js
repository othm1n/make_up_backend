const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;

const { MONGOURI } = require("./config/keys");

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
mongoose.connection.on("connected", () => {
  console.log("conneted to MongoDB");
});
mongoose.connection.on("error", (err) => {
  console.log("err connecting", err);
});

require("./models/user");
require("./models/product");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "https://makeup01.netlify.app",
      "https://make-up-backend.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/product"));
app.use(require("./routes/cart"));
app.use(require("./routes/user"));

app.listen(PORT, () => {
  console.log("server is running on", PORT);
});
