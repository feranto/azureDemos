const restify = require('restify');
const server = restify.createServer();

const mongoose = require('mongoose');
const DBHOST = process.env.MONGOURI;
const DBUSERNAME = process.env.MONGOUSER;
const DBPASSWORD = encodeURIComponent(process.env.MONGOPASSWORD);
const DBPORT = process.env.MONGOPORT;
const DBOPTIONS = process.env.MONGOOPTIONS;
const DBURI = `mongodb://${DBUSERNAME}:${DBPASSWORD}@${DBHOST}:${DBPORT}/flights${DBOPTIONS}`

const options = {
  useNewUrlParser: true,
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};

mongoose.connect(DBURI, options, function(err){
  if(err) console.log(err);
});

const Schema = mongoose.Schema;

const flightSchema = new Schema({
  "FL_DAT":  String,
  "AIRLINE_ID": String,
  "FL_NUM":   String,
  "ORIGIN_AIRPORT_ID": String,
  "ORIGIN_CITY_MARKET_ID": String,
  "DEST_AIRPORT_ID": String,
  "DEST_AIRPORT_SEQ_ID": String,
  "DEST_CITY_MARKET_ID": String,
  "CRS_DEP_TIME": String,
  "DEP_TIME": String,
  "DEP_DELAY": String,
  "CANCELLED": String
});

const Flight = mongoose.model('Flights2', flightSchema);

server.get('/', function(req, res, next) {
  Flight.findOne().then(
    function(flight){
      res.json(flight);
      next();
    })
    .catch(function(err){
      console.log("err");
      res.json(err);
      next();
    });
});

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
