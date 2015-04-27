// http://coub.com/sources/1315039
// http://stackoverflow.com/questions/5845484/force-html5-youtube-video

(function () {
  var app = angular.module('videoClipper', []);

  app.controller('videoCtrl', function ($scope, $timeout, $anchorScroll) {
    
    var imageSilder = angular.element(document.querySelector('#imageSilder'));
    var resizableContainer = angular.element(document.querySelector('#resizableContainer'));
    var rightContainer = angular.element(document.querySelector('#rightContainer'));
    var leftContainer = angular.element(document.querySelector('#leftContainer'));
    var mainVideo = document.getElementById('mainVideo');
    var fakeVideo = document.getElementById('fakeVideo');
    fakeVideo.muted = true;
    fakeVideo.playbackRate = 3.0;
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    //var currentVideoTime = fakeVideo.currentTime;
    //var duration = parseInt(fakeVideo.duration);  // NaN

    var imgArr  = new Array();
    var counter = 0;
    var interval = null;
    
    var isWidth = imageSilder[0].clientWidth;
    var rescWidth = Math.round(resizableContainer[0].clientWidth / 100);

    var img = null;
    
    
    fakeVideo.addEventListener('play', function(e) {
      
      interval = setInterval(function() {
        if(imgArr.length >= 14) {
          fakeVideo.pause();
          clearInterval(interval);
          interval = null;
          
          // other images need to be generated
        }
        
        saveImgToArray(context, fakeVideo, canvas);
        createImgTags(counter, e.target.currentTime);
        counter++;
        
      }, 300);
    }, false);
    
    /*
    mainVideo.addEventListener('play', function(e) {
      //mainVideo.currentTime = fakeVideo.currentTime;
      // get the value of the silder;
    }, false); 
    */
    
    mainVideo.addEventListener('seeking', function(e) {
      // set the value of the silder;
    }, false);
    
    var lcWidth = 0;
    var rcWidth = 200;
    
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
      try{
      leftContainer[0].appendChild(rescImgFirst);

      } catch(e) {
        console.log(e);
      }
      
      scrollToImg();

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
      
      
      generateImgs();
    };
    
    var mouseBeforeX = null;
    
    $scope.sliderMouseDown = function(e) {
      e.preventDefault();
      mouseBeforeX = true;
      
      mainVideo.pause();
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
      mainVideo.currentTime = getCurrentImgTime;
      
      mainVideo.play();
    };

  
  
    // utils fns
    function generateImgs() {
      //console.log('interval');
      //console.log(interval);
      interval = setInterval(function() {
        if(fakeVideo.currentTime >= fakeVideo.duration) {
        //if(imgArr.length >= 20) {
          fakeVideo.pause();
          clearInterval(interval);
          interval = null;
          
          //console.log(fakeVideo.currentTime);
          //console.log('generation end');
          
          return;
        }

        fakeVideo.play();

        saveImgToArray(context, fakeVideo, canvas);
        createImgTags(counter, fakeVideo.currentTime);
        counter++;            
      }, 300);
    }

    function saveImgToArray(context, video, thecanvas) {
        context.drawImage(video, 0, 0, thecanvas.width, thecanvas.height);

        try {
          var dataURL = thecanvas.toDataURL()
          //.setAttribute('crossOrigin', 'anonymous');
          // http://stackoverflow.com/questions/20424279/canvas-todataurl-securityerror
        } catch(e) {
          console.log(e);
        }

        imgArr.push(dataURL);
    };

    function createImgTags(counter, cTime) {
        var imgTag = document.createElement('IMG');
        imgTag.src = imgArr[counter];
        imgTag.id = 'img' + counter;
        imgTag.dataset.ctime = cTime;
        //imgTag['data-ctime'] = cTime;
        //imgTag['ng-click'] = 'imgClick()';
      
        if(counter < 3) {
          leftContainer[0].appendChild(imgTag);
        } else if(counter < 11) {
          resizableContainer[0].appendChild(imgTag);
        } else {
          rightContainer[0].appendChild(imgTag);
        }
    };
    //direttiva
    
    function scrollToImg() {
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
    }

  });
  
  /*
  scroll-on-click
  app.directive('scrollOnClick', function() {
    return {
      restrict: 'A',
      link: function(scope, $elm) {
        
        $elm.on('mousemove', function(e) {
          e.preventDefault();
          var x = e.pageX;
          console.log(x);
          if(x < 50)
            $('#img0').hide();
          else
            $('#img0').show();
        });
      }
    }
  });
  */
  
})();