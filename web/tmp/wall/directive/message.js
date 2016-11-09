define(['angular', '../wall', 'moment'], function(angular, wall, moment) {

	wall.directive('message', function(){
		return {
				restict : 'EA',
				scope: {
					msg : '=',
				},
				templateUrl: 'assets/js/wall/directive/message.html',
				controller: 'messageController'
		};
	});

	wall.directive('comment', function(){
		return {
				restict : 'EA',
				scope: {
					msg : '=',
				},
				templateUrl: 'assets/js/wall/directive/comment.html',
				controller: 'messageController'
		};
	});

	wall.directive('notification', function(){
		return {
				restict : 'EA',
				scope: {
					msg : '=',
				},
				templateUrl: 'assets/js/wall/directive/notification.html',
				controller: 'messageController'
		};
	});

	wall.directive('assignment', function(){
		return {
				restict : 'EA',
				scope: {
					msg : '=',
				},
				templateUrl: 'assets/js/wall/directive/assignment.html',
				controller: 'messageController'
		};
	});

	wall.directive('blog', function(){
		return {
				restict : 'EA',
				scope: {
					msg : '=',
				},
				templateUrl: 'assets/js/wall/directive/blog.html',
				controller: 'messageController'
		};
	});

	wall.filter('postTime', function(){
		return function(d) {
			var output;
			return moment(d).format('MMM DD h:mA');
		}
	});


	wall.filter('stripHtml',function() {
		return function strip(html)
				{
				   var tmp = document.createElement("DIV");
				   tmp.innerHTML = html;
				   var stripped = tmp.textContent || tmp.innerText || "";
				   return stripped.substring(1, 200) + '...';
				};
	} );

	wall.filter('listToString', function(){
		return function listToString(list){
			return _.join(list, ', ');
		}
	});

	wall.controller('messageController', function($scope, $uibModal, postFactory, $stateParams){

		$scope.userid = $stateParams.userid;

		init()
		function init(){
			
				postFactory.getReplies($scope.msg._id)
						.success(function(data){
							$scope.replies = data;
						})
						.error(function(err){
							console.log(err);
						});

		}

		$scope.like = function() {
			var alreadyLiked = _.find($scope.msg.likes, function(l) { return l.id === $scope.userid ;});

			if (!alreadyLiked) {
				$scope.msg.likes.push( {id: $scope.userid, name:'Rambabu Ravuri' } );
			}

			postFactory.likePost($scope.msg._id, $scope.userid)
					   .success(function(data){
					   	console.log(data);
					   })
					   .error(function(err){
					   	console.log(err);
					   });
		}

		$scope.showReplies = false;

		$scope.getFirstImageSrc = function(html){
			var div = document.createElement('div');
			div.innerHTML = html;
			var firstImage = div.getElementsByTagName('img')[0]
			var imgSrc = firstImage ? firstImage.src : "";
			return imgSrc;
		}


	    $scope.slickConfig= {

				method: {},

				dots: true,
				infinite: false,
				speed: 300,
				slidesToShow: 4,
				slidesToScroll: 1,
				arrows: true,
				responsive: [
				{
				  breakpoint: 1024,
				  settings: {
				    slidesToShow: 3,
				    slidesToScroll: 3,
				    infinite: true,
				    dots: true
				  }
				},
				{
				  breakpoint: 600,
				  settings: {
				    slidesToShow: 2,
				    slidesToScroll: 2
				  }
				},
				{
				  breakpoint: 480,
				  settings: {
				    slidesToShow: 1,
				    slidesToScroll: 1
				  }
				}
				]
		    };



		$scope.showCarousal = function (msg, file) {
		    var modalInstance = $uibModal.open({
		      animation: $scope.animationsEnabled,
		      templateUrl: 'myModalContent.html',
		      controller: function($scope, $location){ 
		      	$scope.msg = msg;
		      	$scope.file = file;
		      	var path = $location.$$protocol + "://" + $location.$$host + ":" + $location.$$port;
		      	$scope.pdfUrl = path + '/api/img/download/thumbnail/' + file.fileid ;
		      	console.log($scope.pdfUrl);
		      	$scope.ok = function(){$uibModalInstance.close();}
		      	$scope.cancel = function(){$uibModalInstance.dismiss();}
		      	$scope.pdfViewer = (file.type==='pdf');

		      	$scope.slickConfig= {
				      	method: {},
						dots: true,
						infinite: false,
						speed: 300,
						slidesToShow: 1,
						slidesToScroll: 1,
						arrows: true,
						responsive: [
						{
						  breakpoint: 1024,
						  settings: {
						    slidesToShow: 3,
						    slidesToScroll: 3,
						    infinite: true,
						    dots: true
						  }
						},
						{
						  breakpoint: 600,
						  settings: {
						    slidesToShow: 2,
						    slidesToScroll: 2
						  }
						},
						{
						  breakpoint: 480,
						  settings: {
						    slidesToShow: 1,
						    slidesToScroll: 1
						  }
						}
						]
						};




		      },
		      size: 'lg',
		      resolve: {
		    	
		      }
		    });

		    modalInstance.result.then(function () {
		      console.log('Modal oked at: ' + new Date());
		    }, function () {
		      console.log('Modal dismissed at: ' + new Date());
		    });
		  };



	});




});