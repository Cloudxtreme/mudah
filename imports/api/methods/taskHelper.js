import {  Tasks} from '../tasks/collection';
import {  Messages} from '../tasks/collection';
import {  statusHelper} from '../../ui/helpers/statusHelper';
import { deleteProfilePhoto } from '/imports/api/methods/taskMethods';

import _ from 'underscore';
import { ltrim } from 'underscore.string';

/*-------
* HELPERS
--------*/
class TaskHelper {
  constructor() {}

  // get Task, task must belong to the logged-in User
  getMyTask(taskId) {
    const task = Tasks.findOne(taskId);
    //const task = Tasks.findOne("kJ25gauz55FcFo9CK");
    if (!task) {
      this.handleMethodError(404, "no such task"); // if user doesnt have permission, this Task won't be in the subscription
    }

    if (statusHelper.isCreator(task) == false) {
      this.handleMethodError(404, "no permission");
    }

    return task;
  }

  // get Task, task must belong to the logged-in User OR logged-in user must have permission to use the Task
  getPermittedTask(taskId) {
    const task = Tasks.findOne(taskId);
    //const task = Tasks.findOne("dKzgP7cTEYKuKkFxe");
    //const task = Tasks.findOne("kJ25gauz55FcFo9CK");

    if (!task) {
      this.handleMethodError(404, "no such task"); // if user doesnt have permission, this Task won't be in the subscription
    }

    if (statusHelper.hasPermission(task) == false) {
      this.handleMethodError(404, "no permission");
    }

    return task;
  }

  getDraftList(userId) {
    const sortBy = {
      dueDate: 1,
      createDate: -1
    };

    return Tasks.find( {
      $and: [
        {status : 'DRAFT'},
        {creator : userId }
        ]
    }, {
      sort :sortBy
    });
  }

  getActiveList(userId) {
    return Tasks.find({
      $and: [{
        status: {
          $ne: 'DRAFT'
        }
      }, {
        completed: false
      }, {
        creator: userId
      }]
    });
  }

  getKudosList(userId) {
    return Tasks.find({
      $and: [{
        completed: true
      }, {
        creator: {
          $ne: userId
        }
      }]
    });
  }

  getCompletedList(userId) {
    return Tasks.find({
      $and: [{
        completed: true
      }, {
        creator: userId
      }]
    });
  }

  getWatchList(userId) {
    return Tasks.find({
      $and: [{
        status: {
          $ne: 'DRAFT'
        }
      }, {
        completed: false
      }, {
        creator: {
          $ne: userId
        }
      }]
    });
  }

  replaceProfilePhoto(downloadUrl) {
    console.log("taskHelper replaceProfilePhoto");

    let user = Meteor.users.findOne( Meteor.userId() );
    if (user) {
      let photo = user.profile.photo;
      let url = Meteor.settings.AWSLink;
      let dataKey = ltrim(photo, url);

      console.log("trimmed key=", dataKey);

      // update new profile photo url
      Meteor.users.update(Meteor.userId(), {$set: {"profile.photo": downloadUrl}} );

      // delete from S3
      Meteor.call('deleteProfilePhotoFromS3',{userId: Meteor.userId(), dataKey: dataKey},
        function(err) {
          if ( err ) {
            console.log("can't delete err=", err);
          }
		  });

    }
  }

  getUser(userId) {
    if (userId != null) {
        tmpUser = Meteor.users.findOne(userId);
        return tmpUser;
      }
      return null;
  }

  handleMethodError(error, reason, details) {
      var meteorError = new Meteor.Error(error, reason, details);

      if (Meteor.isClient) {
        throw meteorError;
      }

      if (Meteor.isServer) {
        //return meteorError;
        console.log("Server method error err=", error + " reason=", reason);
        throw meteorError;
      }
  }

}


export const taskHelper = new TaskHelper();
