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


// var url = "https://www.youtube.com/watch?v=VEjQ0Pjv3NM&list=RDMMVEjQ0Pjv3NM"
// var embed = url
// .replace(/(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g, 'www.youtube.com/embed/$1')
// .replace(/(?:http:\/\/)?(?:www\.)?(?:vimeo\.com)\/(.+)/g, '<iframe src="//player.vimeo.com/video/$1" width="200" height="100" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>')

// console.log(embed);

'use strict';

var moment = require('moment');


//WEEK
var start = moment().add(-34, 'days').hour(9).minute(0);
var end = moment().add(30, 'days').hour(9).minute(0);

// var dayno = {
// 	'sunday' : 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4, 'friday': 5, 'saturday': 6
// };

// var days = ['monday', 'wednesday', 'friday'];
// var every = 1;

// console.log('START: ' + start.format('MM/DD/YYYY') + ', END: ' + end.format('MM/DD/YYYY'));

// var currDate = start.clone().startOf('week');

// var weeks = [];
// while (currDate.diff(end) <= 0) {

// 	const startOfWeek = currDate.clone().startOf('week');
// 	const endOfWeek = currDate.clone().endOf('week');
// 	weeks.push({ start: startOfWeek, curr: currDate.clone(), end: endOfWeek })

// 	currDate.add(7, 'days');

// }

// var eventDays = [];

// weeks.map((w, i) => {
// 	if (i%every == 0){
// 		days.map((d) => {
// 			const eventDay = w.start.clone().add(dayno[d], 'days');
// 			if (eventDay.isBetween(start, end, null, '[]')){
// 						eventDays.push(eventDay);
// 			}
// 		});
// 	}
// });


//MONTH
var dayno = {
	'sunday' : 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4, 'friday': 5, 'saturday': 6
};

var days = [1, 5, 10];
var every = 1;
var endAfter = 7;

var seq = "first"; //first, second, third, fourth, last
var day = "wednesday"; //monday - friday, day, weekday, weekend, 

console.log('START: ' + start.format('MM.DD.YYYY') + ', END: ' + end.format('MM.DD.YYYY'));

var currDate = start.clone().startOf('month');

var months = [];
while (currDate.diff(end) <= 0) {

	const startOfMonth = currDate.clone().startOf('month');
	const endOfMonth = currDate.clone().endOf('month');
	months.push({ start: startOfMonth, curr: currDate.clone(), end: endOfMonth })

	currDate.add(1, 'months');

}

var eventDays = [];

months.forEach((w, i) => {
	console.log( w.start.format('MM.DD.YYYY') + ' - ' + w.end.format('MM.DD.YYYY') );
	if (i%every == 0){
		days.forEach((d) => {
			const eventDay = w.start.clone().add(d - 1, 'days');
			if (eventDay.isBetween(start, end, null, '[]')){
						eventDays.push(eventDay);
			}
		});
	}
});

if (endAfter) {
	eventDays = eventDays.slice(0, endAfter);
}

eventDays.forEach((e) => console.log(e.format('MM.DD.YYYY')));


