import angularMeteor from 'angular-meteor';

name = "focusMe";

// create a module
export default angular.module(name, [
  angularMeteor
])
  .directive('focusMe', focusMe);

function focusMe($timeout) {

    console.log("focus-me directive");
    return {
      link: function(scope, element, attrs) {

      $timeout(function() {
        element[0].focus();
      });
    }
  };
}
