import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router'; // needed for Unit Tests to work

import {Meteor} from 'meteor/meteor';

import './chatsAdd.html';

import {name as Avatar} from "../avatar/avatar";
import {statusHelper} from '/imports/ui/helpers/statusHelper';
import {name as pxModalHeader} from '/imports/ui/directives/pxModalHeader';
import {shareMany} from '/imports/api/methods/taskMethods.js';

const name = 'chatsAdd';

class ChatsAdd {

  constructor($scope, $rootScope, $reactive, $state, uiService) {
    'ngInject';

    this.$state = $state;
    this.$rootScope = $rootScope;
    this.uiService = uiService;

    $reactive(this).attach($scope);

    this.selected = [];

    console.log("mode = ", this.mode);

    this.autorun(() => {
      let x = this.getReactively('this.selected');
      console.log('Autorun!! selected count=', x.length );

    });

    this.helpers({
      users() {
        return Meteor.users.find({
          _id: {
            $ne: Meteor.userId()
          }
        });
      }
    });
  }

  clicked(user) {
    var index = this.selected.indexOf(user);
    if (index > -1) {
      this.selected.splice(index, 1);
      user.selected = false;
    } else {
      this.selected.push(user);
      user.selected = true;
    }

    console.log("selected count=", this.selected.length);
  }

  getPhotoUrl() {
    return this.uiService.getProfilePhoto(user);
  }

  action() {
    this.uiService.hideModal();

    //console.log("number of users=", this.selected.length);
    //console.log(this.selected);

    let userIds = [];
    for (x=0;x<this.selected.length;x++) {
      let user = this.selected[x];
      console.log("name = ", user.profile.name);
      userIds[x] = user._id;
    }

    if  (this.mode=='share') {
      this.doShare(this.taskId, userIds);
    } else {
      this.doRequest(this.taskId, userIds);
    }

  }

  doShare(taskId, userIds) {
    console.log("----doShare()----");
    shareMany.call({
      taskId: taskId,
      otherUserId: userIds
    }, (err, res) => {
      if (err) {
        alert(err);
      } else {
        // success!
      }
    });
  }

  doRequest(taskId, userIds) {
    console.log("-----doRequest()----");
  }

  getPhotoUrl(user) {
    return this.uiService.getProfilePhoto(user);
  }

  getOAuthSource(user) {
    if (user.services.facebook) {
      return "via Facebook";
    }
    if (user.services.google) {
      return "via Google";
    }
  }

  handleError(err) {
    this.$log.error('New chat creation error ', err);

    this.$ionicPopup.alert({
      title: err.reason || 'New chat creation failed',
      template: 'Please try again',
      okType: 'button-positive button-clear'
    });
  }

}


function chatsAddService($rootScope, $state, uiService) {
  'ngInject';

  var service = {
    openModal: openModal
  }
  return service;

  // mode = "share" or "request"
  function openModal(taskId, taskName, mode) {
    var modal = "<chats-add task-id='" + taskId + "' task-name='" + taskName + "' mode='" + mode + "'></chats-add>";
    console.log(modal);
    uiService.openModal(modal);
  }
}


// create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
    pxModalHeader,
    Avatar,
    //'ngAvatar'
  ])
  .component(name, {
    templateUrl: `imports/ui/components/${name}/${name}.html`,
    bindings: {
      taskId: '@',
      taskName: '@',
      mode: '@'
    },
    controllerAs: name,
    controller: ChatsAdd
  })
  .factory(statusHelper.getServiceName(name), chatsAddService);
