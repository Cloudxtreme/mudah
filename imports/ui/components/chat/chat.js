import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';  // needed for Unit Tests to work

import { Meteor } from 'meteor/meteor';
import 'ionic-scripts';
import moment from 'moment';
import _ from 'underscore';

import './chat.html';

import { Messages } from '../../../api/tasks';
import { name as ChatInputDirective } from '../../directives/chatInputDirective';
import { newMessage } from '../../../api/methods/taskMethods.js';

const name = 'chat';

class Chat {

  constructor($scope, $reactive, $state, $stateParams, $log, $timeout, $ionicScrollDelegate) {
    'ngInject';

    //console.log("Chat component chatId=", $stateParams.chatId);
    console.log("chat..");
    console.log($stateParams);

    $reactive(this).attach($scope);

    this.$state = $state;
    this.$log = $log;
    this.$timeout = $timeout;
    this.$ionicScrollDelegate = $ionicScrollDelegate;

    this.chatId = $stateParams.chatId;
    this.isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();
    this.isCordova = Meteor.isCordova;


    this.subscribe('messages', () => [ this.chatId  ]);


    this.helpers({
      messages() {
        return Messages.find({ chatId: this.chatId });
      }
    });

    this.$timeout(() => {
      this.$ionicScrollDelegate.$getByHandle('chatScroll').scrollBottom(true);
    }, 300);

    this.autoScroll();
  }


  sendMessage() {
    if (_.isEmpty(this.message)) return;

    newMessage.call({
      text: this.message,
      chatId: this.chatId
    }, (err, res) => {
      if (err) {
        alert(err);
      } else {
        // success!
      }
    });

    this.init();
  }

  init() {
    delete this.message;
  }

  inputUp () {
    if (this.isIOS) {
      this.keyboardHeight = 216;
    }

    this.$timeout(() => {
      this.$ionicScrollDelegate.$getByHandle('chatScroll').scrollBottom(true);
    }, 300);
  }

  inputDown () {
    if (this.isIOS) {
      this.keyboardHeight = 0;
    }

    this.$ionicScrollDelegate.$getByHandle('chatScroll').resize();
  }

  closeKeyboard () {
    if (this.isCordova) {
      cordova.plugins.Keyboard.close();
    }
  }

  autoScroll() {
    let recentMessagesNum = this.messages.length;

    this.autorun(() => {
      const currMessagesNum = this.getCollectionReactively('messages').length;
      const animate = recentMessagesNum != currMessagesNum;
      recentMessagesNum = currMessagesNum;

      this.$timeout(() => {
        this.$ionicScrollDelegate.$getByHandle('chatScroll').scrollBottom(animate);
      }, 300);
    });
  }


  handleError(err) {
    if (err.error == 'cancel') return;
    this.$log.error('Profile save error ', err);

    this.$ionicPopup.alert({
      title: err.reason || 'Save failed',
      template: 'Please try again',
      okType: 'button-positive button-clear'
    });
  }

}



// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  ChatInputDirective,
  'ionic'
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: Chat
})
.config(config);

function config($stateProvider) {
'ngInject';

  $stateProvider.state('tab.chat', {
    url: '/chat/:chatId',
    views: {
      'tab-promise': {
          template: '<chat><chat>'
      }
    },
    resolve: {
      currentUser($q) {
        if (Meteor.userId() === null) {
          return $q.reject('AUTH_REQUIRED');
        } else {
          return $q.resolve();
        }
      }
    }
  });
}
