import angularMeteor from 'angular-meteor';
import 'angular-animate';
import 'angular-sanitize';
import 'ionic-scripts';

var modalStack = [];

const name = 'uiService'

function uiService($rootScope, $state, $ionicModal, $ionicPopup, $ionicListDelegate, $ionicHistory, $ionicLoading) {
    'ngInject';

    //console.log("uiService.....");


    var service = {
      log : log,
      comingSoon: comingSoon,
      stopFurtherClicks : stopFurtherClicks,
      closeOptionButtons : closeOptionButtons,
      pushModal : pushModal,
      peekModal : peekModal,
      popModal : popModal,
      broadcast : broadcast,
      clearHistory : clearHistory,
      goState: goState,
      openModal : openModal,
      hideModal : hideModal,
      openModalUrl : openModalUrl,
      alert : alert,
      isIOS  : isIOS,
      isAndroid: isAndroid,
      isWebView : isWebView,
      isOnline: isOnline,
      isOffline : isOffline,
      goHomepage: goHomepage,
      goGuestpage: goGuestpage,
      getFacebookPhotoUrl : getFacebookPhotoUrl,
      getGooglePhotoUrl : getGooglePhotoUrl,
      spinner : spinner
    }
    return service;

    // function implementations

    function log(msg) {
      console.log(msg);
    }

    function comingSoon() {

      $ionicPopup.alert({
        title: 'Coming Soon',
        template: 'Work in Progress'
      });
    }

    // to stop the 'click' event frm being propagated further to the 'viewDetails' onclick
    // http://benohead.com/angularjs-stopping-event-propagation-on-ng-click/
     function stopFurtherClicks($event) {
       console.log("$event = ", $event);
       $event.stopPropagation();
       $event.preventDefault();
     }

     function closeOptionButtons() {
        $ionicListDelegate.closeOptionButtons();
     }


     function pushModal(modal) {
       modalStack.push(modal);
     }

     function popModal() {
       return modalStack.pop();
     }

     function peekModal() {
       if ( modalStack.length > 0 ) {
         return true;
       }
       return false;
     }

     function broadcast(myRootScope, eventName, args) {
       myRootScope.$broadcast(eventName, args); // $rootScope.$on && $scope.$on
     }

    function clearHistory() {
     $ionicHistory.clearHistory();
    }

    function openModal(modal) {
      $rootScope.modal = $ionicModal.fromTemplate(modal);
      $rootScope.modal.show();
    }

    function openModalUrl(url) {
      $rootScope.modal = $ionicModal.fromTemplateUrl(url);
      $rootScope.modal.show();
    }

    function hideModal() {
      $rootScope.modal.hide();

      if (peekModal()) {
        console.log("uiService : there's a modal is the stack, show it");
        $rootScope.modal = popModal();
        $rootScope.modal.show();
      }
    }

    function alert(msg, title) {
      if (title==null) { title="Alert";}

      var alertPopup = $ionicPopup.alert({
        title: title,
        template: msg
      });

      alertPopup.then(function(res) {
        console.log('Thank you for not eating my delicious ice cream cone');
      });
    }

    function goState(newState, params) {
      if ( params!=null) {
        $state.go(newState,params);
      } else {
        $state.go(newState);
      }
    }

    function isIOS() {
      return ionic.Platform.isWebView() && ionic.Platform.isIOS();
    }

    function isAndroid() {
      return ionic.Platform.isWebView() && ionic.Platform.isAndroid();
    }

    function isWebView() {
      return ionic.Platform.isWebView();
    }

    function isOnline() {
      return Meteor.status().connected;
    }

    function isOffline() {
      return !Meteor.status().connected;
    }

    function goHomepage() {
        $state.go('tab.promiseList');
    }

    function goGuestpage() {
      $state.go('guest');
    }

    function getFacebookPhotoUrl(user) {
      return "https://graph.facebook.com/" + user.services.facebook.id + "/picture?type=small";
    }

    function getGooglePhotoUrl(user) {
      return user.services.google.picture;
    }

    function spinner(flag) {
     if (flag==true) {
        $ionicLoading.show({
            template: '<ion-spinner class="spinner-energized"></ion-spinner>'
    	  });
      } else {
        $ionicLoading.hide();
      }
    }
}


// create a module
export default angular.module(name, [
  angularMeteor,
  'ngAnimate',
  'ionic'
])
.factory(name, uiService);