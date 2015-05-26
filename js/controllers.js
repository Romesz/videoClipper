// http://stackoverflow.com/questions/15165991/uncaught-typeerror-type-error-with-drawimage
/*
  * TODO:
  *
  * play/stop button issue !!
  * Range issue !!!
  * Design play pause button and range !
  * Browser Test !
  
  * [! is priority, more means higher]
*/


(function () {
app.controller('videoCtrl', ['$scope', '$interval', function ($scope, $interval) {
 
  $scope.mainVideoDuration = null;
 
  var fakeVideo = document.getElementById('fakeVideo');
  fakeVideo.muted = true;
  //fakeVideo.playbackRate = 4.0;
  fakeVideo.loop = false;
  $scope.fakeVideo = fakeVideo;
  
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
 
  var videoHalfTime = 0;
  var videoHalfTimeExtend = 0;
 
  fakeVideo.addEventListener('play', function(e) {
   
    //videoHalfTime = parseInt(fakeVideo.duration / 2);
    videoHalfTime = parseInt(fakeVideo.duration);
   
    $scope.intervalFirstPhase = $interval(function() {
     
      if($scope.imgArr.length === 12) {
        $scope.getRisContainerFrames();
      }
     
      //console.log('fakeVideo.currentTime ' + fakeVideo.currentTime);
     
      if(parseInt(fakeVideo.currentTime) < videoHalfTime) {
        $scope.saveImgToArray($scope.context, fakeVideo, $scope.canvas);
        $scope.createImgTags($scope.counter, e.target.currentTime);
        $scope.counter++;
      } else {
        fakeVideo.pause();
        $interval.cancel($scope.intervalFirstPhase);
        $scope.intervalFirstPhase = null;
       
        videoHalfTimeExtend = videoHalfTime;
       
        //console.log($scope.imgArr.length);
        console.log('FIRSTPHASE - generation end');
      }

    }, 100);
   
  }, false);
  // this does not work in the angular way... fakeVideo.on('play', function(e) {
  // I got an error about the canvas context drawImage does not defined.
 
  $scope.generateImgs = function() {
   
   if($scope.intervalFirstPhase !== null) {
     console.log('RETURN - cannot start generation second phase becuase the first phase have not finished');
     return;
   }
   
   if($scope.intervalSecondPhase !== null) {
     console.log('RETURN - cannot start generation second phase becuase this job has not finished');
     return;
   }
    
   videoHalfTimeExtend += 5;
   
   if(videoHalfTimeExtend > fakeVideo.duration) {
     console.log('RETURN - Video is over');
     return;
   }
   
   console.log('fakeVideo.currentTime: ' + fakeVideo.currentTime);
   console.log('videoHalfTimeExtend: ' + videoHalfTimeExtend);
   
   //console.log('videoHalfTimeExtend: ' + videoHalfTimeExtend);
   
   $scope.intervalSecondPhase = $interval(function() {
    
     console.log(videoHalfTimeExtend < parseInt(fakeVideo.currentTime) || parseInt(fakeVideo.currentTime) == 0)
    
     if(videoHalfTimeExtend < parseInt(fakeVideo.currentTime) || parseInt(fakeVideo.currentTime) == 0) {
      
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

  $scope.mouseBeforeX = null;
  $scope.mouseCanFrameSliderLeft = null;
  $scope.mouseCanFrameSliderRight = null;
  $scope.resizeMouseDownPosX = null;

  $scope.sliderMouseDown = function(e) {
    e.preventDefault();
   
    $scope.resizeMouseDownPosX = e.clientX;
    var resContainerOffsetLeft = resizableContainer[0].offsetLeft;
    var resContainerOffsetRight = resContainerOffsetLeft + resizableContainer[0].offsetWidth;

    if($scope.resizeMouseDownPosX < resContainerOffsetLeft + 15) {
      //console.log('left res');
      $scope.mouseCanFrameSliderLeft = true;

      return;
    } else if($scope.resizeMouseDownPosX > resContainerOffsetRight - 15) {
      //console.log('right res');
      $scope.mouseCanFrameSliderRight = true;

      return;
    }
   
    $scope.mouseBeforeX = true;
   
    var rcImgs = rightContainer.find('img');
    var rcImgsLen = rcImgs.length;
    var rcImgCtime = rcImgs[rcImgsLen - 1].dataset.ctime;
    $scope.clickedImgCtime = rcImgCtime;
   
    //$scope.generateImgs();
   

    mainVideo.pause();
  };

  $scope.sliderMouseUp = function(e) {
    e.preventDefault();
   
    $scope.mouseBeforeX = null;
    $scope.mouseCanFrameSliderLeft = null;
    $scope.mouseCanFrameSliderRight = null;
    $scope.resizeMouseDownPosX = null;
   
    $scope.getRisContainerFrames();
  };

  $scope.sliderMove = function(e) {
    e.preventDefault();
   
    if($scope.mouseBeforeX === null && $scope.mouseCanFrameSliderLeft === null && $scope.mouseCanFrameSliderRight === null)
      return;
   
    var x = e.clientX;
   
    if($scope.mouseBeforeX !== null) {

      if(x < $scope.mouseBeforeX) {
        if(rightContainer.find('img').length < 4) {
         console.log('RIGHT - no elem');
         return;
        }

        goRight();
      } else {
        goLeft();
      }
      $scope.mouseBeforeX = x;


      //var getCurrentImgTime = resizableContainer.find('img').attr('data-ctime');
      //$scope.mainVideo.currentTime = getCurrentImgTime;

      $scope.hidePictures();
      $scope.getRisContainerFrames();
      //$scope.mainVideo[0].play();
    } else if($scope.mouseCanFrameSliderLeft !== null) {
     
      //console.log('LEFT HANDLE - now we have to resize the thing');
     
      $scope.setSliderByHandleLeft(x);
       
    } else if($scope.mouseCanFrameSliderRight !== null) {
     
      //console.log('RIGHT HANDLE - now we have to resize the thing');
     
      $scope.setSliderByHandleRight(x);
    }
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
   
    var resConImgLen = resizableContainer.find('img').length;
    var iterator = null;
   
    switch(resConImgLen) {
      case 8:
        iterator = 3;
        break;
      case 7:
        iterator = 4;
        break;
      case 6:
        iterator = 5;
        break;
      case 5:
        iterator = 6;
        break;
      case 4:
        iterator = 7;
        break;
      case 3:
        iterator = 8;
        break;
    }
    // switch needs for resizeability
   
    var rightImgs = rightContainer.find('img');
    var rightImgsLen = rightContainer.find('img').length;
    if(rightImgsLen >= 3) {
      rightImgs.css('display', 'none');
     
      for(var i = 0 ; i < iterator ; i++) {
        rightImgs[i].style.display = 'inline-block';
      }
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
 
  $scope.setSliderByHandleLeft = function(mousePosX) {
   
    var resConWidth = resizableContainer[0].clientWidth;
    var rightConWidth = rightContainer[0].clientWidth;

    if($scope.resizeMouseDownPosX < mousePosX && resConWidth > 300) {
      //console.log('LEFT - alignment happend');
      resConWidth -= 100;
      rightConWidth += 100;

      var rcImgs = resizableContainer.find('img');
      var rcImglast = rcImgs[0];

      leftContainer[0].appendChild(rcImglast);

    } else if($scope.resizeMouseDownPosX > mousePosX && resConWidth < 800) {
      //console.log('RIGHT - alignment happend');
      resConWidth += 100;
      rightConWidth -= 100;

      var lcImgs = leftContainer.find('img');
      var lcImglast = null;


      for(var i = lcImgs.length; i > 0 ; i--) {
        lcImglast = lcImgs[i - 1];
        break;
      }
      resizableContainer[0].insertBefore(lcImglast, resizableContainer[0].firstChild);
    } else {
      console.log('OUT OF THE RESCONTAINER SCOPE');

      $scope.mouseBeforeX = null;
      $scope.mouseCanFrameSliderLeft = null;
      $scope.mouseCanFrameSliderRight = null;
      $scope.resizeMouseDownPosX = null;     
    }

    $scope.hidePictures();
   
    resizableContainer.css('width', resConWidth + 'px');
    rightContainer
      .css('width', rightConWidth + 'px')
      .css('max-width', rightConWidth + 'px');
  }; 
 
  $scope.setSliderByHandleRight = function(mousePosX) {
   
    var resConWidth = resizableContainer[0].clientWidth;
    var rightConWidth = rightContainer[0].clientWidth;

    if($scope.resizeMouseDownPosX < mousePosX && resConWidth < 800) {
      console.log('RIGHT - alignment happend');
      resConWidth += 100;
      rightConWidth -= 100;     

     
      var rcImgs = rightContainer.find('img');
      var rcImglast = rcImgs[0];

      resizableContainer[0].appendChild(rcImglast);

    } else if($scope.resizeMouseDownPosX > mousePosX && resConWidth > 300) {
      console.log('LEFT - alignment happend');
     
      resConWidth -= 100;
      rightConWidth += 100;
      
      var rsImgs = resizableContainer.find('img');
      var rsImglast = null;
     
      for(var i = rsImgs.length; i > 0 ; i--) {
        rsImglast = rsImgs[i - 1];
        break;
      }
     
      rightContainer[0].insertBefore(rsImglast, rightContainer[0].firstChild);
     
    } else {
      console.log('OUT OF THE RESCONTAINER SCOPE');
     
      $scope.mouseBeforeX = null;
      $scope.mouseCanFrameSliderLeft = null;
      $scope.mouseCanFrameSliderRight = null;
      $scope.resizeMouseDownPosX = null;     
    }
   
    //$scope.hidePictures();
   
    resizableContainer.css('width', resConWidth + 'px');
    rightContainer
      .css('width', rightConWidth + 'px')
      .css('max-width', rightConWidth + 'px');
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
   
    mainVideo.load();
   
    seekBar.value = currentTime;
    $scope.seekValue = currentTime;
  };

}]); 
 
})();