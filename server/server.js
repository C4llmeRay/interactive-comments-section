const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

const commentRouter = require("./routers/commentRouter");
const userRouter = require("./routers/userRouter");

app.use(
  cors({
    origin: "*",
  })
);

app.use("/comment", commentRouter);
app.use("/user", userRouter);

const dbURL = "mongodb+srv://chaaliaramy:Gj1tNLyVXKmTgvTI@cluster0.us60xnp.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(3005, () => {
      console.log("Server is running on port 3005");
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
