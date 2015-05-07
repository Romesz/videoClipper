//http://stackoverflow.com/questions/11212715/control-start-position-and-duration-of-play-in-html5-video

//main-video
app.directive('mainVideo', function() {
  return {
    restrict: 'A',
    link: function($scope, mainVideo) {
      mainVideo.muted = true; //temporary
      mainVideo.initSrc = mainVideo.find('source')[0].src;
      
      mainVideo.on('loadeddata', function(e) {
        $scope.seekBarRange[0].min = 0;
        $scope.seekBarRange[0].max = mainVideo[0].duration;
        $scope.seekBarRange[0].value = mainVideo[0].currentTime;
        //$scope.seekValue = mainVideo[0].currentTime;
        console.log('currentTime ' + mainVideo[0].currentTime)
      });
      
      mainVideo.on('play', function(e) {
        $scope.playPauseButton.html('Stop');
      }); 
      
      mainVideo.on('pause', function(e) {
        $scope.playPauseButton.html('Play');
        
        // loop hack
        if(this.currentTime >= $scope.mainVideoDuration) {
          console.log('Video END');
          
          mainVideo[0].load();
          mainVideo[0].play();
        }
      });
      
      mainVideo.on('seeking', function(e) {
        //console.log(mainVideo.initSrc);
        //mainVideo.find('source')[0].src = mainVideo.initSrc;
        //mainVideo[0].load();
        
        var cTime = this.currentTime;
        $scope.getTheImgbyTime(cTime);
        
        $scope.generateImgs();     
      });
      
      $scope.playMainVideo = function(e) {
        if(mainVideo[0].paused) {
          mainVideo[0].play();
          $scope.playPauseButton.html('Stop');
        } else {
          mainVideo[0].pause();
          $scope.playPauseButton.html('Play');
        }
      };
      
      $scope.seekMainVideo = function() {
        //console.log('seeking');
        
        //console.log(mainVideo.initSrc);
        //mainVideo.find('source')[0].src = mainVideo.initSrc;
        //mainVideo[0].load();
        
        var cTime = $scope.seekBarRange[0].value;
        $scope.getTheImgbyTime(cTime);
        
        $scope.generateImgs();
      };
      
      $scope.mainVideo = mainVideo;
      
      
      $scope.getTheImgbyTime = function(time) {
        var sliderImgs = $scope.imageSilder.find('img');
        var sliderImgsLen = sliderImgs.length;
        var resConFirstImg = null;
        
        for(var i = 0 ; i < sliderImgsLen ; i++) {
          if(parseInt(time) === parseInt(sliderImgs[i].dataset.ctime)) {
            resConFirstImg = sliderImgs[i].dataset.ctime;
            break;
          }
        }
        
        if(resConFirstImg !== null) {
          $scope.aligSliderByCtimeImg(resConFirstImg);
        }
      };
      
      $scope.aligSliderByCtimeImg = function(firstImg) {
        var sliderImgs = $scope.imageSilder.find('img');
        var resConImgs = $scope.resizableContainer.find('img');
        var rightConImgs = $scope.rightContainer.find('img');
        var leftConImgs = $scope.leftContainer.find('img');
        
        
        if(parseInt(resConImgs[0].dataset.ctime) === parseInt(firstImg)) {
          //SEEKING --- do not have to align the images
          return;
        }
        
        var sliderImgsLen = sliderImgs.length;
        var resConCounter = 0;
        var sliderImgsArr = [];
        var resConImgsArr = [];
        var leftConImgsArr = [];
        var rightConImgsArr = [];
        
        for(var i = 0 ; i < sliderImgsLen ; i++) {
          if(parseInt(firstImg) > parseInt(sliderImgs[i].dataset.ctime)) {
            //console.log('leftCon: ' + sliderImgs[i].dataset.ctime);
            leftConImgsArr.push(sliderImgs[i]); 
            
          } else if(parseInt(firstImg) <= parseInt(sliderImgs[i].dataset.ctime)) {
            if(resConCounter < 8) {
              //console.log('resCon: ' + sliderImgs[i].dataset.ctime);
              resConImgsArr.push(sliderImgs[i]);
              
            } else {
              //console.log('rightCon: ' + sliderImgs[i].dataset.ctime);
              rightConImgsArr.push(sliderImgs[i]);
            }
            resConCounter++;
          } 
        }
        
        $scope.changeImgsBySeeker($scope.leftContainer , leftConImgsArr);
        $scope.changeImgsBySeeker($scope.resizableContainer , resConImgsArr);
        $scope.changeImgsBySeeker($scope.rightContainer , rightConImgsArr);
        
        $scope.hidePictures();
        $scope.getRisContainerFrames();
      };
      
      $scope.changeImgsBySeeker = function(container, imgsArray) {
        
        if(container.length > 0)
          container.find('img').remove();
        
        var imgArrayLen = imgsArray.length;
        
        for(var i = 0 ; i < imgArrayLen ; i++) {
          container[0].appendChild(imgsArray[i]);
        }
        
      };
    }
  }
});

//fake-video
/*
app.directive('fakeVideo', function($interval) {
  return {
    restrict: 'A',
    link: function($scope, fakeVideo) {

      $scope.fakeVideo = fakeVideo; 
    }
  }
});
*/