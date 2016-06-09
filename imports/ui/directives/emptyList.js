import angularMeteor from 'angular-meteor';

import './emptyList.html';

name = "emptyList";

export default angular.module(name, [
  angularMeteor
])
.directive('emptyList', emptyListDirective);

function emptyListDirective() {
    return {
      restrict: 'E',
      templateUrl: function() {
          return "imports/ui/directives/emptyList.html";
      },
      scope: {},
      bindToController: {
        list: "<",
        text: "@"
      },
      controllerAs: 'emptyList',
      controller: emptyList
    }
}


function emptyList(uiService) {
  'ngInject';

    console.log("action");
  
}
