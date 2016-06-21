import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor'

import { statusHelper } from '/imports/ui/helpers/statusHelper';
import { rtrim as _rtrim } from 'underscore.string';
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

  toggleEdit() {
    this.showEdit = !this.showEdit;
    if (this.showEdit) {
      this.oldComment = this.task.comment;
      this.uiService.focusField("#commentField");
    }
  }

  show() {
    return ( this.task.status== statusHelper.status.DONE || this.task.status== statusHelper.status.NOTDONE || this.task.isCompleted() );
  }



  action(val) {
    if  ( this.showEdit==false) { return; }

    this.showEdit=false;
    if ( this.oldComment !== this.task.comment ) {
      this.updateComment(this.task);
      this.sendChatMessage(this.task);
    } 

  }

  updateComment(task) {
    this.call('updateTaskComment',{taskId:task._id, comment: _rtrim(task.comment) });
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
