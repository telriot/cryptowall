require("dotenv").config()
var express = require("express")
var path = require("path")
var cookieParser = require("cookie-parser")
var logger = require("morgan")
const mongoose = require("mongoose")
//const session = require("express-session")
//const MongoStore = require("connect-mongo")(session)
//const passport = require("passport")
var indexRouter = require("./routes/index")

var app = express()

//Connect to the DB
mongoose.connect(
  process.env.MONGO_URI || `mongodb://localhost:27017/portfolio-app`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", function () {
  console.log("DB Connected")
})
mongoose.set("useFindAndModify", false)
mongoose.set("useCreateIndex", true)

// Setup public assets directory
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

// Sessions
/*app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: db }),
  })
)

// Passport
app.use(passport.initialize())
app.use(passport.session())
*/
// Mount Routes
app.use("/", indexRouter)

// Prepare Production Settings

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  })
}

module.exports = app
