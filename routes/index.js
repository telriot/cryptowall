var express = require("express")
var router = express.Router()

/* GET home page. */
router.get("/", async (req, res, next) => {
  res.send({ response: "I am alive" }).status(200)
})

module.exports = router
