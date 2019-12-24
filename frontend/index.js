//index.js
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const router = express.Router();

app.set('port', process.env.PORT || 3000);

//Organiser Login
app.use('/', express.static('login'));


//app.get('/', function (req, res,next) {
//    res.redirect('/'); 
//   });

//app.use('/hi', express.static('adminDashboard'));

//Organiser Dashboard
app.get('/about',(req,res)=>{
   //res.status(200).send('About page');
   res.sendFile('adminDashboard.html',{root:__dirname+'/adminDashboard'});
});

//app.use(router);

//Binding to a port
app.listen(3000, ()=>{
  console.log('Express app started at port 3000');
});