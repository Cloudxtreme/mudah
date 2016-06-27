import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Counts } from 'meteor/tmeasday:publish-counts';

import './requestList.html';

import { taskHelper } from '/imports/api/methods/taskHelper';
import { name as TaskDetail } from '../taskDetail/taskDetail';
import { name as EmptyList } from '/imports/ui/directives/emptyList';
import { name as UserPromise } from '/imports/ui/components/userPromise/userPromise';
import { name as PromiseView } from '/imports/ui/components/promiseView/promiseView';
import { name as RequestView } from '/imports/ui/components/requestView/requestView';

const name = 'requestList';

class RequestList {
  constructor($scope, $reactive, uiService, taskDetailService, chatService,promiseViewService, requestViewService)  {
    'ngInject';

    $reactive(this).attach($scope);
    this.uiService = uiService;
    this.taskDetailService = taskDetailService;
    this.promiseViewService = promiseViewService;
    this.requestViewService = requestViewService;
    this.chatService = chatService;

    this.activeGroups = [];

    this.load();
  }

  load() {

    this.subscribe('tasks', () => [
        'requestList'
    ], {
      onReady: function () {
        console.log("requestList subscription - onReady And the Items actually Arrive", arguments);
        //subscriptionHandle.stop();  // Stopping the subscription, will cause onStop to fire
      },
      onStop: function (error) {
        if (error) {
          console.log('An error happened - ', error);
        } else {
          console.log('---- The requestList subscription stopped -----');
        }
    }
  });

    this.helpers({
      tasks() {
        const obj = taskHelper.getRequestList(Meteor.userId());
        console.log("got data in helper ---");
        return obj;
      },
      tasksCount() {
        return Counts.get('numberOfTasks');
      }
    });
  }

  toggleGroup(task) {
    var index = this.activeGroups.indexOf(task.requestId);
    if (index > -1) {
      this.activeGroups.splice(index, 1);
    } else {
      this.activeGroups.push(task.requestId);
    }
  }


  isGroupShown(task) {
    return (  this.activeGroups.indexOf(task.requestId) >=0 );
  }

  isBelongToGroup(task) {
    if ( task.isParticipant()  ) {
      return false;
    }


    return ( task.isGroupRequest() );
  }

  openDetail($event, task) {
    this.uiService.stopFurtherClicks($event);
    if ( task.isRequest() ) {
      this.requestViewService.openModal(task);
    } else {
      this.promiseViewService.openModal(task, "requestViewOptions");
    }

    // this.taskDetailService.openModal(task, this.taskDetailService.requestListOptions);
  }
}


// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  TaskDetail,
  EmptyList,
  UserPromise,
  PromiseView,
  RequestView
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: RequestList
})
.config(config);

function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('tab.requestList', {
      url: '/requestList',
      views: {
        'tab-request': {
          template: '<request-list></request-list>'
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
