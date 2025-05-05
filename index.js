const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./Router/mainRoute");
const mongoose = require("mongoose");
const path = require("path");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const corsOptions = {
  origin: "http://localhost:3000",
};
app.use(cors(corsOptions));

mongoose
  .connect("mongodb+srv://hiral:1234@cluster0.ycsaq.mongodb.net/E-commerce", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("connected");
  });

app.use("/api", router);
app.listen(8000, () => {
  console.log("server started");
});
