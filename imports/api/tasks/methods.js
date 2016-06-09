import _ from 'underscore';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Email } from 'meteor/email';

import { Tasks } from './collection';
import { Messages } from './collection';


function getContactEmail(user) {
  if (user.emails && user.emails.length)
    return user.emails[0].address;

  if (user.services && user.services.facebook && user.services.facebook.email)
    return user.services.facebook.email;

  return null;
}

export function invite(taskId, userId) {
  check(taskId, String);
  check(userId, String);

  if (!this.userId) {
    throw new Meteor.Error(400, 'You have to be logged in!');
  }

  const task = Tasks.findOne(taskId);

  if (!task) {
    throw new Meteor.Error(404, 'No such task!');
  }

  if (task.creator !== this.userId) {
    throw new Meteor.Error(404, 'No permissions!');
  }

  if (task.public) {
    throw new Meteor.Error(400, 'That task is public. No need to invite people.');
  }

  if (userId !== task.creator && ! _.contains(task.invited, userId)) {
    Tasks.update(taskId, {
      $addToSet: {
        invited: userId
      }
    });

    const replyTo = getContactEmail(Meteor.users.findOne(this.userId));
    const to = getContactEmail(Meteor.users.findOne(userId));

    if (Meteor.isServer && to) {
      Email.send({
        to,
        replyTo,
        from: 'noreply@socially.com',
        subject: `PARTY: ${task.title}`,
        text: `
          Hey, I just invited you to ${task.title} on Socially.
          Come check it out: ${Meteor.absoluteUrl()}
        `
      });
    }
  }
}

export function rsvp(taskId, rsvp) {
  console.log("......rsvp no export");
  check(taskId, String);
  check(rsvp, String);

  if (!this.userId) {
    throw new Meteor.Error(403, 'You must be logged in to RSVP');
  }

  if (!_.contains(['yes', 'no', 'maybe'], rsvp)) {
    throw new Meteor.Error(400, 'Invalid RSVP');
  }

  const task = Tasks.findOne({
    _id: taskId,
    $or: [{
      // is public
      $and: [{
        public: true
      }, {
        public: {
          $exists: true
        }
      }]
    },{
      // is creator
      $and: [{
        creator: this.userId
      }, {
        creator: {
          $exists: true
        }
      }]
    }, {
      // is invited
      $and: [{
        invited: this.userId
      }, {
        invited: {
          $exists: true
        }
      }]
    }]
  });

  if (!task) {
    throw new Meteor.Error(404, 'No such task');
  }

  const hasUserRsvp = _.findWhere(task.rsvps, {
    user: this.userId
  });

  if (!hasUserRsvp) {
    // add new rsvp entry
    Tasks.update(taskId, {
      $push: {
        rsvps: {
          rsvp,
          user: this.userId
        }
      }
    });
  } else {
    // update rsvp entry
    const userId = this.userId;
    Tasks.update({
      _id: taskId,
      'rsvps.user': userId
    }, {
      $set: {
        'rsvps.$.rsvp': rsvp
      }
    });
  }
}

function updateName(name) {
  if (!this.userId) {
    throw new Meteor.Error('not-logged-in',
      'Must be logged in to update his name.');
  }

  check(name, String);

  if (name.length === 0) {
    throw Meteor.Error('name-required', 'Must provide a user name');
  }

  return Meteor.users.update(this.userId, { $set: { 'profile.name': name } });
}

function newChat(otherId) {
  console.log("in Method newChat ! otherId=", otherId);

  if (!this.userId) {
    throw new Meteor.Error('not-logged-in',
      'Must be logged to create a chat.');
  }

  check(otherId, String);
  const otherUser = Meteor.users.findOne(otherId);

  if (!otherUser) {
    throw new Meteor.Error('user-not-exists',
      'Chat\'s user not exists');
  }

  const chat = {
    userIds: [this.userId, otherId],
    createdAt: new Date()
  };

  const chatId = Chats.insert(chat);

  return chatId;
}

function removeChat(chatId) {
  if (!this.userId) {
    throw new Meteor.Error('not-logged-in',
      'Must be logged to create a chat.');
  }

  check(chatId, String);

  const chat = Chats.findOne(chatId);

  if (!chat || !_.include(chat.userIds, this.userId)) {
    throw new Meteor.Error('chat-not-exists',
      'Chat not exists');
  }

  Messages.remove({ chatId: chatId });

  return Chats.remove({ _id: chatId });
}

function updatePicture(data) {
  if (!this.userId) {
    throw new Meteor.Error('not-logged-in',
      'Must be logged in to update his picture.');
  }

  check(data, String);

  return Meteor.users.update(this.userId, { $set: { 'profile.picture': data } });
}

Meteor.methods({
  invite,
  rsvp,
  updateName,
  newChat,
  removeChat,
  updatePicture
});
