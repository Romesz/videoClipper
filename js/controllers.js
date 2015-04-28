// http://stackoverflow.com/questions/15165991/uncaught-typeerror-type-error-with-drawimage
app.controller('videoCtrl', ['$scope', '$interval', function ($scope, $interval) {

  var imageSilder = angular.element(document.querySelector('#imageSilder'));
  var resizableContainer = angular.element(document.querySelector('#resizableContainer'));
  var rightContainer = angular.element(document.querySelector('#rightContainer'));
  var leftContainer = angular.element(document.querySelector('#leftContainer'));

  $scope.canvas = document.getElementById('canvas');
  $scope.context = $scope.canvas.getContext('2d');
  
  $scope.imgArr  = new Array();
  $scope.counter = 0;
  $scope.interval = null;

  var isWidth = imageSilder[0].clientWidth;
  var rescWidth = Math.round(resizableContainer[0].clientWidth / 100);

  var lcWidth = 0;
  var rcWidth = 200;

  $scope.generateImgs = function() {
    $scope.interval = $interval(function() {
      if($scope.fakeVideo[0].currentTime >= $scope.fakeVideo[0].duration) {
      //if($scope.imgArr.length >= 20) {
        $scope.fakeVideo[0].pause();
        $interval.cancel($scope.interval);
        interval = null;

        //console.log($scope.fakeVideo[0].currentTime);
        //console.log('generation end');

        return;
      }

      $scope.fakeVideo[0].play();

      $scope.saveImgToArray($scope.context, $scope.fakeVideo, $scope.canvas);
      $scope.createImgTags($scope.counter, $scope.fakeVideo[0].currentTime);
      $scope.counter++;            
    }, 150);      
  }
  
  function goLeft() {
    var lcImgs = leftContainer.find('img');
    var lcImglast = null;

    if(lcImgs.length === 3) {
      console.log('LEFT - no elem');
      return;
    } else {

      for(var i = lcImgs.length; i > 0  ; i--) {
        lcImglast = lcImgs[i - 1];
        break;
      }
    }
    resizableContainer[0].insertBefore(lcImglast, resizableContainer[0].firstChild);

    if(lcWidth !== 0) {
      lcWidth -= 100;
      leftContainer.css('width', lcWidth + 'px');  
    }

    var rescLen = resizableContainer.find('img').length;
    if(rescLen <= 8) {
      return;
    }

    rcWidth += 100;
    rightContainer.css('width', rcWidth + 'px');

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

    /*
    if(rescImgs.length === 0) {
      console.log('res - no elem');
      return;
    } else {
    */
      for(var i in rescImgs) {
        rescImgFirst = rescImgs[i];
        break;
      }
    //}
    try {
      leftContainer[0].appendChild(rescImgFirst);

    } catch(e) {
      console.log(e);
    }

    $scope.scrollToImg();

    lcWidth += 100;
    leftContainer.css('width', lcWidth + 'px');

    if(rcWidth !== 0) {
      rcWidth -= 100;
      rightContainer.css('width', rcWidth + 'px');
    }

    var rcImgs = rightContainer.find('img');
    var rcImgFirst = null;

    /*
    if(rcImgs.length === 3) {
      console.log('Right - no elem');
      return;
    } else {
    */
      for(var i in rcImgs) {
        rcImgFirst = rcImgs[i];
        break;
      }  
    //}
    try {
      resizableContainer[0].appendChild(rcImgFirst);
    } catch(e) {
      console.log(e);
    }


    //utils.generateImgs();
    $scope.generateImgs();
  };

  var mouseBeforeX = null;

  $scope.sliderMouseDown = function(e) {
    e.preventDefault();
    mouseBeforeX = true;

    $scope.mainVideo[0].pause();
  };

  $scope.sliderMouseUp = function(e) {
    e.preventDefault();
    mouseBeforeX = null;
  };

  $scope.sliderMove = function(e) {
    e.preventDefault();

    if(mouseBeforeX === null)
      return;

    var x = event.clientX;

    if(x < mouseBeforeX) {
      goRight();
    } else {
      goLeft();
    }
    mouseBeforeX = x;


    var getCurrentImgTime = resizableContainer.find('img').attr('data-ctime');
    $scope.mainVideo.currentTime = getCurrentImgTime;

    //$scope.mainVideo.play();
    $scope.getRisContainerFrames();
  };

  
  $scope.saveImgToArray = function(context, video, thecanvas) {
    //$scope.fakeVideo[0].onload = function() {
      context.drawImage(video, 0, 0, thecanvas.width, thecanvas.height);
    //}

    try {
      var dataURL = thecanvas.toDataURL();
      //.setAttribute('crossOrigin', 'anonymous');
      // http://stackoverflow.com/questions/20424279/canvas-todataurl-securityerror
    } catch(e) {
      console.log(e);
    }
    $scope.imgArr.push(dataURL);
    //$scope.imgArr.push(null);
  };
  
  $scope.createImgTags = function(counter, cTime) {
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
  
  $scope.getRisContainerFrames = function() {

    var getResCImgs = resizableContainer.find('img');
    var getResCImgsLen = getResCImgs.length;
    var getResCImgFirst = getResCImgs[0].dataset.ctime;
    var getResCImgLast = null;

    for(var i = getResCImgsLen; i > 0  ; i--) {
      getResCImgLast = getResCImgs[i - 1];
      break;
    }

    var getResCImgLast = getResCImgLast.dataset.ctime;

    $scope.mainVideo.currentTime = getResCImgFirst;
    $scope.mainVideo.duration = getResCImgLast;
    $scope.mainVideo.loop = true;

    console.log('%c currentTime -- ' + $scope.mainVideo.currentTime, 'border: 1px solid green;');
    console.log('%c duration -- ' + $scope.mainVideo.duration, 'border: 1px solid green;');
    console.log('%c duration should be -- ' + getResCImgLast, 'border: 1px solid green;');

    //perhaps need another video tag vith these info
  };

}]);