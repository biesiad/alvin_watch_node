var fs = require('fs')
var twitter = require('twitter')
var oauthKeys = require('./oauth_keys')

var twitterClient = new twitter({
    consumer_key: oauthKeys.consumerKey,
    consumer_secret: oauthKeys.consumerSecret,
    access_token_key: oauthKeys.oauthToken,
    access_token_secret: oauthKeys.oauthTokenSecret
});

var sendMessage = function (moisture) {
  console.log("Sending... Moisture: " + moisture + "%")
  twitterClient.updateStatus("Moisture: " + moisture + "%", function () {})
}

var onMoistureUpdate = function (event, filename) {
  var data = fs.readFileSync(filename, 'utf8')
  var moisture = data === "" ? null : +data

  if (moisture !== null) {
    console.log("Updated " + oldMoisture + " -> " + moisture)

    if (moisture >= 0 && moisture <= 100 && Math.abs(oldMoisture - moisture) > 10) {
      sendMessage(moisture)
      oldMoisture = moisture
    }
  }
}

var moistureFile = "/home/pi/projects/RF24/RPi/RF24/examples/moisture.txt"
var oldMoisture = +fs.readFileSync(moistureFile, 'utf8')

console.log("Waiting for moisture updates... (" + oldMoisture + ")")
fs.watch(moistureFile, onMoistureUpdate)
