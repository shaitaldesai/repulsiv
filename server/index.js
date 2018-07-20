// ref - https://developers.google.com/identity/sign-in/web/backend-auth
var express = require('express');
var bodyParser = require('body-parser');
var {OAuth2Client} = require('google-auth-library');
var cookieSession = require('cookie-session');
var cron = require('node-cron');
var utils = require('./utils.js')

var db = require('../database-mysql/connection.js')


try {
  var config = require('../config.js');
}
catch(e) {
  config = {
    CLIENT_ID: process.env.CLIENT_ID
  }
}
var CLIENT_ID = config.CLIENT_ID;
var client = new OAuth2Client(CLIENT_ID);
var port = process.env.PORT || 3000
var app = express();
app.use(express.static(__dirname + '/../react-client/dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'yecchy',
  keys: ['secret-to-sign-cookies'],
  maxAge: 60000
}))
  // ############ For debugging authentication  ##############
  // app.get('/invalid', (req, res) => {
  //   res.send('not valid session')
  // })
  // function restrict(req, res, next) {
  //   if (req.session.user) {
  //     next();
  //   } else {
  //     req.session.error = 'Access denied!';
  //     res.redirect('/invalid');
  //   }
  // }
  // app.get('/protected', restrict, (req, res) => {
  //   res.send('this is protected asset')
  // })
  // ############ ########################### ##############

  app.get('/products', (req, res) => {
    console.log('inside products')
    res.send('yayy - you are in products page')
  })
  app.post('/login', (req, res) => {
    var token = req.body.id_token;
    async function verify() {
      var ticket = await client.verifyIdToken({
          idToken: token,
          audience: CLIENT_ID,
      });
      var payload = ticket.getPayload();
      var userid = payload['sub'];
      console.log(userid);
      return userInfo = {
        uid: String(userid),
        email: payload['email'],
        username: payload['email']
      }
    }
    verify()
    // after tokenid is verified
    .then( (userInfo) => {

      console.log('LOGIN/USERINFO', userInfo);
      userInfo = {token: userInfo.userid, userName: userInfo.username, email: userInfo.email};
      // check if userid exists in db
      db.findUserId(userInfo.token, (err, result) => {
        if (result === null || (Array.isArray(result) && result.length === 0)) {
          // if not then insert the id in db
          db.insertUserId(userInfo, (err, result) => {
            console.log('Inside insertUser!');
            if (err) {
              console.log(err);
            } else {
              console.log('Inserted!')
            }
          })
        


      });
      // either case (user exist or no), create session (i.e. cookie) IF the user does not exist or expired.


      if (!req.session.user) {
          req.session.user = userInfo.token;
          res.end('created new session');
      }
      // if the session is valid (i.e. cookie) then just respond with a message to make the ajax request successful.
      if (req.session.user) {
        res.end('have a valid session');
      }

    })
    .catch(console.error);
  });
// Note this logout is terminating the session of this app and NOT the google session. This google sign-in api does not provide this functionality because of obvious reason and how single sign-on works.
app.get('/logout', (req, res) => {
  req.session = null;
  res.end('session ended')
})
// ********** testing helper functions in utils.js psedocode

app.get('/search', (req, res) => {
  // should simply fetch Walmart data using helper function in utils and respond back (no db interaction)
  console.log('in search get')
  utils.onRequestFetcher(req.query.productName, (err, matchedProducts) => {
    res.json(matchedProducts)
  })
})

app.post('/watchlist', (req, res) => {
  // 1- get the data from client {threshold: 22, product: {} }
  // 2- It then should add user infor to this data  (req.session.user) so we know which item is for which user
    // 3- save this data to the database

   var userWatchListData = req.body;
   userWatchListData.sub = req.session.user;
   // console.log('USERWATCHLISTDATA', userWatchListData);
   db.insertProduct(userWatchListData, function(err, result) {
    if (err) {
      console.log(err);
      res.status(500);
    } else {
      console.log('success!', result);
      // cron.schedule('0 0 */12 * * *', function(){
      // use Heroku Scheduler addon
      var task = cron.schedule('0 0 */12 * * *', function(){
        console.log('running a task every twelve hours');
        utils.routineFetcher(userWatchListData.productToWatch.itemId, (err, data) => {
          console.log('LOOKUP_DATA', data);
          userWatchListData.productToWatch.salePrice = data.salePrice;
          db.insertProduct(userWatchListData, (err, result) => {
            if (err) {
              console.log(err);
            } else {
              console.log('cronjob success!');
            }
          });
        });
      });
      task.start();
      res.status(201);
      res.end();
    }
   })

   // now save this data to products table
   res.send('successfully saved in db, if not send error ..')
})

app.get('/watchlist', (req, res) => {
  var token = req.session.user;
  console.log(token);
  db.findUserWatchList(token, (err, result) => {
    if (err) {
      res.status(500);
    } else {
      res.status(200);
      res.json(result);
    }
  });
  // should fetch Walmart data using helper function in utils
  // fetches the data from database produncts tabe (that we we saved in watchlist post request)
  // it should send only the data for the loggedin user
  // In response something like userWatchedProducts = db.findAll({where: sub/user: req.session.user})
    //res.end(userWatchedProducts)

})

app.delete('/watchedItem', (req, res) => {
  var item = req.body.itemId;
  console.log('ITEM TO REMOVE', item);
  var token = req.session.user;
  db.removeWatchedItem (55900742, token, (err, result) => {
    if (err) {
      res.status(500);
    } else {
      res.status(202);
      res.end();
    }
  });
});

app.listen(port, function() {
  console.log('listening on port  '+port);
});



