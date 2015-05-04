//http://stackoverflow.com/questions/11212715/control-start-position-and-duration-of-play-in-html5-video

//main-video
app.directive('mainVideo', function() {
  return {
    restrict: 'A',
    link: function($scope, mainVideo) {
      mainVideo.muted = true; //temporary
      mainVideo.initSrc = mainVideo.find('source')[0].src;
      
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
        /*
        console.log('seeking');
        console.log(mainVideo.initSrc);
        mainVideo.find('source')[0].src = mainVideo.initSrc;
        mainVideo[0].load();
        */
        
        var cTime = this.currentTime;
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
        
        
        if(parseInt(resConImgs[0].dataset.ctime) === parseInt(firstImg)) {
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
        
        //console.log(resConImgsArr[0])
        
        $scope.changeImgsBySeeker($scope.leftContainer , leftConImgsArr);
        $scope.changeImgsBySeeker($scope.resConImgs , resConImgsArr);
        $scope.changeImgsBySeeker($scope.rightContainer , rightConImgsArr);
        
      };
      
      $scope.changeImgsBySeeker = function(container, imgsArray) {
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