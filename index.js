var fs = require('fs')
var watch = require('watch')
var twitter = require('twitter')
var oauthKeys = require('./oauth_keys')

var twitterClient = new twitter({
    consumer_key: oauthKeys.consumerKey,
    consumer_secret: oauthKeys.consumerSecret,
    access_token_key: oauthKeys.oauthToken,
    access_token_secret: oauthKeys.oauthTokenSecret
});

var sendMessage = function (moisture) {
  console.log("Moisture: " + moisture)
  twitterClient.updateStatus('Test tweet from node-twitter/' + twitter.VERSION)
}

// var moistureFile = "/home/pi/projects/RF24/RPi/RF24/examples/"
var moistureFile = "moisture.txt"
var moistureFilePath = "./"

var readMoisture = function (file) {
  return fs.readFileSync(file, 'utf8')
}

watch.createMonitor(moistureFilePath, function (monitor) {
  var oldMoisture = null;

  monitor.files[moistureFile]

  monitor.on("changed", function (file, current, previous) {
    oldMoisture = oldMoisture || readMoisture(file)

    var moisture = readMoisture(file)
    if (Math.abs(moisture - oldMoisture) > 10) {
      sendMessage(moisture)
      oldMoisture = moisture
    }
  })
})
