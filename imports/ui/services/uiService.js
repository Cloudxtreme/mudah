import angularMeteor from 'angular-meteor';
import angular from 'angular';
import 'angular-animate';
import 'angular-sanitize';
import 'ionic-scripts';
import { Meteor } from 'meteor/meteor';

var modalStack = [];

const name = 'uiService'

function uiService($rootScope, $state, $timeout, $ionicModal, $ionicPopup, $ionicListDelegate, $ionicHistory, $ionicLoading) {
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
      hideOptions: hideOptions,
      openEditModal : openEditModal,
      hideEditModal : hideEditModal,
      alert : alert,
      isIOS  : isIOS,
      isAndroid: isAndroid,
      isWebView : isWebView,
      isOnline: isOnline,
      isOffline : isOffline,
      isDisabled : isDisabled,
      goHomepage: goHomepage,
      goGuestpage: goGuestpage,
      getFacebookPhotoUrl : getFacebookPhotoUrl,
      getGooglePhotoUrl : getGooglePhotoUrl,
      getProfilePhoto : getProfilePhoto,
      spinner : spinner,
      focusField : focusField
    }
    return service;

    // function implementations

    function log(msg) {
      console.log(msg);
    }

    function comingSoon(msg) {
      if (msg==null ) {  msg = "";  }

      $ionicPopup.alert({
        title: 'Coming Soon',
        template: 'Work in Progress. ' + msg
      });
    }

    // to stop the 'click' event frm being propagated further to the 'viewDetails' onclick
    // http://benohead.com/angularjs-stopping-event-propagation-on-ng-click/
     function stopFurtherClicks($event) {
      // console.log("$event = ", $event);
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

    function openEditModal(modal) {
      $rootScope.editModal = $ionicModal.fromTemplate(modal);
      $rootScope.editModal.show();
    }

    function hideEditModal(modal) {
      if ($rootScope.editModal!=null ) {
        $rootScope.editModal.hide();
        $rootScope.editModal.remove();
      }
    }

    function hideModal() {
      console.log("hide Modal");
      if ($rootScope.modal!=null ) {
        $rootScope.modal.hide();
        $rootScope.modal.remove();
      }
        if (peekModal()) {
          console.log("uiService : there's a modal is the stack, show it");
          $rootScope.modal = popModal();
          $rootScope.modal.show();
        }
    }

    function hideOptions(isButton, flag, isEditModal) {
      if (flag==undefined) {
        flag = Meteor.settings.public.features.hideOptions;
      }
      console.log("hide options = ", flag);
      if ( flag==true) {
        if ( isButton ) {
          console.log("hide modal....");
          if ( isEditModal ) {
            hideEditModal();
          } else {
            hideModal();
          }

        } else {
          console.log("close options buttons....");
          closeOptionButtons();
        }
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

    function isDisabled(feature) {
     return  !isEnabled(feature);
    }

    function isEnabled(feature) {
      return  Meteor.settings.public.features[feature]
    }



    function goHomepage() {
        $state.go('tab.promiseList');
    }

    function goGuestpage() {
      $state.go('guest');
    }

    function getFacebookPhotoUrl(user, size) {
      if (size==undefined) { size="small";}
      return "https://graph.facebook.com/" + user.services.facebook.id + "/picture?type=" + size;
    }

    function getGooglePhotoUrl(user) {
      return user.services.google.picture;
    }

    function getProfilePhoto(user, photoSize) {
        if (user==undefined || user.services==undefined) return;

        
        if ( user.services.facebook ) {
          if (photoSize==null) { photoSize="large"; }
          return getFacebookPhotoUrl(user, photoSize);
        }

        if ( user.services.google ) {
          return getGooglePhotoUrl(user);
        }

        if ( user.services.password && user.profile.photo ) {
            return user.profile.photo;
        }

        return "/img/blankuser.png";
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

    function focusField(field) {
      //let el = angular.element('#editInputField');
      let el = angular.element(field);
      el.focus();
      $timeout(function() {
        el.focus();
      });
    }

}


// create a module
export default angular.module(name, [
  angularMeteor,
  'ngAnimate',
  'ionic'
])
.factory(name, uiService);
