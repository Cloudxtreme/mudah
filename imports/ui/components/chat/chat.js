import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';  // needed for Unit Tests to work

import { Meteor } from 'meteor/meteor';
import 'ionic-scripts';
import moment from 'moment';
import _ from 'underscore';

import './chat.html';

import { statusHelper } from '/imports/ui/helpers/statusHelper';
import { taskHelper } from '/imports/api/methods/taskHelper';
import { Messages } from '/imports/api/tasks';
import { name as ChatInputDirective } from '/imports/ui/directives/chatInputDirective';
import { newMessage } from '/imports/api/methods/taskMethods.js';


const name = 'chat';

class Chat {

  constructor($scope, $reactive, $log, $timeout, $ionicScrollDelegate, uiService, chatService) {
    'ngInject';

    console.log("Chat component");

    this.uiService = uiService;
    this.$log = $log;
    this.$timeout = $timeout;
    this.isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();
    this.isCordova = Meteor.isCordova;
    this.$ionicScrollDelegate = $ionicScrollDelegate;

    $reactive(this).attach($scope);

    this.task = chatService.getTask();

    this.taskId = this.task._id;
    this.cacheUsers(this.taskId);

    this.subscribe('messages', () => [ this.taskId  ]);

    this.helpers({
      messages() {
        return Messages.find({ taskId: this.taskId });
      }
    });


    this.$timeout(() => {
      this.currScrollBar = this.findScrollBar("chatScroll");
      this.currScrollBar.scrollBottom(true);
    }, 300);


    this.autoScroll();
  }

  findScrollBar(name) {

    for (x=0;x<this.$ionicScrollDelegate._instances.length;x++) {
      //console.log("x=",x);
      //console.log(this.$ionicScrollDelegate._instances[x] );

      console.log("$$delegateHandle = " + this.$ionicScrollDelegate._instances[x].$$delegateHandle );
      if  ( name == this.$ionicScrollDelegate._instances[x].$$delegateHandle ) {
        return this.$ionicScrollDelegate._instances[x];
      }
    }
    return null;
  }


  cacheUsers(taskId) {
    let task = this.task;

    console.log("---> get friends=");
    console.log( task.userIds);

    this.users = [];
    for (x=0;x< task.userIds.length;x++) {
      let userId = task.userIds[x];

      let currUser = taskHelper.getUser(userId);
      let userDetails = {};
        userDetails.name = currUser.profile.name;
        userDetails.photo = this.uiService.getProfilePhoto(currUser);

      this.users[ userId ] = userDetails;
      //console.log("name = " + this.users[userId].name );
    }

    // get the Creator's profile
    currUser = taskHelper.getUser(task.creator);
    let userDetails = {};
      userDetails.name = currUser.profile.name;
      userDetails.photo = this.uiService.getProfilePhoto(currUser);
    this.users[ task.creator ] = userDetails;

  }

  getName(userId) {
    //return "Test User";
    return this.users[userId].name;
  }

  getPhotoUrl(userId) {
    //return "/img/blankuser.png";
    return this.users[userId].photo;
  }

  init() {
    delete this.message;
  }

  sendMessage() {
    console.log("sendMessage() taskId=" + this.taskId);

    if (_.isEmpty(this.message)) return;

    this.call('newMessage',
      {
        text: this.message,
        taskId: this.taskId
      }, function(err, res) {
        if (err) {
          alert(err);
        } else {
          // success!
        }
        this.init();

        // this is a hack as getByHandle() doesn't work !
        //this.$ionicScrollDelegate._instances[2].scrollBottom(true);

    });

  }


  inputUp () {
    if (this.isIOS) {
      this.keyboardHeight = 216;
    }

    this.$timeout(() => {
      this.currScrollBar.scrollBottom(true);
    }, 300);
  }

  inputDown () {
    if (this.isIOS) {
      this.keyboardHeight = 0;
    }

    this.currScrollBar.resize();
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
        this.currScrollBar.scrollBottom(true);
      }, 300);
    });
  }
}

function ChatService(uiService, $state) {
  'ngInject';
  let currTask=null;

  var service = {
    openChat: openChat,
    setTask: setTask,
    getTask : getTask
  }
  return service;

  function openChat(task) {
    if ( Meteor.settings.public.features.chat==false) {
      uiService.comingSoon("Clicking on the Promiser's Photo is a shortcut to open the Chat view");
      return;
    }

    setTask(task);
    var modal = "<chat></chat>";
    uiService.openModal(modal);
  }

  function setTask(task) {
    currTask = task;
  }

  function getTask() {
    return currTask;
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
.factory( statusHelper.getServiceName(name), ChatService)
