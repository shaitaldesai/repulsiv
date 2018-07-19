var request = require('request');

const Request = require('request');
const config = require('./config.js')

module.exports = {
  routineFetcher: function(itemId, callback) {
    // calls
    // this function is invoked by cron job
    // it calls Walmart API (endpoint: v1/items/id) with the itemId and fetches price
    // it then
      // 1- augments this price data with other pieces itemId, userId(sub), time(when fetched)
      // 2- writes to db as: price, itemId, userId(sub), time(when fetched)
    // exg: http://api.walmartlabs.com/v1/items/10789576?format=json&apiKey=<api_key>


    let uri = 'http://api.walmartlabs.com/';
    let endpoint = 'v1/items';
    let query = '/'+ itemId + '?format=json&apiKey=' + config.WALMART_APIKEY;
    let url = uri + endpoint + query

    Request.get(url, (err, response, body) => {
      if (!err && response.statusCode === 200) {
        var product = JSON.parse(body)
        callback(product)
      }
    })
  },


  onRequestFetcher: (productName, callback) => {
    // calls Walmart Search API (v1/search) with the productName
    // returns back to client // no need to save
    // exg: http://api.walmartlabs.com/v1/search?query=ipod&format=json&apiKey=<api_key>

    let uri = 'http://api.walmartlabs.com/';
    let endpoint = 'v1/search';
    let query = '?query='+ productName + '&format=json&apiKey=' + config.WALMART_APIKEY;
    let url = uri + endpoint + query

    // by default it sorts with 'relevance' and returns only 10 items (numItems=10)
    Request.get(url, function(err, response, body) {
      if (!err && response.statusCode === 200) {
        var products = JSON.parse(body)
        // products.items is an array of items
        callback(products.items)
      }
    })
  }
}