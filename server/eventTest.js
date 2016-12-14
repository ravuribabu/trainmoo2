'use strict';

const cache = require( "./app/appCache" ).cache;

var obj = { my: "Special", variable: 42 };
var success = cache.set( "myKey", obj, 10000 );

console.log(cache.get("myKey"));