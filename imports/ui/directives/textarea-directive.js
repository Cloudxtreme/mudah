// overwrite textarea directive
angular.module('starter').directive('textarea', function() {
 return {
   restrict: 'E',
   link: function(scope, element, attr){
       var update = function(){
         console.log("update textarea directive....");
           element.css("height", "auto");
           var height = element[0].scrollHeight;
           element.css("height", element[0].scrollHeight + "px");
       };
       scope.$watch(attr.ngModel, function(){
           update();
       });
   }
 };
});
