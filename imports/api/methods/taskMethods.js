import { Tasks } from '../tasks/collection';
import { Messages } from '../tasks/collection';
import { statusHelper } from '/imports/ui/helpers/statusHelper';
import { taskHelper } from './taskHelper';
import { Accounts } from 'meteor/accounts-base';

import AWS from 'aws-sdk';

import {clone as _clone } from 'underscore';
import {without as _without } from 'underscore';
import {contains as _contains } from 'underscore';

// Schema docs : https://atmospherejs.com/aldeed/simple-schema
// beware performance issue with Friends array : http://guide.meteor.com/collections.html#schema-design

TaskSchema = new SimpleSchema({
  _id : {type: String, regEx: SimpleSchema.RegEx.Id},
  name: {type: String, optional:false},
  creator: {type:String},
  createDate: {type: Date},

  edited: {type:Boolean, optional:true},
  editedBy: {type:String, optional:true},
  editedDate: {type: Date},

  status: {type:String},
  statusBy: {type:String},
  statusDate: {type: Date},
  neverCountered: {type:Boolean},
  private: {type:Boolean},
  request: {type:Boolean},
  requestId: {type:String},
  requestSeqId: {type:Number},

  ack: {type:Boolean, optional:true},
  ackBy: {type:String, optional:true},

  archived: {type:Boolean, optional:true},
  photo: {type:String,optional:true},
  comment: {type:String,optional:true},

  completed: {type:Boolean, optional:true},
  completedDate : {type: Date},

  dueDate : {type: Date},
  reward: {type: String, optional:true},
  forfeit: {type: String, optional:true},
  area: {type: String, optional:true},
  value: {type: String, optional:true},
  watcherIds : {type: [String] , optional:true},  // watchers of a promise
  promiserIds : {type: [String] , optional:true}  // those asked to promise something (ie. carry out a request)
});

EditSchema = new SimpleSchema({
  $$hashKey: {type:String, optional:true},  // meteor adds this
  _id : {type: String, regEx: SimpleSchema.RegEx.Id},
  name: {type: String, optional:false},
  reward: {type: String, optional:true},
  forfeit: {type: String, optional:true},
  dueDate : {type: Date, optional:true},
  neverCountered: {type:Boolean},
  promiserIds : {type: [String]},
  watcherIds : {type: [String]}
});

/*-------
* METHODS
--------*/
export const addTask = new ValidatedMethod({
  name: 'addTask',

  validate: new SimpleSchema({
    taskName: {type: String, optional:false}
  }).validator(),

  // Factor out Method body so that it can be called independently (3)
  run({ taskName}) {
    console.log("insert method task=" + taskName );

    task = initTask(taskName);

    let _id = Tasks.insert(task);
    return _id;
  }
});


export const updateStatus = new ValidatedMethod({
  name: 'updateStatus',

  validate: new SimpleSchema({
      taskId: { type: String },
      newStatus: { type: String }
    }).validator(),

  // Factor out Method body so that it can be called independently (3)
  run({ taskId, newStatus }) {
    console.log("updateStatus method task=" + taskId + " status=" + newStatus + " user=", Meteor.userId());

      const task = taskHelper.getPermittedTask(taskId);
      Tasks.update({
          _id: taskId
        }, {
          $set: {
            'status': newStatus,
            'statusBy' : Meteor.userId(),
            'statusDate' : new Date(),
            'ack' : false,
            'ackBy' : null
          }
        });
  }
});


export const acceptTask = new ValidatedMethod({
  name: 'acceptTask',

  validate: new SimpleSchema({
      taskId: { type: String }
    }).validator(),


  run({ taskId }) {
    console.log("acceptTask method task=" + taskId );

      const task = taskHelper.getPermittedTask(taskId);

      if ( task.isPromise() ) {
        Tasks.update({
            _id: taskId
          }, {
            $set: {
              'status': statusHelper.status.ACTIVE,
              'statusBy' : Meteor.userId(),
              'statusDate' : new Date(),
              'ack' : false,
              'ackBy' : null
            }
          });
      } else {
        // turn a Request into a Promise
        console.log("turn a request into a promise");

        Tasks.update({
            _id: taskId
          }, {
            $set: {
              request: false,
              creator : task.promiserIds[0],  // the promiser becomes the 'creator/owner'
              watcherIds : [ task.creator ], // turn the original Creator into a Watcher,
              promiserIds : [],
              status: statusHelper.status.ACTIVE,
              statusBy : Meteor.userId(),
              statusDate : new Date(),
              ack : false,
              ackBy : null
            }
          });
      }
  }
});

export const declineTask = new ValidatedMethod({
  name: 'declineTask',

  validate: new SimpleSchema({
      taskId: { type: String }
    }).validator(),

  run({ taskId }) {
    console.log("decline task...");
      const task = taskHelper.getPermittedTask(taskId);
      updateStatus.call({taskId:taskId, newStatus: statusHelper.status.DECLINED});
  }
});


export const revokeTask = new ValidatedMethod({
  name: 'revokeTask',

  validate: new SimpleSchema({
      taskId: { type: String }
    }).validator(),


  run({ taskId }) {
    console.log("revokeTask method task=" + taskId );

    const task = taskHelper.getMyTask(taskId);

    let newStatus= statusHelper.status.REVOKED;
    if ( task.status==statusHelper.status.PENDING ) {
      newStatus= statusHelper.status.CANCELLED;
    }

    Tasks.update({
          _id: taskId
    }, {
          $set: {
            status: newStatus,
            statusBy : Meteor.userId(),
            statusDate : new Date(),
            edited: true,               // so that, the other person has to Accept/Decline
            editedBy:  Meteor.userId(),
            editedDate : new Date(),
            ack : false,
            ackBy : null,
            neverCountered : true
          }
    });
  }
});

export const unrevokeTask = new ValidatedMethod({
  name: 'unrevokeTask',

  validate: new SimpleSchema({
      taskId: { type: String }
    }).validator(),

  run({ taskId }) {

      const task = taskHelper.getMyTask(taskId);

      if ( task.hasParticipants() ) {
        newStatus = statusHelper.status.PENDING;
      } else {
        newStatus = statusHelper.status.ACTIVE;
      }

      Tasks.update({
          _id: taskId
        }, {
          $set: {
            status: newStatus,
            statusBy : Meteor.userId(),
            statusDate : new Date(),
            ack : false,
            ackBy : null,
            comment: ""     //wipe out
          }
        });
  }
});


export const updateTask = new ValidatedMethod({
  name: 'updateTask',

  validate: new SimpleSchema({
      task: {type:EditSchema}
    }).validator(),

  run({ task }) {
    const oldTask = taskHelper.getPermittedTask(task._id); // will throw Exception if no permission


    if ( task.neverCountered==true && _contains(task.watcherIds, Meteor.userId()) ) {  // watcher is countering this offer
      task.neverCountered = false;
    }

    Tasks.update({
      _id: task._id
    }, {
      $set: {
        name: task.name,
        reward: task.reward,
        forfeit: task.forfeit,
        dueDate: task.dueDate,
        edited: true,
        editedBy:  Meteor.userId(),
        editedDate : new Date(),
        neverCountered : task.neverCountered
      }
    });
  }
});

export const updateTaskName = new ValidatedMethod({
  name: 'updateTaskName',

  validate: new SimpleSchema({
    taskId: {type:String,optional:false},
    taskName: {type:String,optional:false}
  }).validator(),

  run({ taskId, taskName }) {
    const oldTask = taskHelper.getPermittedTask(taskId); // will throw Exception if no permission

    Tasks.update({
      _id: taskId
    }, {
      $set: {
        name: taskName,
        edited: true,
        editedBy:  Meteor.userId(),
        editedDate:  new Date()
      }
    });
  }
});


export const updateArea = new ValidatedMethod({
  name: 'updateArea',

  validate: new SimpleSchema({
    taskId: {type:String,optional:false},
    newArea: {type:String,optional:false}
  }).validator(),

  run({ taskId, newArea }) {
    const oldTask = taskHelper.getMyTask(taskId); // will throw Exception if no permission

    Tasks.update({
      _id: taskId
    }, {
      $set: {
        area: newArea
      }
    });
  }
});

export const updateValue = new ValidatedMethod({
  name: 'updateValue',

  validate: new SimpleSchema({
    taskId: {type:String,optional:false},
    newValue: {type:String,optional:false}
  }).validator(),

  run({ taskId, newValue }) {
    const oldTask = taskHelper.getPermittedTask(taskId); // will throw Exception if no permission

    Tasks.update({
      _id: taskId
    }, {
      $set: {
        value: newValue
      }
    });
  }
});


export const updateDueDate = new ValidatedMethod({
  name: 'updateDueDate',

  validate: new SimpleSchema({
      taskId: {type:String,optional:false},
      dueDate: {type:Date,optional:false}
    }).validator(),

  run({ taskId, dueDate }) {
    const origTask = taskHelper.getPermittedTask(taskId); // will throw Exception if no permission

    if ( orig.isCreator() ) {
      Tasks.update({
        _id: taskId
      }, {
        $set: {
          dueDate: dueDate,
          editedBy:  Meteor.userId(),
          editedDate: new Date()
        }
      });
    } else {
      console.log("no such task, or not owner");
    }
  }
});



export const shareTask = new ValidatedMethod({
  name: 'shareTask',

  validate: new SimpleSchema({
      taskId: {type:String},
      otherUserId: {type:[String]}
    }).validator(),

  run({ taskId,newStatus, otherUserId }) {

      const origTask = taskHelper.getMyTask(taskId); // will throw Exception if no permission

      Tasks.update(taskId, {
        $set: {
          status : statusHelper.status.PENDING,
          statusBy : Meteor.userId(),
          ack : false,
          ackBy : null,
          private : false,
          watcherIds: otherUserId,
        }
      //  $addToSet: {  watcherIds: {$each: otherUserId } },
      });



  }
});


export const requestTask = new ValidatedMethod({
  name: 'requestTask',

  validate: new SimpleSchema({
      taskId: {type:String},
      userIds: {type:[String]}
    }).validator(),

  run({ taskId, userIds }) {

    const origTask = taskHelper.getMyTask(taskId); // will throw Exception if no permission

    const newTask = _clone(origTask);
      delete newTask._id;
      newTask.status = statusHelper.status.PENDING;
      newTask.statusBy = Meteor.userId();
      newTask.private=false;
      newTask.request=true;

    if ( userIds.length == 1 ) {
        Tasks.remove(origTask._id);
    } else {
        // request for Many users
        newTask.requestId = origTask._id;

        Tasks.update({  _id: origTask._id  }, {
          $set: {
            request:true,
            requestId: newTask.requestId,
            requestHeader:true,
            requestSeqId: -1,    // header record for the requests
            status: newTask.status,
            promiserIds: userIds
          }
        });
    }

    for (x=0;x< userIds.length;x++) {
      // make selected friend a Participant
      const friend = userIds[x];
        newTask.promiserIds=[ friend ];
        newTask.requestSeqId = x; //for ordering the requests

      // create new task
        let _id = Tasks.insert(newTask);
        console.log("new id=", _id);
    }

  }
});



export const markAsAcknowledged = new ValidatedMethod({
  name: 'markAsAcknowledged',

  validate: new SimpleSchema({
      taskId: {type:String}
    }).validator(),

  run({ taskId }) {
      const task = taskHelper.getPermittedTask(taskId); // will throw Exception if no permission
      let completedFlag=false;

      if (task.status==statusHelper.status.DONE || task.status==statusHelper.status.NOTDONE ) {
        completedFlag = true; // if done/notdone...automatically set completed = true
      }

      Tasks.update({
        _id: taskId
      }, {
        $set: {
          ack: true,
          ackBy : Meteor.userId(),
          completed : completedFlag
        }
      });
    }
});


export const markAsCompleted = new ValidatedMethod({
  name: 'markAsCompleted',

  validate: new SimpleSchema({
      taskId: {type:String}
    }).validator(),

  run({ taskId }) {
    const origTask = taskHelper.getMyTask(taskId); // will throw Exception if no permission

    Tasks.update({
      _id: taskId
    }, {
      $set: {
        completed : true,
        completedDate:  new Date()
      }
    });
  }
});

export const markAsArchived = new ValidatedMethod({
  name: 'markAsArchived',

  validate: new SimpleSchema({
      taskId: {type:String}
    }).validator(),

  run({ taskId }) {
    const origTask = taskHelper.getMyTask(taskId); // will throw Exception if no permission

    Tasks.update({
      _id: taskId
    }, {
      $set: {
        archived : true
      }
    });
  }
});


export const deleteTask = new ValidatedMethod({
  name: 'deleteTask',

  validate: new SimpleSchema({
      taskId: {type:String}
    }).validator(),

  run({ taskId }) {
    const task = taskHelper.getMyTask(taskId); // will throw Exception if no permission

    if (task.isGroupRequest() ) {
      removeUserFromGroupTask.call({taskId: taskId })
    }

    Tasks.remove(taskId);

   }
});


export const removeUserFromGroupTask = new ValidatedMethod({
  name: 'removeUserFromGroupTask',

  validate: new SimpleSchema({
      taskId: {type:String}
    }).validator(),


  run({ taskId }) {

    const task = taskHelper.getPermittedTask(taskId); // will throw Exception if no permission
    const deleteUserId = task.getRequestRecipientUserId();

    const groupTask = taskHelper.getPermittedTask( task.requestId);

    const newPromiserIds = _without( groupTask.promiserIds , deleteUserId);

    if ( newPromiserIds.length==0) {
        //delete the group's header record
        Tasks.remove(groupTask._id);
    } else {
        Tasks.update(groupTask._id, {
          $set: {
            promiserIds : newPromiserIds
          }
        });
    }

  }
});

export const newMessage = new ValidatedMethod({
  name: 'newMessage',

  validate: new SimpleSchema({
      text: {type:String},
      taskId : {type:String}
    }).validator(),

  run({ text,taskId }) {
    const origTask = taskHelper.getPermittedTask(taskId); // will throw Exception if no permission

    let message = {};
      message.text = text;
      message.taskId = taskId;
      message.timestamp = new Date();
      message.userId = Meteor.userId();

    const messageId = Messages.insert(message);

    Tasks.update(message.taskId, { $set: { lastMessage: message } });
   }
});


export const verifyUserEmail = new ValidatedMethod({
  name: 'verifyUserEmail',

  validate: new SimpleSchema({
      userId: {type: String, regEx: SimpleSchema.RegEx.Id},
    }).validator(),

  run({ userId }) {
    if ( Meteor.isServer ) {
      console.log("Send user verfication email");
      Accounts.sendVerificationEmail(userId);
    }
   }
});



export const updateProfileName = new ValidatedMethod({
  name: 'updateProfileName',

  validate: new SimpleSchema({
      name: {type:String, optional:false}
    }).validator(),

  run({  name }) {
    Meteor.users.update({
      _id: this.userId
    }, {
      $set: {
        'profile.name': name
      }
    });
   }
});

export const updateTaskComment = new ValidatedMethod({
  name: 'updateTaskComment',

  validate: new SimpleSchema({
      taskId: {type:String, optional:false},
      comment: {type:String, optional:false}
    }).validator(),

  run({  taskId,comment }) {
      Tasks.update(taskId, {  $set: {  comment : comment  }    });
   }
});


export const updateTaskPhoto = new ValidatedMethod({
  name: 'updateTaskPhoto',

  validate: new SimpleSchema({
      taskId: {type:String, optional:false},
      photo: {type:String, optional:false}
    }).validator(),

  run({  taskId,photo }) {
      Tasks.update(taskId, {  $set: {  photo : photo  }    });
   }
});

// delete Object : https://github.com/CulturalMe/meteor-slingshot/issues/50
export const deletePhotoFromS3 = new ValidatedMethod({
  name: 'deletePhotoFromS3',

  validate: new SimpleSchema({
      dataKey: {type:String,optional:false}
    }).validator(),

  run({  dataKey }) {
    if ( Meteor.isServer ) {
      console.log("deletePhotoFromS3 dataKey=", dataKey);

      AWS.config.update({
         accessKeyId: Meteor.settings.private.amazon.AWSAccessKeyId,
         secretAccessKey: Meteor.settings.private.amazon.AWSSecretAccessKey
      });


      console.log("after config AWS");

      var s3 = new AWS.S3();
         var params = {
         Bucket: Meteor.settings.private.amazon.AWSBucket,
         Key: dataKey
      };

      console.log("after config AWS S3 bucket");

      var deleteObject = Meteor.wrapAsync(
         s3.deleteObject(params, function(error, data) {
            if(error) {
               console.log("error delete from Amazon S3 e=", error);
            } else {
               console.log("image deleted from Amazon S3 key=", dataKey);
            }
         })
      );
    }
   }
});

// ----- Helpers -----
function initTask(taskName) {

  task = {};
  task.name = taskName;
  task.status = "DRAFT";
  task.statusBy = null;
  task.statusDate = null;
  task.request = false;
  task.requestId=null;
  task.requestHeader=false;

  task.ack = false;      // acknowledgement for status channge
  task.ackBy = null;

  task.area = null;
  task.value=null;
  task.reward = "";
  task.forfeit = "";
  task.dueDate = null;

  task.private = true;
  task.completed = false;
  task.completedDate = null;
  task.archived = false;
  task.photo=null;
  task.comment="";

  task.creator = Meteor.userId();
  task.createDate = new Date();
  task.promiserIds =[];
  task.watcherIds =[];

  task.edited = true;     // used for counter-offers
  task.editedBy = Meteor.userId();
  task.editedDate = task.createDate;
  task.neverCountered = true;  // for UI to display label as Edit or Offer

  return task;
}
