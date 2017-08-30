'use strict';
require("./ng-fiscroll.scss");
angular.module('ngFiScroll', []).directive('ngFiscroll', [
  '$window',
  '$timeout',
  function ($window, $timeout) {
    return {
      restrict: 'A',
      replace: true,
      transclude: true,
      scope: {
        'isBarShown': '=',
        'hideScrollOnOut': '=',
        'hideTimeout': '=',
        'rebuildOn': '@',
      },
      link: function (scope, element, attrs) {
        var raf = window.requestAnimationFrame || window.setImmediate || function (c) { return setTimeout(c, 0); };
        var documentBody = angular.element(document.body),
          scrollRatio,
          hideTimeout = scope.hideTimeout || 1000;
        var container = element,
          wrapper = angular.element(element.children()[0]),
          content = angular.element(wrapper.children()[0]),
          bar = wrapper.next(),
          win = angular.element($window);

        var touchEndTimeout;

        function enableHideScroll() {
          return scope.hideScrollOnOut;
        }

        function notifyShow() {
          $timeout.cancel(touchEndTimeout);
          scope.isBarShown = true;
          scope.$apply();
          scope.$emit("scrollbar.show");
        }

        function notifyHide() {
          if (enableHideScroll()) {
            touchEndTimeout = $timeout(function () {
              scope.isBarShown = false;
              scope.$emit("scrollbar.hide");
            }, hideTimeout)
          }
        }

        if(scope.rebuildOnResize) {
          var resize = function() {
            moveBar();
          };

          win.on('resize', resize)
          scope.$on("$destroy", function() {
            win.off('resize', resize);
          })
        }

        if(scope.rebuildOn) {
          scope.$on(scope.rebuildOn, function() {
            moveBar();
          })
        }

        // Mouse drag handler
        function dragDealer(el) {
          var lastPageY;

          el.on('mousedown', function (e) {
            lastPageY = e.pageY;
            el.addClass('ss-grabbed');
            documentBody.addClass('ss-grabbed');

            documentBody.on('mousemove', drag);
            documentBody.on('mouseup', stop);
            return false;
          });

          content.on("touchstart", function () {
            notifyShow();
          });

          content.on("touchend", function () {
            enableHideScroll() && notifyHide();
          });

          container.on("mouseleave", function () {
            onMouseLeave();
          })

          function drag(e) {
            notifyShow();
            var delta = e.pageY - lastPageY;
            lastPageY = e.pageY;
            raf(function () {
              content[0].scrollTop += delta / scrollRatio;
            });
          }

          function stop() {
            el.removeClass('ss-grabbed');
            documentBody.removeClass('ss-grabbed');
            documentBody.off('mousemove', drag);
            documentBody.off('mouseup', stop);
          }
        }

        function onMouseEnter(e) {
          notifyShow();
          moveBar(e);
        }

        function onMouseLeave(e) {
          notifyHide();
        }

        // Constructor
        function initScrollBar(el) {
          $timeout(function () {
            dragDealer(bar);
            moveBar();

            content.on('scroll', moveBar);
            el.on('mouseenter', onMouseEnter);

            var css = window.getComputedStyle(el[0]);
            if (css['height'] === '0px' && css['max-height'] !== '0px') {
              el.css('height', css['max-height']);
            }
          })
        }

        function moveBar() {
          var totalHeight = content[0].scrollHeight,
            ownHeight = container[0].clientHeight;

          scrollRatio = ownHeight / totalHeight;
          if (ownHeight > 0) {
            raf(function () {
              // Hide scrollbar if no scrolling is possible
              if (scrollRatio >= 1) {
                bar.addClass('ss-hidden')
              } else {
                bar.removeClass('ss-hidden')
                var top = (content[0].scrollTop / totalHeight) * 100 + '%';
                bar.css({
                  height: (scrollRatio) * 100 + '%',
                  top: top,
                });
              }
            });
          }
        }

        initScrollBar(element);

      },
      template: '<div class="ss-container" ng-class="{\'show-scroll\': isBarShown}"> \
        <div class="ss-wrapper"> \
          <div class="ss-content" ng-transclude> \
          </div> \
        </div> \
        <div class="ss-scroll"></div> \
      </div>',
    };
  }
]);
