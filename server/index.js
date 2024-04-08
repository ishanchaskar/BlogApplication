const express = require("express");
const cors = require("cors");
const { connect } = require("mongoose");
require("dotenv").config();
const uploads = require("express-fileupload")
const UserRoutes = require("./routes/UserRoutes")
const PostRoutes = require("./routes/PostRoutes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");


const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));
app.use(cors({ credentials: true , origin: "http://localhost:3000" }));
app.use(uploads())
app.use('/uploads' , express.static(__dirname + '/uploads'));
app.use("/api/user", UserRoutes);
app.use("/api/posts", PostRoutes);
app.use(errorHandler);
app.use(notFound);

connect(process.env.MONGOURL)
  .then(
    app.listen(5000, () => console.log(`listening on port ${process.env.PORT}`))
  )
  .catch((error) => console.log(error));


