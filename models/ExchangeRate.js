const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ExchangeRateSchema = new Schema({
  code: String,
  name: String,
  unit: String,
  value: Number,
  type: String,
})

const ExchangeRate = mongoose.model("ExchangeRate", ExchangeRateSchema)
module.exports = ExchangeRate
