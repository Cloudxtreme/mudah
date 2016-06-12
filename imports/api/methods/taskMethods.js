import { Tasks } from '../tasks/collection';
import { Messages } from '../tasks/collection';
import { statusHelper } from '/imports/ui/helpers/statusHelper';
import { taskHelper } from './taskHelper';
import { Accounts } from 'meteor/accounts-base';

import AWS from 'aws-sdk';

import _ from 'underscore';

// Schema docs : https://atmospherejs.com/aldeed/simple-schema
// beware performance issue with Friends array : http://guide.meteor.com/collections.html#schema-design

TaskSchema = new SimpleSchema({
  _id : {type: String, regEx: SimpleSchema.RegEx.Id},
  name: {type: String, optional:false},
  createDate: {type: Date},
  edited: {type:Boolean, optional:true},
  editedBy: {type:String, optional:true},
  neverCountered: {type:Boolean, optional:true},
  status: {type:String},
  statusBy: {type:String},
  ack: {type:Boolean, optional:true},
  ackBy: {type:String, optional:true},
  private: {type:Boolean},
  completed: {type:Boolean, optional:true},
  archived: {type:Boolean, optional:true},
  creator: {type:String},

  area: {type: String, optional:true},
  value: {type: String, optional:true},
  reward: {type: String, optional:true},
  forfeit: {type: String, optional:true},
  dueDate : {type: Date},
  userIds : {type: [String] , optional:true}
});

EditSchema = new SimpleSchema({
  $$hashKey: {type:String, optional:true},  // meteor adds this
  _id : {type: String, regEx: SimpleSchema.RegEx.Id},
  name: {type: String, optional:false},
  reward: {type: String, optional:true},
  forfeit: {type: String, optional:true},
  dueDate : {type: Date, optional:true},
  neverCountered: {type:Boolean},
  userIds : {type: [String]}
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

    task = {};
    task.name = taskName;
    task.status = "DRAFT";
    task.statusBy = null;

    task.ack = false;      // acknowledgement for status channge
    task.ackBy = null;

    task.area = null;
    task.value=null;
    task.reward = null;
    task.forfeit = null;
    task.dueDate = null;

    task.edited = false;     // used for counter-offers
    task.editedBy = null;
    task.neverCountered = true;  // for UI to display label as Edit or Offer

    task.private = true;
    task.completed = false;
    task.archived = false;
    task.creator = Meteor.userId();
    task.createDate = new Date();
    task.userIds = [];

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
            'ack' : false,
            'ackBy' : null
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

    if ( statusHelper.isParticipant(task) && task.neverCountered==true) {  // watcher is countering this offer
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
        neverCountered : task.neverCountered,
        ack : false,
        ackBy : null
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

    if (statusHelper.isCreator(origTask) ) {
      Tasks.update({
        _id: taskId
      }, {
        $set: {
          dueDate: dueDate,
        }
      });
    } else {
      console.log("no such task, or not owner");
    }
  }
});



export const shareMany = new ValidatedMethod({
  name: 'shareMany',

  validate: new SimpleSchema({
      taskId: {type:String},
      otherUserId: {type:[String]}
    }).validator(),

  run({ taskId,newStatus, otherUserId }) {
    console.log("shareMany userIds=");
    console.log(otherUserId);


      const origTask = taskHelper.getMyTask(taskId); // will throw Exception if no permission

      Tasks.update(taskId, {
        $set: {
          'status' : statusHelper.status.PENDING,
          'statusBy' : Meteor.userId(),
          'ack' : false,
          'ackBy' : null,
          'edited': true,
          'editedBy' : Meteor.userId(),
          'private' : false
        },
        $addToSet: {  userIds: {$each: otherUserId } }
      });

  }
});



export const markAsAcknowledged = new ValidatedMethod({
  name: 'markAsAcknowledged',

  validate: new SimpleSchema({
      taskId: {type:String}
    }).validator(),

  run({ taskId }) {
      const origTask = taskHelper.getPermittedTask(taskId); // will throw Exception if no permission

      Tasks.update({
        _id: taskId
      }, {
        $set: {
          'ack': true,
          'ackBy' : Meteor.userId()
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
        'completed': true
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
    const origTask = taskHelper.getMyTask(taskId); // will throw Exception if no permission
    Tasks.remove(taskId);
   }
});


export const newMessage = new ValidatedMethod({
  name: 'newMessage',

  validate: new SimpleSchema({
      text: {type:String},
      chatId : {type:String}
    }).validator(),

  run({ text,chatId }) {
    const origTask = taskHelper.getPermittedTask(chatId); // will throw Exception if no permission

    let message = {};
    message.text = text;
    message.chatId = chatId;
    message.timestamp = new Date();
    message.userId = Meteor.userId();

    const messageId = Messages.insert(message);

    Tasks.update(message.chatId, { $set: { lastMessage: message } });
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


// delete Object : https://github.com/CulturalMe/meteor-slingshot/issues/50
export const deleteProfilePhotoFromS3 = new ValidatedMethod({
  name: 'deleteProfilePhotoFromS3',

  validate: new SimpleSchema({
      userId: {type: String, regEx: SimpleSchema.RegEx.Id},
      dataKey: {type:String,optional:false}
    }).validator(),

  run({  userId,dataKey }) {
    if ( Meteor.isServer ) {
      console.log("deleteProfilePhotoFromS3 dataKey=", dataKey);

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
