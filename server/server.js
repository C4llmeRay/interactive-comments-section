const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
require('dotenv').config();


app.use(express.json());

const commentRouter = require("./routers/commentRouter");
const userRouter = require("./routers/userRouter");
const notificationRouter = require("./routers/notificationRouter")

app.use(
  cors({
    origin: "*",
  })
);

app.use("/comment", commentRouter);
app.use("/user", userRouter);
app.use('/notifications', notificationRouter);


mongoose
  .connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(3005, () => {
      console.log("Server is running on port 3005");
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

