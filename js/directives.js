//main-video
app.directive('mainVideo', function() {
  return {
    restrict: 'A',
    link: function($scope, mainVideo) {
      mainVideo.muted = true; //temporary
      
      mainVideo.on('play', function(e) {
        //mainVideo.currentTime = fakeVideo.currentTime;
        // get the value of the silder;
      });
      mainVideo.on('seeking', function(e) {
        //
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
      fakeVideo.muted = true;
      fakeVideo.playbackRate = 4.0;
      
      fakeVideo.on('play', function(e) {
        
        $scope.interval = $interval(function() {
          if($scope.imgArr.length === 12) {
            $scope.getRisContainerFrames();
          }

          if($scope.imgArr.length >= 30) {
            fakeVideo[0].pause();
            $interval.cancel($scope.interval);
            $scope.interval = null;
          }
         
          $scope.fakeVideo[0].onload = function() {
            $scope.saveImgToArray($scope.context, fakeVideo, $scope.canvas);
            $scope.createImgTags($scope.counter, e.target.currentTime);
            $scope.counter++;
            
            console.log('asdads');
          }

        }, 150);
      });
      
      $scope.fakeVideo = fakeVideo;
      
    }
  }
});