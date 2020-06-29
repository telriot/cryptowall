require("dotenv").config()
const http = require("http")
const express = require("express")
const socketIo = require("socket.io")
const path = require("path")
const cookieParser = require("cookie-parser")
const logger = require("morgan")
const mongoose = require("mongoose")
const helpers = require("./helpers/index")
const coinsRouter = require("./routes/coins")
const indexRouter = require("./routes/index")
const app = express()
const server = http.createServer(app)
const io = socketIo(server)
exports.io = io
const wsActions = require("./websocket/index")
const debug = require("debug")("portfolio-app:server")

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
//Refresh DB on start
helpers.getAllPrices()
helpers.getAllHistoricalData(91)

// Setup public assets directory
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

// Web Socket
io.on("connection", (socket) => {
  console.log("New client connected")
  socket.on("add coin", ({ id, symbol, name }) =>
    wsActions.addCoinAndEmit(id, symbol, name)
  )
  socket.on("delete coin", (id) => wsActions.deleteCoinAndEmit(id))
  socket.on("disconnect", () => {
    console.log("user disconnected")
  })
})
// Start Web Socket Intervals
let priceInterval
if (!priceInterval)
  priceInterval = setInterval(() => wsActions.getPricesAndEmit(), 30000)
let yearlyDataInterval
if (!yearlyDataInterval)
  yearlyDataInterval = setInterval(
    () => wsActions.getHistoricalDataAndEmit(91),
    600000
  )
// Mount Routes
app.use("/", indexRouter)
app.use("/api/coins", coinsRouter)

// Prepare Production Settings

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  })
}

//Server config
const port = process.env.PORT || "5000"
app.set("port", port)

server.listen(port)
server.on("error", onError)
server.on("listening", onListening)

function onError(error) {
  if (error.syscall !== "listen") {
    throw error
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port

  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges")
      process.exit(1)
      break
    case "EADDRINUSE":
      console.error(bind + " is already in use")
      process.exit(1)
      break
    default:
      throw error
  }
}

function onListening() {
  const addr = server.address()
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port
  debug("Listening on " + bind)
}

module.exports = app
