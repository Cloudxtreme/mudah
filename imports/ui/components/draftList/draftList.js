import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor';

import { Counts } from 'meteor/tmeasday:publish-counts';

import './draftList.html';

import { Tasks } from '../../../api/tasks';
import { name as TaskShare } from '../taskShare/taskShare';
import { name as TaskDelete } from '../taskDelete/taskDelete';
import { name as TaskEdit } from '../taskEdit/taskEdit';
import { name as uiService } from '/imports/ui/services/uiService';
import { taskHelper } from '/imports/api/methods/taskHelper';
import { statusHelper } from '/imports/ui/helpers/statusHelper';
import { name as ChatInputDirective } from '../../directives/chatInputDirective';
import { addTask } from '/imports/api/methods/taskMethods';
import { name as EmptyList } from '/imports/ui/directives/emptyList';
import { rtrim } from 'underscore.string';
import { isBlank } from 'underscore.string';
import { clone as _clone } from 'underscore';

const name = 'draftList';

var create=false;

class DraftList {
  constructor($scope, $reactive, $scope, $state, $timeout, uiService, taskEditService, dueDateEditService) {
    'ngInject';

    this.$scope = $scope;
    this.$state = $state;
    this.$timeout = $timeout;
    this.uiService = uiService;
    this.taskEditService = taskEditService;
    this.dueDateEditService = dueDateEditService;
    this.statusHelper = statusHelper;

    $reactive(this).attach($scope);



    this.sort = {
      creator: 1
    };
    this.searchText = '';

    this.subscribe('tasks', () => [
      //  limit: parseInt(this.perPage),
      //  skip: parseInt((this.getReactively('page') - 1) * this.perPage),
        'promiseList'
    ]);


    this.helpers({
      tasks() {
        return taskHelper.getDraftList(Meteor.userId());
      },
      tasksCount() {
        return Counts.get('numberOfTasks');
      },
      isLoggedIn() {
        return !!Meteor.userId();
      },
      currentUserId() {
        return Meteor.userId();
      }
    });

    this.init();
    this.showCreate=false;
    this.showEdit=false;
    this.initHelp();
    this.currTask={};
  }

  init() {
    this.taskName="";
    this.editTask=null;
    this.initHelp();
  }

  action() {
    this.$scope.$broadcast('scroll.refreshComplete');   //Stop the ion-refresher from spinning

    if ( this.showCreate==false && this.showEdit==false) { //nothing is opened, so open the Create form
      this.showCreateForm();
      return; //open the create form;
    }

    if ( this.showCreate) {
      this.create();
    } else {
      this.update()
    }
  }

  showCreateForm() {
    this.showCreate = true;
    this.showCreateHelp();

     this.focusField('#createInputField');
  }

  create() {
    if ( this.showCreate==false && this.showEdit==true) {
      return; // to deal with case where (1) Createform is open and you click on an item to edit
    }

    this.showCreate  = true;

    console.log("create taskName = ", this.taskName);

    if (this.taskName.length ==0 ) {
      this.hideCreate();
      return;
    }

    this.call('addTask',
      {taskName: this.taskName},
      function(err,res) {
        if (err) {
          alert("add task error e=",err);
        }
        console.log("---> init()");
        this.init();
      });
  }

  onPulling() {
    //console.log("onPulling");
  }

  hideCreate() {
    this.showCreate = false;
    this.init();
  }

  hideEdit() {
    this.showEdit = false;
    this.init();
    this.unmarkTask();
  }

  initHelp() {
    this.showCreateHelp();
  }

  showCreateHelp() {
    this.helpMessage = "Pull to create new Promise";
    this.pullingText = "Create";
  }
  showEditHelp() {
    this.helpMessage = "Pull to update Promise";
    this.pullingText = "Update";
  }

  openEdit($event, task) {
    this.uiService.stopFurtherClicks($event);
    this.taskEditService.openModal(task);

    // do the hides() after 'task' is used, as its details will be initialised
    this.hideCreate();
    this.hideEdit();
  }

  saveAndOpenTaskEdit() {
    this.call('addTask', {
      taskName: this.taskName,
    }, function(err,_id) {
        this.hideCreate();
        //console.log("added _id=", _id);
        let task = taskHelper.getMyTask(_id);
        this.taskEditService.openModal(task);
    });
  }

  hasDueDate(task) {
    return ( task!=null && task.dueDate!=null);
  }

  editName($event,task) {
    this.uiService.stopFurtherClicks($event);
    this.hideCreate();
    this.showEdit=true;
    this.showEditHelp();
    this.markTask(task);

    this.editTask = _clone( task );
    this.editTask.name = task.name + " ";  // this will place the cursor at end of taskName

    this.focusField('#editInputField');
    //console.log("edit id=" + this.editTask._id + " name=", this.editTask.name);
  }

  focusField(field) {
    //let el = angular.element('#editInputField');
    let el = angular.element(field);
    el.focus();
    this.$timeout(function() {
      el.focus();
    });
  }

  markTask(task) {
    this.unmarkTask();
    this.currTask = task;
    this.currTask.selected = true;  // highlist item on list
  }

  unmarkTask() {
    this.currTask.selected = false;  // highlist item on list
  }

  isSelected(task) {
    return task.selected;
  }

  isShowIcons() {
    return Meteor.settings.public.features.draftlist_icons;
  }

  onSwipeUp() {
    this.hideCreate();
    this.hideEdit();
  }

  update() {
     // bug : update() is being called twice. see chatInputDirective.js
    if ( this.editTask==undefined || isBlank(this.editTask.name) ) {
      console.log("blank name");
      return;
    }

    if ( rtrim(this.editTask.name) == rtrim(this.currTask.name) ) {
      console.log("no change to name");
      this.hideEdit();
      return;
    }

    this.call('updateTaskName',
      {taskId: this.editTask._id, taskName: this.editTask.name},
      function(err,res) {
        if (err) {
          alert("update error e=",err);
        }
        this.hideEdit();
      });
  }



}


// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  TaskEdit,
  TaskDelete,
  TaskShare,
  uiService,
  ChatInputDirective,
  EmptyList
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: DraftList
})
  .config(config);

function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('tab.draftList', {
      url: '/draftList',
      views: {
        'tab-create': {
          template: '<draft-list></draft-list>'
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
