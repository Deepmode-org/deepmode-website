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

router.get("/roadmap", async function(req, res) {
  const roadmap = await Q.roadmapFeature.getAll();
  const { feature_success } = req.query;
  let featureChosen;
  if (feature_success) {
    featureChosen = roadmap.find(feature => feature.id === Number(feature_success));
    if (featureChosen)
      featureChosen = featureChosen.name;
  }
  res.render("roadmap", {
    roadmap: roadmap,
    feature_success,
    featureChosen
  });
})

router.post("/roadmapWaitlist", async function(req, res) {
  try {
    const { email, featureID } = req.body;
    await Q.roadmapWaitlist.insertOne(email, featureID);
    res.redirect("/roadmap?feature_success=" + featureID);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

router.get("/motivation", function(req, res) {
  res.render("motivation", {})
})

router.get("/terms", function(req, res) {
  res.render("termsOfService", {})
})

router.get("/privacy", function(req, res) {
  res.render("privacyPolicy", {})
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
