const mongoose = require("mongoose")
const Schema = mongoose.Schema

const CoinSchema = new Schema({
  id: String,
  symbol: String,
  name: String,
  yearlyData: Array,
  monthlyData: Array,
  weeklyData: Array,
  dailyData: Array,
  value: Number,
  dailyUpdated: Date,
  weeklyUpdated: Date,
  monthlyUpdated: Date,
  yearlyUpdated: Date,
})

const Coin = mongoose.model("Coin", CoinSchema)
module.exports = Coin
