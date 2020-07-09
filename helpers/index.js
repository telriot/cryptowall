const axios = require("axios")
const Coins = require("../models/Coin")
const { update } = require("../models/Coin")
module.exports = {
  getList: async () => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/list`
      )
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

  addCoin: async (id, symbol, name, base = "usd") => {
    try {
      const coin = await Coins.findOne({ id })
      if (coin) {
        console.log(`${name} is already in the database`)
      } else {
        let price = axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=${base}`
        )
        let daily = axios.get(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${base}&days=1`
        )
        let weekly = axios.get(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${base}&days=7`
        )
        let monthly = axios.get(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${base}&days=30`
        )
        let yearly = axios.get(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${base}&days=365`
        )
        const [
          priceResponse,
          dailyResponse,
          weeklyResponse,
          monthlyResponse,
          yearlyResponse,
        ] = await axios.all([price, daily, weekly, monthly, yearly])
        let newCoin = {
          id,
          symbol,
          name,
          value: priceResponse.data[id][base],
          dailyData: dailyResponse.data.prices,
          weeklyData: weeklyResponse.data.prices,
          monthlyData: monthlyResponse.data.prices,
          yearlyData: yearlyResponse.data.prices,
          dailyUpdated: Date.now(),
          weeklyUpdated: Date.now(),
          monthlyUpdated: Date.now(),
          yearlyUpdated: Date.now(),
        }

        await Coins.create(newCoin)
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

  updateAllPrices: async (data, base = "usd") => {
    for (let obj of data) {
      for (let [key, value] of Object.entries(obj)) {
        try {
          await Coins.findOneAndUpdate({ id: key }, { value: value[base] })
        } catch (error) {
          console.log(error)
        }
      }
    }
  },

  getAllPrices: async (base = "usd") => {
    try {
      const coins = await Coins.find()
      const requestArray = []
      const createPriceRequest = (target, base = "usd") => {
        return axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${target}&vs_currencies=${base}`
        )
      }

      for (let coin of coins) {
        requestArray.push(createPriceRequest(coin.id, base))
      }
      const results = await axios.all(requestArray)
      const data = results.map((res) => res.data)

      module.exports.updateAllPrices(data)
      return data
    } catch (error) {
      console.log(error)
    }
  },
  getAllHistoricalData: async (timeframe, base = "usd") => {
    try {
      const coins = await Coins.find()
      for (let coin of coins) {
        const result = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=${base}&days=${timeframe}`
        )

        const coinData = result.data
        createUpdateObj = (timeframe) => {
          switch (timeframe) {
            case 1:
              return { dailyData: coinData.prices, dailyUpdated: Date.now() }
            case 7:
              return { weeklyData: coinData.prices, weeklyUpdated: Date.now() }
            case 30:
              return {
                monthlyData: coinData.prices,
                monthlyUpdated: Date.now(),
              }
            case 365:
              return { yearlyData: coinData.prices, yearlyUpdated: Date.now() }
          }
        }
        const updateObj = createUpdateObj(timeframe)
        await Coins.findOneAndUpdate({ id: coin.id }, updateObj)
      }
    } catch (error) {
      console.log(error)
    }
  },

  refreshAllData: async (base = "usd") => {
    try {
      const coins = await Coins.find()
      for (let coin of coins) {
        let price = `https://api.coingecko.com/api/v3/simple/price?ids=${coin.id}&vs_currencies=${base}`

        let daily = `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=${base}&days=1`

        let weekly = `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=${base}&days=7`

        let monthly = `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=${base}&days=30`

        let yearly = `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=${base}&days=365`

        const getPrice = axios.get(price)
        const getDaily = axios.get(daily)
        const getWeekly = axios.get(weekly)
        const getMonthly = axios.get(monthly)
        const getYearly = axios.get(yearly)

        let priceResponse,
          dailyResponse,
          weeklyResponse,
          monthlyResponse,
          yearlyResponse
        let requestsOrder = ["price"]
        let requestsArray = [getPrice]

        const now = new Date()
        const nowToMs = now.getTime()
        if (coin.dailyUpdated.getTime() + 55000 < nowToMs) {
          requestsArray.push(getDaily)
          requestsOrder.push("daily")
        }
        if (coin.weeklyUpdated.getTime() + 890000 < nowToMs) {
          requestsArray.push(getWeekly)
          requestsOrder.push("weekly")
        }
        if (coin.monthlyUpdated.getTime() + 3500000 < nowToMs) {
          requestsArray.push(getMonthly)
          requestsOrder.push("monthly")
        }
        if (coin.yearlyUpdated.getTime() + 9500000 < nowToMs) {
          requestsArray.push(getYearly)
          requestsOrder.push("yearly")
        }

        const allResponses = await axios.all(requestsArray)
        priceResponse = allResponses[requestsOrder.indexOf("price")]
        dailyResponse = allResponses[requestsOrder.indexOf("daily")]
        weeklyResponse = allResponses[requestsOrder.indexOf("weekly")]
        monthlyResponse = allResponses[requestsOrder.indexOf("monthly")]
        yearlyResponse = allResponses[requestsOrder.indexOf("yearly")]
        const buildUpdateObj = () => {
          let obj = { value: priceResponse.data[coin.id][base] }
          if (dailyResponse) {
            obj.dailyData = dailyResponse.data.prices
            obj.dailyUpdated = Date.now()
          }
          if (weeklyResponse) {
            obj.weeklyData = weeklyResponse.data.prices
            obj.weeklyUpdated = Date.now()
          }
          if (monthlyResponse) {
            obj.monthlyData = monthlyResponse.data.prices
            obj.monthlyUpdated = Date.now()
          }
          if (yearlyResponse) {
            obj.yearlyData = yearlyResponse.data.prices
            obj.yearlyUpdated = Date.now()
          }
          return obj
        }
        const updateObj = buildUpdateObj()

        await Coins.findOneAndUpdate({ id: coin.id }, updateObj)
      }
    } catch (error) {
      console.log(error)
    }
  },
}
