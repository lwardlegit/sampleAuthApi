const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const data = require('../data/userdata')
const cors = require('cors')

var md5 = require('md5');
var whitelist = ['http://localhost:8080'];
var corsOptions = {
  origin: function(origin, callback){
      var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
      callback(null, originIsWhitelisted);
  },
  credentials: true
};

app.options('*', cors(corsOptions)); // include before other routes


var bodyParser = require('body-parser')
app.use( bodyParser.json() );    
app.use(express.urlencoded({ extended: true }))
app.use(express.json());  
app.use(express.urlencoded()); 

var TokenGenerator = require( 'token-generator' )({
 salt: '#fgr$d0S',
  timestampMap: 'abcdefghij', // 10 chars array for obfuscation proposes
});


 
/*
at the route '/login' we want to:
1. receive the users login info in the request body (notice this is a POST route so they can post data to us)
2. we want to verify that their hash matches what's in our database (in this case whats in the json object because im lazy)
3. we want to make a token for them
4. we want to send back a token that represents the session, the users browser will store this token as a cookie
*/

 app.post('/login',  function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");

  let users = data.users
  var user= req.body.username
  var password= req.body.password

  //verify users password with the hash inside of userdata.json
  //lets assume in this case that usersdata.json is actually some kind of database like mongodb
  let x = 0
  for(x in users){
    console.log('compare username info',users[x].username, user)
    if(users[x].username == user){
     

      if(md5(password) == users[x].password){
        var token = TokenGenerator.generate();
        res.send({message:'login successful',token: token})
      }
    }
    x +=1
  }
  res.send({message:'incorrect username or password'})   
})

app.listen(port, () =>{
    console.log(`server listening on PORT ${port}`)
})
