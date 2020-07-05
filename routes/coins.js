var express = require("express")
var router = express.Router()
const Coins = require("../models/Coin")
const CoinInfos = require("../models/CoinInfo")

/* GET home page. */
router.get("/", async (req, res, next) => {
  try {
    const coins = await Coins.find()
    res.send({ coins })
  } catch (error) {
    console.log(error)
  }
})
router.get("/autocomplete", async (req, res, next) => {
  const { input } = req.query
  try {
    const coins = await CoinInfos.find({
      name: { $regex: input, $options: "i" },
    })
    res.send(coins)
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
