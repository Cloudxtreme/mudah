import {  Tasks} from '../tasks/collection';
import {  Messages} from '../tasks/collection';
import {  statusHelper} from '../../ui/helpers/statusHelper';
import { deleteProfilePhoto } from '/imports/api/methods/taskMethods';

import _ from 'underscore';
import { ltrim as _ltrim } from 'underscore.string';
import { isBlank as _isBlank }  from 'underscore.string';
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

  getDefaultSortBy() {
    const sortBy = {
      createDate: -1
    };
    return sortBy;
  }

  getDraftList(userId) {

    return Tasks.find( {
      $and: [
        {status : 'DRAFT'},
        {creator : userId }
        ]
    }, {
      sort :  {
          editedDate : -1
        }
    });
  }

  getActiveList(userId) {
    return Tasks.find({
      $and: [{
        status: {
          $ne: 'DRAFT'
        }
      },
      {
        archived: false
      },
      {
        request: false
      },
      {
        creator: userId
      }]
    },
    {
      sort :  {
          createDate : -1,
          requestId: -1,
          requestSeqId: 1
        }
    });
  }

  getKudosList(userId) {
    return Tasks.find({
      $and: [{
        archived: true
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
        archived: true
      }, {
        creator: userId
      }]
    });
  }

  getRequestList(userId) {
    return Tasks.find({
      $and: [{
        status: {
          $ne: 'DRAFT'
        }
      },
      {
        $or: [
          {
            $and: [
              {userIds: userId},
              {requestHeader: false}
            ]
          },
          {
            $and: [
              {creator: userId},
              {request: true}
            ]
          }
        ]
      }
    ]},{
      sort :  {
          createDate : -1,
          requestId: -1,
          requestSeqId: 1
        }
    } );
  }

  replacePhoto(params) {
    console.log("taskHelper replacePhoto");

    let photo=null;
    let photoId=null;


    if ( params.photoType=='profile') {
      user = Meteor.users.findOne( Meteor.userId() );
      photo = user.profile.photo;
        // update new profile photo url
      Meteor.users.update(Meteor.userId(), {$set: {"profile.photo": params.newUrl}} );
    } else {
      task = this.getPermittedTask( params.taskId);
      photo = task.photo;
      Meteor.call('updateTaskPhoto',{taskId: params.taskId, photo: params.newUrl},
        function(err) {
          if ( err ) {
            console.log("can't update task photo err=", err);
          }
      });
    }

    // ---- delete from S3 ---
    let url = Meteor.settings.AWSLink;
    photoId = _ltrim(photo, url);   // clip out the datakey from the long URL

    console.log("trimmed key=", photoId);
    if ( photoId.length>0 ) {
      Meteor.call('deletePhotoFromS3',{dataKey: photoId},
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
