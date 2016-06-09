import angularMeteor from 'angular-meteor';

import './pxModalHeader.html';

name = "pxModalHeader";

export default angular.module(name, [
  angularMeteor
])
.directive('pxModalHeader', pxModalHeader);

function pxModalHeader() {
    return {
      restrict: 'E',
      templateUrl: function() {
          return "imports/ui/directives/pxModalHeader.html";
      },
      scope: {},
      bindToController: {
        viewTitle: "@"
      },
      controllerAs: 'ModalHeader',
      controller: ModalHeader
    }
}


function ModalHeader(uiService) {
  'ngInject';

  ModalHeader = this;
  ModalHeader.hide = function() {
    uiService.hideModal();
  }
}
