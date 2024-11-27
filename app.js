const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;


mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error("Database connection error:", error));
db.once("open", () => console.log("Connected to database"));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const postRoutes = require("./routes/post");
app.use("/posts", postRoutes);

const commentRoutes = require("./routes/comment");
app.use("/comments", commentRoutes);




app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
