// // const Sequelize = require(‘sequelize’);
// try {

//   config = require(‘./config.js’)
// }


// catch(e) {
//   config = {
//     HOST    : process.env.CLEARDB_DATABASE_HOST,
//     USER    : process.env.CLEARDB_DATABASE_USER,
//     PASSWD  : process.env.CLEARDB_DATABASE_PASSWD,
//     DATABASE : process.env.CLEARDB_DATABASE,
//     CLIENT_ID: process.env.CLIENT_ID,
//     PORT: 3306
//   }
// }

// // to connect  mysql -u <username> -p -h us-cdbr-iron-east-04.cleardb.net

// try {
//   var sequelize = new Sequelize(config.DATABASE, config.USER, config.PASSWD, {
//   host: config.HOST,
//   dialect: ‘mysql’,
//   });

// }


// catch(e) {
//   console.log(e)
// }


////// JUST FOR TEST ---- for authentication part

// var mysql = require(‘mysql’);
// try {

//  config = require(‘./config.js’)
// }


// catch(e) {
//  config = {
//    HOST    : process.env.CLEARDB_DATABASE_HOST,
//    USER    : process.env.CLEARDB_DATABASE_USER,
//    PASSWD  : process.env.CLEARDB_DATABASE_PASSWD,
//    DATABASE : process.env.CLEARDB_DATABASE,
//    CLIENT_ID: process.env.CLIENT_ID,
//    PORT: 3306
//  }
// }
// var connection = mysql.createConnection({
//  host     : ‘localhost’,
//  socketPath: ‘/tmp/mysql.sock’,
//  user     : config.USER,
//  password : config.PASSWD,
//  database : config.DATABASE
// });

// connection.connect(function(err) {
//  if (err) {
//    console.error(‘error connecting: ’ + err.stack);
//    return;
//  }

//  console.log(‘connected as id ’ + connection.threadId);
// });

// var selectAll = function(callback) {
//  connection.query(‘SELECT * FROM users’, function(err, results, fields) {
//    if(err) {
//      callback(err, null);
//    } else {
//      callback(null, results);
//    }
//  });
// };


// var findUserId = function(userId, callback) {

//  connection.query(‘SELECT * FROM users WHERE userId = ?’, userId, function(err, results, fields) {
//    if (err) {
//      callback(err, null);
//    } else {
//      callback(null, results)
//    }
//  })
// }


// var insertUserId = function(userInfo, callback) {
//  // userInfo = {sub: 1221233223, email:‘abc@yahoo.com’, username:‘userABC’}
//  connection.query(‘INSERT INTO users SET ?’, userInfo, function(err, results, fields) {
//    if (err) {
//      callback(err, null);
//    } else {
//      callback(null, results)
//    }
//  })
// }

// var insertProduct = function(product, callback) {
//  var userToken = product.sub;

//  connection.query(‘SELECT id FROM users WHERE token = ’ + userToken, function(err, result) {
//    if (err) {
//      callback(err, null);
//    } else {

//    var productInfo  = {
//      itemId: product.productToWatch.itemId,
//      productName: product.productToWatch.name,
//      salesPrice: product.productToWatch.salesPrice,
//      threshHoldPrice: product.threshhold,
//      user_id: result
//    };

//    connection.query(‘INSERT INTO products SET ?’, productInfo, function(err, result, fields) {
//      if (err) {
//        callback(err, null);
//      } else {
//        callback(null, result);
//      }
//    })
//  }
//  })

// }

// module.exports = {
//  selectAll: selectAll,
//  findUserId: findUserId,
//  insertUserId: insertUserId,
//  insertProduct: insertProduct
// }

// ```// const Sequelize = require('sequelize');
// // try {

// //   config = require('./config.js')
// // }


// // catch(e) {
// //   config = {
// //     HOST    : process.env.CLEARDB_DATABASE_HOST,
// //     USER    : process.env.CLEARDB_DATABASE_USER,
// //     PASSWD  : process.env.CLEARDB_DATABASE_PASSWD,
// //     DATABASE : process.env.CLEARDB_DATABASE,
// //     CLIENT_ID: process.env.CLIENT_ID,
// //     PORT: 3306
// //   }
// // }

// // // to connect  mysql -u <username> -p -h us-cdbr-iron-east-04.cleardb.net

// // try {
// //   var sequelize = new Sequelize(config.DATABASE, config.USER, config.PASSWD, {
// //   host: config.HOST,
// //   dialect: 'mysql',
// //   });

// // }


// // catch(e) {
// //   console.log(e)
// // }


// ////// JUST FOR TEST ---- for authentication part

var mysql = require('mysql');
try {

  config = require('./config.js')
}


catch(e) {
  config = {
    HOST    : process.env.CLEARDB_DATABASE_HOST,
    USER    : process.env.CLEARDB_DATABASE_USER,
    PASSWD  : process.env.CLEARDB_DATABASE_PASSWD,
    DATABASE : process.env.CLEARDB_DATABASE,
    CLIENT_ID: process.env.CLIENT_ID,
    PORT: 3306
  }
}
var connection = mysql.createConnection({
  host     : 'localhost',
  socketPath: '/tmp/mysql.sock',
  user     : config.USER,
  password : config.PASSWD,
  database : config.DATABASE
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

var selectAll = function(callback) {
  connection.query('SELECT * FROM users', function(err, results, fields) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};


var findUserId = function(userId, callback) {

  connection.query('SELECT * FROM users WHERE token = ' + userId, function(err, results, fields) {
    if (err) {
      callback(err, null);
    } else {
      console.log('Login', results.length);
        callback(null, results);
    }
  })
}

var insertUserId = function(userInfo, callback) {
  // userInfo = {token: 1221233223, username:'userABC', email:'abc@yahoo.com'}
  // userInfo = {token: parseInt(userInfo.userid), userName: userInfo.username, email: userInfo.email};
  // console.log('LOGIN ROUTE', userInfo);

  connection.query('INSERT INTO users SET ?', userInfo, function(err, results, fields) {
    if (err) {
      callback(err, null);
    } else {
      console.log('signedup successfully!');
      callback(null, results);
    }
  })
}

var findUserWatchList = function (token, callback) {
  var queryString = 'select products.itemId, products.productName, products.salesPrice from products inner join users on products.user_id = users.id and users.token = token';
  connection.query(queryString, function (err, result, fields) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
}

var insertProduct = function(product, callback) {
  var userToken = product.sub;
  console.log('USERTOKEN',userToken);

  connection.query('SELECT id FROM `users` WHERE `token` = ' + userToken, function(err, result, fields) {
    if (err) {
      callback(err, null);
    } else {
    console.log('USER_ID:', result);
    var productInfo  = {
      itemId: product.productToWatch.itemId,
      productName: product.productToWatch.name,
      salesPrice: product.productToWatch.salePrice,
      threshHoldPrice: product.threshold,
      user_id: 1
    };
    console.log(result);
    connection.query('INSERT INTO products SET ?', productInfo, function(err, result, fields) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    })
  }
  })

}

var removeWatchedItem = function (itemId, token, callback) {
  var queryString = 'delete * from products where products.itemId = ' + itemId;
  connection.query(queryString, (err, result, fields) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  })
  
}

module.exports = {
  selectAll: selectAll,
  findUserId: findUserId,
  insertUserId: insertUserId,
  insertProduct: insertProduct,
  findUserWatchList: findUserWatchList,
  removeWatchedItem: removeWatchedItem 
}






