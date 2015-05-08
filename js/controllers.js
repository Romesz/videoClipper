// http://stackoverflow.com/questions/15165991/uncaught-typeerror-type-error-with-drawimage
(function () {
app.controller('videoCtrl', ['$scope', '$interval', function ($scope, $interval) {
  
  $scope.playPauseButton = angular.element(document.querySelector('#playPause'));
  $scope.seekBarRange = angular.element(document.querySelector('#seekBar')); 
 
  $scope.mainVideoDuration = null;
 
  var fakeVideo = document.getElementById('fakeVideo');
  fakeVideo.muted = true;
  fakeVideo.playbackRate = 4.0;
  fakeVideo.loop = false;
  
  var imageSilder = angular.element(document.querySelector('#imageSilder'));
  var resizableContainer = angular.element(document.querySelector('#resizableContainer'));
  var rightContainer = angular.element(document.querySelector('#rightContainer'));
  var leftContainer = angular.element(document.querySelector('#leftContainer'));
  
  $scope.imageSilder = imageSilder;
  $scope.resizableContainer = resizableContainer;
  $scope.rightContainer = rightContainer;
  $scope.leftContainer = leftContainer;

  $scope.canvas = document.getElementById('canvas');
  $scope.context = $scope.canvas.getContext('2d');
  
  $scope.imgArr  = new Array();
  $scope.counter = 0;
  $scope.intervalFirstPhase = null;
  $scope.intervalSecondPhase = null;

  var isWidth = imageSilder[0].clientWidth;
  var rescWidth = Math.round(resizableContainer[0].clientWidth / 100);
 
  fakeVideo.addEventListener('play', function(e) {
   
    $scope.videoHalfTime = parseInt(fakeVideo.duration / 2);
    //console.log('videoHalfTime ' + $scope.videoHalfTime);
   
    $scope.intervalFirstPhase = $interval(function() {
     
      if($scope.imgArr.length === 12) {
        $scope.getRisContainerFrames();
      }
     
      //console.log('fakeVideo.currentTime ' + fakeVideo.currentTime);
     
      //if($scope.imgArr.length <= 18) {
      if(parseInt(fakeVideo.currentTime) < parseInt($scope.videoHalfTime)) {
        $scope.saveImgToArray($scope.context, fakeVideo, $scope.canvas);
        $scope.createImgTags($scope.counter, e.target.currentTime);
        $scope.counter++;
      } else {
        fakeVideo.pause();
        $interval.cancel($scope.intervalFirstPhase);
        $scope.intervalFirstPhase = undefined;
       
        //console.log($scope.imgArr.length);
        console.log('FIRSTPHASE - generation end');
      }
     
     
     /*
      if($scope.imgArr.length === 12) {
        $scope.getRisContainerFrames();
      } else if($scope.imgArr.length === 18) {
        fakeVideo.pause();
        $interval.cancel($scope.intervalFirstPhase);
        $scope.intervalFirstPhase = null;
       
        console.log($scope.imgArr.length);
        console.log('FIRSTPHASE - generation end');
       
        //return;
      } else {
        $scope.saveImgToArray($scope.context, fakeVideo, $scope.canvas);
        $scope.createImgTags($scope.counter, e.target.currentTime);
        $scope.counter++;
      }
      */

    }, 100);
   
  }, false);
  // this does not work in the angular way... fakeVideo.on('play', function(e) {
  // I got an error about the canvas context drawImage does not defined.
 
  $scope.generateImgs = function() {
   if($scope.intervalFirstPhase !== undefined) {
     console.log('return')
     return;
   }
    
   $scope.videoHalfTime += 5;
   console.log('$scope.videoHalfTime: ' + $scope.videoHalfTime);
   
   $scope.intervalSecondPhase = $interval(function() {
    
     //console.log('fakeVideo.currentTime: ' + fakeVideo.currentTime);
    
     if($scope.videoHalfTime < fakeVideo.currentTime || parseInt(fakeVideo.currentTime) == 0) {
      
       fakeVideo.pause();
       $interval.cancel($scope.intervalSecondPhase);
       $scope.intervalSecondPhase = null;
       console.log('SECONDPHASE - generation end');
     } else {
      
       //console.log('add ' + fakeVideo.currentTime);
       fakeVideo.play();

       $scope.saveImgToArray($scope.context, fakeVideo, $scope.canvas);
       $scope.createImgTags($scope.counter, fakeVideo.currentTime);
       $scope.counter++;  
     }
   }, 100);
  };
  
  function goLeft() {
    var lcImgs = leftContainer.find('img');
    var lcImglast = null;
    
    
    if(lcImgs.length <= 0) {
      console.log('LEFT - no elem');
      return;
    }
   
    for(var i = lcImgs.length; i > 0  ; i--) {
      lcImglast = lcImgs[i - 1];
      break;
    }
   
    resizableContainer[0].insertBefore(lcImglast, resizableContainer[0].firstChild);


    var rcImgs = resizableContainer.find('img');
    var rcImglast = null;


    for(var i = rcImgs.length; i > 0  ; i--) {
      rcImglast = rcImgs[i - 1];
      break;
    }
    rightContainer[0].insertBefore(rcImglast, rightContainer[0].firstChild);
  };

  function goRight() {
    var rescImgs = resizableContainer.find('img');
    var rescImgFirst = null;

    for(var i in rescImgs) {
      rescImgFirst = rescImgs[i];
      break;
    }
   
    try {
      leftContainer[0].appendChild(rescImgFirst);

    } catch(e) {
      console.log(e);
    }

    $scope.scrollToImg();

    var rcImgs = rightContainer.find('img');
    var rcImgFirst = null;
   
    for(var i in rcImgs) {
      rcImgFirst = rcImgs[i];
      break;
    }
   
    try {
      resizableContainer[0].appendChild(rcImgFirst);
    } catch(e) {
      console.log(e);
    }
  };

  var mouseBeforeX = null;

  $scope.sliderMouseDown = function(e) {
    e.preventDefault();
   
    var mouseDownPosX = e.clientX;
    var resContainerOffsetLeft = resizableContainer[0].offsetLeft;
    var resContainerOffsetRight = resContainerOffsetLeft + resizableContainer[0].offsetWidth;

    if(mouseDownPosX < resContainerOffsetLeft + 15) {
      // right res
      console.log('left res');
     
     
      return;
    }   
   
    if(mouseDownPosX > resContainerOffsetRight - 15) {
      // left res
      console.log('right res'); 
      return;
    }
   
   
   
    mouseBeforeX = true;
   
    var rcImgs = rightContainer.find('img');
    var rcImgsLen = rcImgs.length;
    var rcImgCtime = rcImgs[rcImgsLen - 1].dataset.ctime;
    $scope.clickedImgCtime = rcImgCtime;
   
    $scope.generateImgs();
   

    $scope.mainVideo[0].pause();
  };

  $scope.sliderMouseUp = function(e) {
    e.preventDefault();
   
    mouseBeforeX = null;
  };

  $scope.sliderMove = function(e) {
    e.preventDefault();

   
    // TODO: resizer
    // Min width 3 pic
    // Max width 10 pic
    // Get the nearest picture and align it
    // Put the cropped pictures to the other 2 contaiers
   
    if(mouseBeforeX === null)
      return;

    var x = e.clientX;

    if(x < mouseBeforeX) {
      if(rightContainer.find('img').length < 4) {
       console.log('RIGHT - no elem');
       return;
      }
     
      goRight();
    } else {
      goLeft();
    }
    mouseBeforeX = x;


    //var getCurrentImgTime = resizableContainer.find('img').attr('data-ctime');
    //$scope.mainVideo.currentTime = getCurrentImgTime;

    $scope.hidePictures();
    $scope.getRisContainerFrames();
    //$scope.mainVideo[0].play();
  };

  
  $scope.saveImgToArray = function(context, video, thecanvas) {
    try {
      context.drawImage(video, 0, 0, thecanvas.width, thecanvas.height);
      var dataURL = thecanvas.toDataURL();
      //.setAttribute('crossOrigin', 'anonymous');
      // http://stackoverflow.com/questions/20424279/canvas-todataurl-securityerror
    } catch(e) {
      console.log(e);
    }
    $scope.imgArr.push(dataURL);
  };
  
  $scope.createImgTags = function(counter, cTime) {
      if(cTime === 0)
         return;
   
      var imgTag = document.createElement('IMG');
      imgTag.src = $scope.imgArr[counter];
      imgTag.id = 'img' + $scope.counter;
      imgTag.dataset.ctime = cTime;

      if(counter < 3) {
        leftContainer[0].appendChild(imgTag);
      } else if(counter < 11) {
        resizableContainer[0].appendChild(imgTag);
      } else {
        rightContainer[0].appendChild(imgTag);
      }
  };
  
  $scope.scrollToImg = function() {
    var imgs = leftContainer.find('img');
    var imgsLen = imgs.length; 
    var imgLast = null;

    for(var i = imgsLen; i > 0  ; i--) {
      imgLast = imgs[i - 1];
      break;
    }

    if(imgLast !== null) {
      $('#leftContainer').scrollTop($('#' + imgLast.id).offset().top);
    }
  };
  
  $scope.hidePictures = function() {
    var leftImgs = leftContainer.find('img');
    var leftImgsLen = leftContainer.find('img').length;
    if(leftImgsLen >= 3) {
      leftImgs.css('display', 'none');
      leftImgs[leftImgsLen - 1].style.display = 'inline-block';
      leftImgs[leftImgsLen - 2].style.display = 'inline-block';
      leftImgs[leftImgsLen - 3].style.display = 'inline-block';
    }    
   
    var rightImgs = rightContainer.find('img');
    var rightImgsLen = rightContainer.find('img').length;
    if(rightImgsLen >= 3) {
      rightImgs.css('display', 'none');
      rightImgs[0].style.display = 'inline-block';
      rightImgs[1].style.display = 'inline-block';
      rightImgs[2].style.display = 'inline-block';
    }
  };
 
  $scope.getRisContainerFrames = function() {

    var getResCImgs = resizableContainer.find('img');
    var getResCImgsLen = getResCImgs.length;
    var getResCImgFirst = getResCImgs[0].dataset.ctime;
    var getResCImgLast = null;

    getResCImgs.css('display', 'inline-block');
   
    for(var i = getResCImgsLen; i > 0  ; i--) {
      getResCImgLast = getResCImgs[i - 1];
      break;
    }

    var getResCImgLast = getResCImgLast.dataset.ctime;
   
    $scope.addShortVideo(getResCImgFirst, getResCImgLast);
  };
 
  $scope.addShortVideo = function(currentTime, duration) {
    var videoSrc = $scope.mainVideo.find('source')[0].src;
    var cutBy = videoSrc.indexOf('#t=');
    var srcCutTime = null;
    if(cutBy > 0) {
      srcCutTime =  videoSrc.substr(0, cutBy); 
    }
    if(srcCutTime === null) {
      srcCutTime = videoSrc;
    }
   
    $scope.mainVideo.find('source')[0].src = srcCutTime + '#t=' + currentTime + ',' + duration;
   
    $scope.mainVideoDuration = duration;
   
    $scope.seekBarRange[0].value = currentTime;
   
    $scope.mainVideo[0].load();
  };

}]); 
 
})();