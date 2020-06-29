const helpers = require("../helpers/index")
const socketIo = require("../app")
const Coins = require("../models/Coin")

module.exports = {
  emit: async () => {
    const coins = await Coins.find()
    socketIo.io.emit("FromAPI", coins)
  },

  getPricesAndEmit: async () => {
    try {
      await helpers.getAllPrices()
      module.exports.emit()
    } catch (error) {
      console.log(error)
    }
  },
  getHistoricalDataAndEmit: async (interval) => {
    try {
      await helpers.getAllHistoricalData(interval)
      module.exports.emit()
    } catch (error) {
      console.log(error)
    }
  },
  addCoinAndEmit: async (id, symbol, name) => {
    try {
      await helpers.addCoin(id, symbol, name)
      module.exports.emit()
    } catch (error) {
      console.log(error)
    }
  },
  deleteCoinAndEmit: async (id) => {
    try {
      await helpers.deleteCoin(id)
      module.exports.emit()
    } catch (error) {
      console.log(error)
    }
  },
}
