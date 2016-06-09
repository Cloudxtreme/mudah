import angularMeteor from 'angular-meteor';

name = "chatInputDirective";

// create a module
export default angular.module(name, [
  angularMeteor
])
  .directive('chatInput', chatInput);

function chatInput($timeout) {

    return {
      restrict: 'A',
      scope : {
        'returnClose': '=',
        'onReturn': '&',
        'onFocus': '&',
        'onBlur': '&'
      },
      link(scope, element) {
        element.bind('focus', (e) => {
          if (!scope.onFocus) return;

          $timeout(() => {
            scope.onFocus();
          });
        });

        element.bind('blur', (e) => {
          if (!scope.onBlur) return;

          $timeout(() => {
            scope.onBlur();
          });
        });

        element.bind('keydown', (e) => {
          if (e.which != 13) return;

          if (scope.returnClose) {
            element[0].blur();
          }

          if (scope.onReturn) {
            $timeout(() => {
              scope.onReturn();
            });
          }
        });
      }
  }
}
