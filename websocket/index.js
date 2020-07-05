const helpers = require("../helpers/index")
const socketIo = require("../app")
const Coins = require("../models/Coin")

module.exports = {
  emit: async () => {
    const coins = await Coins.find()
    socketIo.io.emit("FromAPI", { coins })
  },

  getPricesAndEmit: async (base) => {
    try {
      await helpers.getAllPrices(base)
      module.exports.emit()
    } catch (error) {
      console.log(error)
    }
  },
  getHistoricalDataAndEmit: async (interval, base = "usd") => {
    try {
      await helpers.getAllHistoricalData(interval, base)
      module.exports.emit()
    } catch (error) {
      console.log(error)
    }
  },
  refreshAllDataAndEmit: async (base = "usd") => {
    try {
      await helpers.refreshAllData(base)
      module.exports.emit()
    } catch (error) {
      console.log(error)
    }
  },
  addCoinAndEmit: async (id, symbol, name, base) => {
    try {
      await helpers.addCoin(id, symbol, name, base)
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
