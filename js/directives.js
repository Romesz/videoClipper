//http://stackoverflow.com/questions/11212715/control-start-position-and-duration-of-play-in-html5-video

//main-video
app.directive('mainVideo', function() {
  return {
    restrict: 'A',
    link: function($scope, mainVideo) {
      mainVideo.muted = true; //temporary
      
      /*
      mainVideo.on('loadedmetadata', function(e) {
       videoStartTime = 7;
       durationTime = 9;
       this.currentTime = videoStartTime;
       this.duration = durationTime;
      });
      */
      
      mainVideo.on('play', function(e) {
        
      });
      mainVideo.on('seeking', function(e) {
        // get current time
        // look for the img 
      });
      
      $scope.mainVideo = mainVideo;
      
    }
  }
});

//fake-video
app.directive('fakeVideo', function($interval) {
  return {
    restrict: 'A',
    link: function($scope, fakeVideo) {
      /*
      fakeVideo.muted = true;
      fakeVideo.playbackRate = 4.0;
      
      console.log($scope)
      
      $scope.initVideo = function() {
      
        console.log('init');
      };
      
        
      fakeVideo.on('play', function(e) {

        //$scope.interval = $interval(function() {
          if($scope.imgArr.length === 12) {
            $scope.getRisContainerFrames();
          }

          if($scope.imgArr.length >= 30) {
            fakeVideo[0].pause();
            $interval.cancel($scope.interval);
            $scope.interval = null;
          }



          //fakeVideo[0].onload = function() {


              var canvas = document.getElementById('canvas');
              var context = canvas.getContext('2d');

            $scope.saveImgToArray(context, fakeVideo, canvas);
            //$scope.saveImgToArray($scope.context, fakeVideo, $scope.canvas);
            $scope.createImgTags($scope.counter, e.target.currentTime);
            $scope.counter++;

        //}, 150000);
      });
      */
      $scope.fakeVideo = fakeVideo;
      
    }
  }
});