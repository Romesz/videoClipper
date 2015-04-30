//http://stackoverflow.com/questions/11212715/control-start-position-and-duration-of-play-in-html5-video

//main-video
app.directive('mainVideo', function() {
  return {
    restrict: 'A',
    link: function($scope, mainVideo) {
      mainVideo.muted = true; //temporary
      
      //http://www.w3schools.com/tags/ref_av_dom.asp
      //http://gingertech.net/2009/08/19/jumping-to-time-offsets-in-videos/
     
      /*
      mainVideo.duration = 9;
      mainVideo.on('durationchange', function(e) {
       console.log('duration change ' + this.duration);
      });
      */
      /*
      mainVideo.on('loadedmetadata', function(e) {
       this.currentTime = 7;
       this.duration = 9;
       console.log(this.currentTime);
       console.log(this.duration);
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