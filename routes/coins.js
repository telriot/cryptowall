var express = require("express")
var router = express.Router()
const Coins = require("../models/Coin")

/* GET home page. */
router.get("/", async (req, res, next) => {
  try {
    const coins = await Coins.find()
    res.send(coins)
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
