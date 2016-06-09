import { invite, rsvp } from './methods';
import { Tasks } from './collection';

import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
  describe('Tasks / Methods', () => {
    describe('invite', () => {
      function loggedIn(userId = 'userId') {
        return {
          userId
        };
      }

      it('should be called from Method', () => {
        spyOn(invite, 'apply');

        try {
          Meteor.call('invite');
        } catch (e) {}

        expect(invite.apply).toHaveBeenCalled();
      });

      it('should fail on missing taskId', () => {
        expect(() => {
          invite.call({});
        }).toThrowError();
      });

      it('should fail on missing userId', () => {
        expect(() => {
          invite.call({}, 'taskId');
        }).toThrowError();
      });

      it('should fail on not logged in', () => {
        expect(() => {
          invite.call({}, 'taskId', 'userId');
        }).toThrowError(/logged in/i);
      });

      it('should look for a task', () => {
        const taskId = 'taskId';
        spyOn(Tasks, 'findOne');

        try {
          invite.call(loggedIn(), taskId, 'userId');
        } catch (e) {}

        expect(Tasks.findOne).toHaveBeenCalledWith(taskId);
      });

      it('should fail if task does not exist', () => {
        spyOn(Tasks, 'findOne').and.returnValue(undefined);

        expect(() => {
          invite.call(loggedIn(), 'taskId', 'userId');
        }).toThrowError(/404/);
      });

      it('should fail if logged in user is not the creator', () => {
        spyOn(Tasks, 'findOne').and.returnValue({
          creator: 'notUserId'
        });

        expect(() => {
          invite.call(loggedIn(), 'taskId', 'userId');
        }).toThrowError(/404/);
      });

      it('should fail on public task', () => {
        spyOn(Tasks, 'findOne').and.returnValue({
          creator: 'userId',
          public: true
        });

        expect(() => {
          invite.call(loggedIn(), 'taskId', 'userId');
        }).toThrowError(/400/);
      });

      it('should NOT invite user who is the creator', () => {
        spyOn(Tasks, 'findOne').and.returnValue({
          creator: 'userId'
        });
        spyOn(Tasks, 'update');

        invite.call(loggedIn(), 'taskId', 'userId');

        expect(Tasks.update).not.toHaveBeenCalled();
      });

      it('should NOT invite user who has been already invited', () => {
        spyOn(Tasks, 'findOne').and.returnValue({
          creator: 'userId',
          invited: ['invitedId']
        });
        spyOn(Tasks, 'update');

        invite.call(loggedIn(), 'taskId', 'invitedId');

        expect(Tasks.update).not.toHaveBeenCalled();
      });

      it('should invite user who has not been invited and is not the creator', () => {
        const taskId = 'taskId';
        const userId = 'notInvitedId';
        spyOn(Tasks, 'findOne').and.returnValue({
          creator: 'userId',
          invited: ['invitedId']
        });
        spyOn(Tasks, 'update');
        spyOn(Meteor.users, 'findOne').and.returnValue({});

        invite.call(loggedIn(), taskId, userId);

        expect(Tasks.update).toHaveBeenCalledWith(taskId, {
          $addToSet: {
            invited: userId
          }
        });
      });
    });

    describe('rsvp', () => {
      function loggedIn(userId = 'userId') {
        return {
          userId
        };
      }

      it('should be called from Method', () => {
        spyOn(rsvp, 'apply');

        try {
          Meteor.call('rsvp');
        } catch (e) {}

        expect(rsvp.apply).toHaveBeenCalled();
      });

      it('should fail on missing taskId', () => {
        expect(() => {
          rsvp.call({});
        }).toThrowError();
      });

      it('should fail on missing rsvp', () => {
        expect(() => {
          rsvp.call({}, 'taskId');
        }).toThrowError();
      });

      it('should fail if not logged in', () => {
        expect(() => {
          rsvp.call({}, 'taskId', 'rsvp');
        }).toThrowError(/403/);
      });

      it('should fail on wrong answer', () => {
        expect(() => {
          rsvp.call(loggedIn(), 'taskId', 'wrong');
        }).toThrowError(/400/);
      });

      ['yes', 'maybe', 'no'].forEach((answer) => {
        it(`should pass on '${answer}'`, () => {
          expect(() => {
            rsvp.call(loggedIn(), 'taskId', answer);
          }).not.toThrowError(/400/);
        });
      });

      // TODO: more tests  
    });
  });
}
