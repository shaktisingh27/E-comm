const express = require("express");

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const path = require("path");

//configure env
dotenv.config();

const PORT = process.env.PORT || 8000;

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "./client/build")));
//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

//rest api
// app.get("/", (req, res) => {
//   res.send("<h1>Welcome to ecommerce app</h1>");
// });

app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

mongoose
  .connect(
    "mongodb+srv://gk8508111:xa3LY20HZFFdfCwu@cluster0.zfvv19p.mongodb.net/E-comm?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("database is connected");
    app.listen(PORT);
  })
  .catch((err) => console.log(err));
