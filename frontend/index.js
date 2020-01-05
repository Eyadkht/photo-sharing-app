//index.js
const express = require('express');
const app = express();
const cors = require('cors');
var favicon = require('serve-favicon');
app.use(cors());
app.use(favicon(__dirname + '/favicon.ico'));

app.set('port', process.env.PORT || 3000);




// Not using 
//var CloudStorage = require("gcs-signed-urls")("./google-services-private-key.pem"
//  , "photosharing-261420@appspot.gserviceaccount.com"
//  , "photo_app_bucket");
// CloudStorage.cors("cloud.xml")
// var uploadVars = CloudStorage.uploadRequest("example.jpeg", "key" + Date.now());

//Organiser Login
app.use('/', express.static('landing'));

//Google Cloud Storage details -> serve as API to AngularJs
app.get('/storage', function (req, res) {
  console.log(uploadVars); //provide them via API to your Frontend
  res.send({ cloud: uploadVars });
});


// Google cloud only works on 8080
app.listen(8081, () => {
  console.log('Express app started at port 8081');
});