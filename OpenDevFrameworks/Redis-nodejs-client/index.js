var redis = require("redis");

const HOSTNAME='mineducdemo.redis.cache.windows.net';
const KEY='VCpHs3Yy+dg0i0OYS8hK3BdFgrDWD4BFg6gpRM9GUIY=';
const PORT=6380;


  // Add your cache name and access key.
var cliente = redis.createClient(PORT,HOSTNAME, {auth_pass: KEY, tls: {servername: HOSTNAME}});

cliente.set("llave1", "valor1", function(err, reply) {
        console.log(reply);
    });

cliente.get("llave1",  function(err, reply) {
        console.log(reply);
    });