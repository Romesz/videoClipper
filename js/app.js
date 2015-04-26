// http://stackoverflow.com/questions/5845484/force-html5-youtube-video
// http://html5doctor.com/video-canvas-magic/
// https://github.com/darul75/ng-slider

(function () {
  var app = angular.module('videoClipper', []);

  app.controller('videoCtrl', function ($scope, $timeout, $anchorScroll) {
    
    var imageSilder = angular.element(document.querySelector('#imageSilder'));
    var resizableContainer = angular.element(document.querySelector('#resizableContainer'));
    var rightContainer = angular.element(document.querySelector('#rightContainer'));
    var leftContainer = angular.element(document.querySelector('#leftContainer'));
    var mainVideo = document.getElementById('mainVideo');
    var fakeVideo = document.getElementById('fakeVideo');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    //var currentVideoTime = fakeVideo.currentTime;
    //var duration = parseInt(fakeVideo.duration);  // NaN

    var imgArr  = new Array();
    var counter = 0;
    var interval = null;
    
    var isWidth = imageSilder[0].clientWidth;
    var rescWidth = resizableContainer[0].clientWidth / 100;

    var img = null;
    
    
    fakeVideo.addEventListener('play', function(e) {
      
      interval = setInterval(function() {
        if(imgArr.length >= 10) {
          fakeVideo.pause();
          clearInterval(interval);
          
          img = angular.element(document.querySelectorAll('img'));
          img.css('opacity', '0.4');
          
          var imgCounter = 0;
          
          for(var index in img) {
            if(imgCounter === rescWidth)
              return;
            
            img[index].style.opacity = 1;
            imgCounter++;
          }
          
          // other images need to be generated
          
          /*
          interval = setInterval(function() {
            if(fakeVideo.currentTime < fakeVideo.duration) {
              fakeVideo.pause();
              clearInterval(interval);
            }
            
            fakeVideo.play();
            
            saveImgToArray(fakeVideo, canvas);
            createImgTags(counter, e.target.currentTime);
            counter++;            
          }, 100);
          */
        }
        
        saveImgToArray(fakeVideo, canvas);
        createImgTags(counter, e.target.currentTime);
        counter++;
        
      }, 100);
    }, false);
    
    
    function saveImgToArray(video, thecanvas) {
      context.drawImage( video, 0, 0, thecanvas.width, thecanvas.height);
      var dataURL = thecanvas.toDataURL();
      imgArr.push(dataURL);
    };

    function createImgTags(counter, cTime) {
      var imgContainer = document.getElementById('resizableContainer');
      var rightContainer = document.getElementById('rightContainer');
      
      var imgTag = document.createElement('IMG');
      imgTag.src = imgArr[counter];
      imgTag.id = 'img' + counter;
      imgTag['data-ctime'] = cTime;
      imgTag['ng-click'] = 'imgClick()';
      if(counter < 8)
        imgContainer.appendChild(imgTag);
      else
        rightContainer.appendChild(imgTag);
    };
    //direttiva
    
    mainVideo.addEventListener('play', function(e) {
      mainVideo.currentTime = fakeVideo.currentTime;
    }, false);
    
    //ng-mousemove="sliderGrab($event)"
    /*
    $scope.sliderGrab = function(e) {
      e.preventDefault();
      console.log(e.pageX);
      
      var imageSilder = angular.element(document.querySelector('#imageSilder'));
      imageSilder.scrollTo(500, 0);
    }; 
    */
    
    var lcWidth = 0;
    var rcWidth = 200;
    
    $scope.left = function() {
      var lcImgs = leftContainer.find('img');
      var lcImglast = null;
      
      if(lcImgs.length === 0) {
        console.log('LEFT - no elem');
        return;
      } else if(lcImgs.length === 1) {
        lcImglast = lcImgs[0];
      } else {
      
        for(var i = lcImgs.length; i > 0  ; i--) {
          lcImglast = lcImgs[i - 1];
          break;
        }
      }
      lcImglast.style.opacity = 1;
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

      if(rcImgs.length === 0) {
        console.log('LEFT - no elem');
        return;
      } else if(rcImgs.length === 1) {
        rcImglast = rcImgs[0];
      } else {

        for(var i = rcImgs.length; i > 0  ; i--) {
          rcImglast = rcImgs[i - 1];
          break;
        }
      }
      rcImglast.style.opacity = 0.4;
      rightContainer[0].insertBefore(rcImglast, rightContainer[0].firstChild);
      
      // here is the problem
    };
    
    $scope.right = function() {      
      var rcImgs = resizableContainer.find('img');
      var rcImgFirst = null;
      
      
      if(rcImgs.length === 0) {
        console.log('Right - no elem');
        return;
      } else if(rcImgs.length === 1) {
        rcImgFirst = rcImgs[0];
      } else {
        for(var i in rcImgs) {
          rcImgFirst = rcImgs[i];
          break;
        }
      }
      rcImgFirst.style.opacity = 0.4;
      leftContainer[0].appendChild(rcImgFirst);

      lcWidth += 100;
      leftContainer.css('width', lcWidth + 'px');
      
      if(rcWidth !== 0) {
        rcWidth -= 100;
        rightContainer.css('width', rcWidth + 'px');
      }
      
      var rcImgs = rightContainer.find('img');
      var rcImgFirst = null;
      
      if(rcImgs.length === 0) {
        console.log('Right - no elem');
        return;
      } else if(rcImgs.length === 1) {
        rcImgFirst = rcImgs[0];
      } else {
        for(var i in rcImgs) {
          rcImgFirst = rcImgs[i];
          break;
        }  
      }
      rcImgFirst.style.opacity = 1;
      resizableContainer[0].appendChild(rcImgFirst);
    };

  });
  
  app.directive('scrollOnClick', function() {
    return {
      restrict: 'A',
      link: function(scope, $elm) {
        /*
        $elm.on('mousemove', function(e) {
          e.preventDefault();
          var x = e.pageX;
          console.log(x);
          if(x < 50)
            $('#img0').hide();
          else
            $('#img0').show();
        });
        */
      }
    }
  });
  
})();