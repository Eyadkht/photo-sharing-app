//index.js
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const router = express.Router();

app.set('port', process.env.PORT || 3000);

var CloudStorage = require("gcs-signed-urls")("./google-services-private-key.pem"
  , "photosharing-261420@appspot.gserviceaccount.com"
  , "photo_app_bucket");

console.log(CloudStorage)

var uploadVars = CloudStorage.uploadRequest("example.jpeg", "key" + Date.now()); // TODO: maybe provide configurable parameters instead of hardcoding them


//Organiser Login
app.use('/', express.static('login'));

//Google Cloud Storage details -> serve as API to AngularJs
app.get('/storage', function (req, res) {
  console.log(uploadVars); //provide them via API to your Frontend
  res.send({ cloud: uploadVars });
});

//app.use(router);

//Binding to a port
app.listen(3000, () => {
  console.log('Express app started at port 3000');
});