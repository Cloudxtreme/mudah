import { Tasks } from '../tasks/collection';
import { statusHelper } from '../../ui/helpers/statusHelper';
import { taskHelper } from './taskHelper';
import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
  describe('taskHelper / test', () => {

    describe('getActiveList()', () => {

      it('should get active tasks for the User', () => {
        spyOn(Tasks, 'find');
        let userId='KeaXDfpTMaX23c4tt';
        taskHelper.getActiveList(userId);

        expect(Tasks.find).toHaveBeenCalledWith( {
          $and: [
            {status : {$ne : 'DRAFT'}},
            {completed : false},
            {creator : userId }
            ]
        });
      });
    });

    describe('getKudosList()', () => {

      it('should get completed tasks that user participated in', () => {
        spyOn(Tasks, 'find');
        let userId='KeaXDfpTMaX23c4tt';
        taskHelper.getKudosList(userId);

        expect(Tasks.find).toHaveBeenCalledWith( {
          $and: [
            {completed : true},
            {creator : {$ne: userId} }
          ]
        });
      });
    });

    describe('getCompletedList()', () => {

      it('should get completed tasks for user', () => {
        spyOn(Tasks, 'find');
        let userId='KeaXDfpTMaX23c4tt';
        taskHelper.getCompletedList(userId);

        expect(Tasks.find).toHaveBeenCalledWith( {
          $and: [
            {completed : true},
            {creator : userId}
          ]
        });
      });
    });

    describe('getMyTask', () => {
      function loggedIn(userId = 'userId') {
        return {
          userId
        };
      }

      it('should succeed if taskId is specified', () => {
        spyOn(taskHelper, 'getMyTask');
        taskHelper.getMyTask('taskId');
        expect(taskHelper.getMyTask).toHaveBeenCalledWith('taskId');
      });

      it('should look for a task', () => {

        const taskId = 'taskId';
        spyOn(Tasks, 'findOne');

        try {
          taskHelper.getMyTask( 'taskId');
        } catch (e) {}

        expect(Tasks.findOne).toHaveBeenCalledWith('taskId');
      });

      it('should fail if Task is not found', () => {
        spyOn(Tasks, 'findOne').and.returnValue(undefined);

        expect(() => {
            taskHelper.getMyTask('taskId');
        }).toThrowError(/404/);

      });

      it('should fail if caller is not owner of the Task', () => {
        spyOn(statusHelper, 'isCreator').and.returnValue(false);

        expect(() => {
            taskHelper.getMyTask('taskId');
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
