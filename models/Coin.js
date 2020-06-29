const mongoose = require("mongoose")
const Schema = mongoose.Schema

const CoinSchema = new Schema({
  id: String,
  symbol: String,
  name: String,
  usd: Number,
  yearlyData: Array,
})

const Coin = mongoose.model("Coin", CoinSchema)
module.exports = Coin
