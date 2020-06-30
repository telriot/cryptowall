const mongoose = require("mongoose")
const Schema = mongoose.Schema

const CoinInfoSchema = new Schema({
  id: String,
  symbol: String,
  name: String,
})

const CoinInfo = mongoose.model("CoinInfo", CoinInfoSchema)
module.exports = CoinInfo
