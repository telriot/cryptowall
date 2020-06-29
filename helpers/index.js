const axios = require("axios")
const Coins = require("../models/Coin")

module.exports = {
  getList: async () => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/list`
      )
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  },
  getPrice: async (target, base) => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${target}&vs_currencies=${base}`
      )
      const price = response.data[target][base]
      return price
    } catch (error) {
      console.log(error)
    }
  },
  getHistoricalData: async (target, base, timeframe) => {
    try {
      const result = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${target}/market_chart?vs_currency=${base}&days=${timeframe}`
      )
      const coinData = result.data
      const prices = coinData.prices
      return prices
    } catch (error) {
      console.log(error)
    }
  },

  addCoin: async (id, symbol, name) => {
    try {
      const coin = await Coins.findOne({ id })
      if (coin) {
        console.log(`${name} is already in the database`)
      } else {
        const usd = await module.exports.getPrice(id, "usd")
        const yearlyData = await module.exports.getHistoricalData(id, "usd", 91)
        let newCoins = { id, symbol, name, usd, yearlyData }
        await Coins.create(newCoins)
        console.log(`${name} successfully added`)
      }
    } catch (error) {
      console.log(error)
    }
  },
  deleteCoin: async (id) => {
    try {
      const coin = await Coins.findOneAndDelete({ id })
      if (!coin) {
        console.log(`${id} is not in the database`)
      } else {
        console.log(`${id} successfully deleted`)
      }
    } catch (error) {
      console.log(error)
    }
  },

  updateAllPrices: async (data) => {
    for (let obj of data) {
      for (let [key, value] of Object.entries(obj)) {
        try {
          await Coins.findOneAndUpdate({ id: key }, { usd: value.usd })
        } catch (error) {
          console.log(error)
        }
      }
    }
  },

  getAllPrices: async () => {
    try {
      const coins = await Coins.find()
      const requestArray = []
      const createPriceRequest = (target, base) => {
        return axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${target}&vs_currencies=${base}`
        )
      }

      for (let coin of coins) {
        requestArray.push(createPriceRequest(coin.id, "usd"))
      }
      const results = await axios.all(requestArray)
      const data = results.map((res) => res.data)

      module.exports.updateAllPrices(data)
      return data
    } catch (error) {
      console.log(error)
    }
  },
  getAllHistoricalData: async (timeframe) => {
    try {
      const coins = await Coins.find()
      for (let coin of coins) {
        const result = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=usd&days=${timeframe}`
        )
        const coinData = result.data
        await Coins.findOneAndUpdate(
          { id: coin.id },
          { yearlyData: coinData.prices }
        )
      }
    } catch (error) {
      console.log(error)
    }
  },
}
