//http://stackoverflow.com/questions/11212715/control-start-position-and-duration-of-play-in-html5-video

//main-video
app.directive('mainVideo', function() {
  return {
    restrict: 'A',
    link: function($scope, mainVideo) {
      mainVideo.muted = true; //temporary
      
      mainVideo.on('loadeddata', function() {
        seekBar.min = 0;
        seekBar.max = mainVideo[0].duration;
        seekBar.value = mainVideo[0].currentTime;
        seekBar.seekValue = mainVideo[0].currentTime;
      });
      
      mainVideo.on('play', function() {
        $scope.playPause.html('Stop');
      }); 
      
      mainVideo.on('pause', function() {
        $scope.playPause.html('Play');
        
        // loop hack
        /*
        if(this.currentTime >= $scope.mainVideoDuration) {
          console.log('Video END');
          
          mainVideo[0].load();
          mainVideo[0].play();
        }
        */
      });
      
      mainVideo.on('seeking', function() {
        //console.log('seeking');
        
        //mainVideo.find('source')[0].src = mainVideo.initSrc;
        //mainVideo[0].load();
        
        //var cTime = this.currentTime;
        //var cTime = mainVideo[0].currentTime;
        var cTime = seekBar.value;
        console.log(cTime);
        $scope.getTheImgbyTime(cTime);     
      });
      
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
        
        /*
        console.log('firstImg ' + firstImg);
        console.log('resConImgs[0].dataset.ctime ' + resConImgs[0].dataset.ctime);
        console.log('condition ' + firstImg === resConImgs[0].dataset.ctime);
        */
        
        if(parseInt(resConImgs[0].dataset.ctime) === parseInt(firstImg)) {
          //SEEKING --- do not have to align the images
          console.log('SEEKING --- do not have to align the images');
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
        //$scope.getRisContainerFrames();
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

/*
* Helper for Resizing the container
*/
app.directive('resize', function($window) {
  return {
    link: function($scope) {
      angular.element($window).on('mouseup', function(e) {
        e.preventDefault();
        
        $scope.mouseBeforeX = null;
        $scope.mouseCanFrameSliderLeft = null;
        $scope.mouseCanFrameSliderRight = null;
        $scope.resizeMouseDownPosX = null;

        $scope.getRisContainerFrames();
      });
    }
  }
});

//play-pause
app.directive('playPause', function() {
  return {
    restrict: 'A',
    link: function($scope, playPause) {
      
      //var mainVideoEl = angular.element(document.querySelector('#mainVideo'))[0];
      
      playPause.on('click', function(e) {
        
        //console.log('state of video ' + mainVideo.paused);
        //console.log('state of mainVideoEl ' + mainVideoEl.paused);
        
        if(mainVideo.paused === true) {
          //console.log('play')
          mainVideo.play();
          playPause.html('Stop');
          
          //return;
        } else {
          //console.log('pause')
          mainVideo.pause();
          playPause.html('Play');
        }
        
      });
  
      
      $scope.playPause = playPause; 
    }
  }
});

//seek-bar
app.directive('seekBar', function() {
  return {
    restrict: 'A',
    link: function($scope, seekBar) {
      
      seekBar.on('change', function(e) {
        
        console.log(e);
        
        //console.log(mainVideo.initSrc);
        //mainVideo.find('source')[0].src = mainVideo.initSrc;
        //mainVideo[0].load();
        
        //var cTime = $scope.seekBarRange[0].value;
        //var cTime = seekBar.value;
        //$scope.getTheImgbyTime(cTime);
        
        //$scope.seekBarRange[0].max = $scope.fakeVideo.currentTime;
        
        //$scope.generateImgs();
      });
      
      $scope.seekBar = seekBar; 
    }
  }
});