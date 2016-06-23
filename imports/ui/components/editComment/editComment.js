import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor'

import { statusHelper } from '/imports/ui/helpers/statusHelper';
import { trim as _trim } from 'underscore.string';
import './editComment.html';

const name = 'editComment';

class EditComment {
  constructor($scope, $reactive, uiService, $timeout) {
    'ngInject';

    this.uiService = uiService;
    this.$timeout = $timeout;

    $reactive(this).attach($scope);

    this.showEdit = false;

  }

  init() {
    if ( this.task.hasComment() ) {
      this.label = this.task.comment;
    } else {
      this.label = "Say something...";
    }
  }

  toggleEdit() {
    this.showEdit = !this.showEdit;
    if (this.showEdit==true) {
      this.oldComment = this.task.comment;
      this.task.comment = this.task.comment + " ";  // this will place the cursor at end of taskName
      this.uiService.focusField("#commentField");
    }
  }

  show() {
    if ( statusHelper.allow(this.task, name)  ) {
      this.init();
      return true;
    }
    return false;
  }



  action(val) {
    if  ( this.showEdit==false) { return; }

    this.showEdit=false;
    this.task.comment  = _trim(this.task.comment );

    if ( this.isDirty() ) {
      this.label = this.task.comment;
      this.updateComment(this.task);
      this.sendChatMessage(this.task);
    }

    this.init();hotm

  }

  isDirty() {
    return ( this.oldComment !== this.task.comment ) ;
  }

  updateComment(task) {
    this.call('updateTaskComment',{taskId:task._id, comment: task.comment });
  }

  sendChatMessage(task) {
    this.call('newMessage',
      {
        text: task.comment,
        taskId: task._id
      });
  }

}


// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter
])
  .component(name, {
    templateUrl: `imports/ui/components/${name}/${name}.html`,
    bindings: {
      task: '<'
    },
    controllerAs: name,
    controller: EditComment
  })
