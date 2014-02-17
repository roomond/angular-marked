/*
 * angular-marked v0.0.1
 * (c) 2013 J. Harshbarger
 * License: MIT
 */

/* jshint undef: true, unused: true */
/* global angular:true */
/* global marked:true */

(function () {
	'use strict';

  var app = angular.module('hc.marked', []);

  //app.constant('marked', window.marked);  // This works but...

  // This allows delayed/lazy initialization.  In otherwords app javascript can be loaded before marked lib
	app.provider('marked', function () {

    var self = this;

    self.setOptions = function(opts) {  // Store options for later
      this.defaults = opts;
    }
		
		self.$get = ['$window',function ($window) { 
      var m = $window.marked;

      self.setOptions = m.setOptions;
      m.setOptions(self.defaults);

			return m;
		}];

	});

  // TODO: filter tests */
  app.filter('marked', ['marked', '$sce', function(marked,$sce) {
	  return function(val) {
      return $sce.trustAsHtml(marked(val));
    }
	}]);

  app.directive('marked', ['marked', '$compile', '$parse', function (marked, $compile,$parse) {

    return {
      restrict: 'AE',
      priority: 1200,
      terminal: true,
      //transclude: true,
      //template: '<div class="markdownSource" ng-hide="true"><div ng-transclude></div></div>',
      compile: function (element, attrs) {

        var srcAttr = attrs.ngBind || attrs.ngBindHtml;
        var srcExp = $parse(srcAttr);
        var optsExp = $parse(attrs.marked || attrs.options);
        var compile = attrs.compiled != undefined && attrs.compiled != "false";

        return function link(scope, element) {

          if (srcAttr) {
            handeler(srcExp(scope));
            scope.$watch(srcExp, handeler);
          } else {
            handeler(element.text());
          }

          //element.addClass('ng-hide');

          //var lastHtml = '';
          function handeler(val) {
            var newElm = angular.element('<span>'+val+'</span>');
            console.log($compile(newElm)(scope).text());

            var html = marked(val || '', optsExp(scope) || null);

            //if (html != lastHtml) {  // Don't update DOM if HTML is the same
              //element.append(angular.element('<div></div>').html(html));
              //element.$markdown = val;
              element.html(html);

              if (compile)
                $compile(element.contents())(scope);   
            //}
            
            //lastHtml = html;
                 
          }

        }

      }
    };

  }]);

}());