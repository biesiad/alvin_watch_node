var fs = require('fs')
var watch = require('watch')
var twitter = require('twitter')


// var getMoisture = function () {}

// var oldMoisture = getMoisture()


var consumerKey = "qAKoNq4H3Rp2RBvx01qihs27U"
var consumerSecret = "JDDX0jXTSuAtuSRwuMFnLAeUgnM7jGhhGIS4PbSZv8ltKI1N7L"
var oauthToken = "2754082412-chvSMcD0HvkxKQkgwry30LunteYPwcdMa9TnobO"
var oauthTokenSecret = "Fj4eGknD35pLlWtKgnbX8pEziQR9sdcvev9cGmpwc26Rw"

var twitterClient = new twitter({
    consumer_key: consumerKey,
    consumer_secret: consumerSecret,
    access_token_key: oauthToken,
    access_token_secret: oauthTokenSecret
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
