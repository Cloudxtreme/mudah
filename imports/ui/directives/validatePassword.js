import angularMeteor from 'angular-meteor';

name = "validatePassword";

// create a module
export default angular.module(name, [
  angularMeteor
])
  .directive('validatePassword', validatePassword);

function validatePassword($timeout) {

    console.log("validate-password directive");
    return {
         require: 'ngModel',
         link: function (scope, elm, attrs, ctrl) {
             ctrl.$parsers.unshift(function (viewValue, $scope) {
               var noMatch=true;
               if (scope.registerForm) { //hack
                 var noMatch = viewValue != scope.registerForm.password.$viewValue
               }
               if (scope.resetPasswordForm) { //hack
                 var noMatch = viewValue != scope.resetPasswordForm.password.$viewValue
               }
               if (scope.changePasswordForm) { //hack
                 var noMatch = viewValue != scope.changePasswordForm.password.$viewValue
               }


              ctrl.$setValidity('noMatch', !noMatch)
             })
         }
     }
}
