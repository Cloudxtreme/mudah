import { updateStatus, addTask } from './taskMethods';
import { Tasks } from '../tasks/collection';
import { statusHelper } from '../../ui/helpers/statusHelper';
import { taskHelper } from './taskHelper';
import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
  describe('taskMethods / test', () => {
    describe('updateStatus', () => {
      function loggedIn(userId = 'userId') {
        return {
          userId
        };
      }

      it('should be called from Method', () => {
        spyOn(updateStatus, 'call');

        try {
          // Call the Method
          updateStatus.call({
            taskId: 'taskId',
            newStatus: 'newStatus'
          });
        } catch (e) {}

        expect(updateStatus.call).toHaveBeenCalled();
      });

      it('should fail on missing input parameters', () => {
        expect(() => {
          updateStatus.call({});
        }).toThrowError();
      });

      it('should fail if taskId is not specified', () => {
        expect(() => {
          //invite.call({}, 'taskId', 'userId');
          // Call the Method
          updateStatus.call({taskId: '',newStatus: 'newStatus'});
        }).toThrowError();
      });

      it('should look for a task', () => {
        /*
        const taskId = 'taskId';
        spyOn(Tasks, 'findOne');

        try {
          updateStatus.call({taskId: 'taskId', newStatus: 'newStatus'});
        } catch (e) {}

        expect(Tasks.findOne).toHaveBeenCalledWith(taskId);
        */
        const taskId = 'taskId';
        spyOn(taskHelper, 'getPermittedTask');

        try {
          updateStatus.call({taskId: 'taskId', newStatus: 'newStatus'});
        } catch (e) {}

        expect(taskHelper.getPermittedTask).toHaveBeenCalledWith(taskId);
      });

      it('should fail if user does not have permission to access Task', () => {
        //spyOn(taskHelper, 'getPermittedTask').and.returnValue(undefined);
        spyOn(taskHelper, 'getPermittedTask').and.throwError(404);

        expect(() => {
            updateStatus.call({taskId: 'taskId', newStatus: 'newStatus'});
        }).toThrowError(/404/);

      });

/*
      it('should succeed if logged in user is the creator', () => {
        spyOn(statusHelper, 'hasPermission').and.returnValue(false);
        spyOn(Tasks, 'update');

        updateStatus.call({
          taskId: 'taskId',
          newStatus: 'newStatus'
        });

        expect(Tasks.update).toHaveBeenCalled();
      });

      it('should fail if logged in user is not the creator', () => {
        //spyOn(Meteor, 'userId').and.returnValue("myUserId");
        spyOn(statusHelper, 'hasPermission').and.returnValue(false);
        spyOn(Tasks, 'findOne').and.returnValue({
          creator: 'creatorId',
          promiserIds: '["testUser"]'
        });

        expect(() => {
            updateStatus.call({taskId: 'taskId', newStatus: 'newStatus'});
        }).toThrowError(/404/);
      });
*/
/*

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
      */
    });



  });
}
