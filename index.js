//  Import Express
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
const session = require("express-session");
const redis = require("redis");
let RedisStore = require("connect-redis")(session);
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require("./config/config");
let RedisClient = redis.createClient({
  host: REDIS_URL,
  port: REDIS_PORT,
});
const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

//  Create Express app instance.
const app = express();

//  Code for app to handle situation where mongodb is not running.
const connectWithRetry = () => {
  mongoose
    .connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`)
    .then(() => console.log("Successfully connected to DB"))
    .catch((e) => {
      console.log(e);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();
app.enable("trust proxy")
app.use(cors({}));
app.use(
  session({
    store: new RedisStore({client: RedisClient}),
    secret: SESSION_SECRET,
    cookie: {
      secure: false,
      resave: false,
      saveUninitialized: false,
      httpOnly: true,
      maxAge: 10000,
    }
  })
);

//  To make sure body gets attached to request object.
app.use(express.json());

//  Set up quick route for testing purposes
//  Function for if anyone sends a get request to this path, send back response.
app.get("/api/v1", (req, res) => {
    res.send("<h2>Hi There!</h2>");
    console.log("yeah it ran");
});

//  localhost:3000/posts
//  Set API Versions
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

//  If environment variable PORT has been set, set PORT to that variable.
//  If not set, default to value 3000.
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));
