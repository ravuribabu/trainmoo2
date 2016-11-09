// var p = new Promise(function(resolve, reject){
// 	setTimeout(function(){console.log('calling resolve'); resolve('Hello world'); }, 2000);
// });

// p.then(function(msg){return msg;})
//  .then(function(msg2) { console.log(msg2)});

// var p1 = new Promise(function(resolve, reject){ setTimeout(function(){console.log('DOne 1'); resolve('First')}, 2000)});
// var p2 = new Promise(function(resolve, reject){ setTimeout(function(){console.log('DOne 2'); resolve('second')}, 3000)});
// var p3 = new Promise(function(resolve, reject){ setTimeout(function(){console.log('DOne 3'); resolve('third')}, 1000)});

//  Promise.all([p1, p2, p3]).then(function(results){
//  	console.log(results);
//  });


var url = "https://www.youtube.com/watch?v=VEjQ0Pjv3NM&list=RDMMVEjQ0Pjv3NM"
var embed = url
.replace(/(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g, 'www.youtube.com/embed/$1')
.replace(/(?:http:\/\/)?(?:www\.)?(?:vimeo\.com)\/(.+)/g, '<iframe src="//player.vimeo.com/video/$1" width="200" height="100" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>')

console.log(embed);