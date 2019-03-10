const path = require("path")
const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const router = express.Router()
const ejs = require("ejs")
const port = process.env.PORT
const { Q } = require("./db/")

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

app.set("view engine", "ejs")
app.set("views", "views")
app.use(express.static(path.join(__dirname, "/")), router)

router.get("/", function(req, res) {
  res.render("index", {})	
})

router.get("/success", function(req, res) {
  res.render("success", {})
})

router.post("/waitlist", async function(req, res) {
  const { email, receiveUpdates } = req.body
  try {
    await Q.waitlist.insertOne(email, !!receiveUpdates)
    res.redirect("/success")
  } catch (err) {
    console.log(err)
    res.redirect("/")
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`)
})
