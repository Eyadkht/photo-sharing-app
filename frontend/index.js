//index.js
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const router = express.Router();

app.set('port', process.env.PORT || 3000);

//Angularjs
app.use(express.static('login'));

app.get('/', function (req, res,next) {
    res.redirect('/'); 
   });

//Basic routes
router.get('/about',(request,response)=>{
   response.status(200).send('About page');
});

app.use(router);

//Binding to a port
app.listen(8080, ()=>{
  console.log('Express app started at port 3000');
});