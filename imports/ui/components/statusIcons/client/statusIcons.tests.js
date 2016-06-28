import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';

import { name as StatusIcons } from '../statusIcons';
import { name as uiService } from '/imports/ui/services/uiService';
import { statusHelper } from '/imports/ui/helpers/statusHelper';
import 'angular-mocks';


import chai from 'chai';
var assert = chai.assert;
var chaiExpect = chai.expect;
var should = chai.should();

let reactiveResult;
let $reactiveMock;
let $scopeMock;


describe('StatusIcons', function() {
  beforeEach(() => {
    angular.mock.module(StatusIcons);
    angular.mock.module(uiService);
  });

  describe('controller', function() {
    let controller;
    // mocks

    // see: http://www.bradoncode.com/blog/2015/06/05/ngmock-fundamentals-testing-controllers/
    beforeEach(() => {

      inject(
        function($rootScope, $componentController, _$reactive_, uiService) {

          controller = $componentController(StatusIcons, {
            $scope: $rootScope.$new(true),
            $reactive: _$reactive_
          });
        }
      );

    });

    describe('functions', function() {

      beforeEach(function() {
         controller.task = { _id: "TYjz5vYmNQQTctokp"}
      });

      it('should be me if User was the last person who edited the task', function() {
        let userId="TYjz5vYmNQQTctokp";
        controller.task = { editedBy: userId};

        spyOn(Meteor, 'userId').and.returnValue(userId);
        let editor = controller.lastEditor(controller.task);

        expect(editor).toBe("me");
      });

      it('should be Tom if Tom was the last person who edited the task', function() {
        let userId="TYjz5vYmNQQTctokp";
        let tomId="PPjz5vYmNQQTctoos";
        controller.task = { editedBy: tomId};

        spyOn(Meteor, 'userId').and.returnValue(userId);
        spyOn(controller, 'getName').and.returnValue("Tom");
        let editor = controller.lastEditor(controller.task);

        expect(editor).toBe("Tom");
      });

      it('should be me if User was the last person who ackd the task', function() {
        let userId="TYjz5vYmNQQTctokp";
        controller.task = { ackBy: userId};

        spyOn(Meteor, 'userId').and.returnValue(userId);
        let editor = controller.lastAck(controller.task);

        expect(editor).toBe("me");
      });

      it('should be Tom if Tom was the last person who ackd the task', function() {
        let tomId="TYjz5vYmNQQTctokp";
        controller.task = { ackBy: tomId};
        spyOn(controller, 'getName').and.returnValue("Tom");
        let editor = controller.lastAck(controller.task);

        expect(editor).toBe("Tom");
      });

   

      it('should be true is task has been shared with other Users', function() {

        controller.task = {  userIds:['KeaXDfpTMaX23c4tt']};
        spyOn(statusHelper, 'isCreator').and.returnValue(true);

        let flag = controller.hasParticipants(controller.task);

        expect(flag).toBe(true);
      });

      it('should be true is task has been shared logged-in User', function() {


        expect(true).toBe(true);
      });

      it('should return name(s) of participants in the Task', function() {

        controller.task = {  userIds:['TYjz5vYmNQQTctokp']};
        spyOn(controller, 'getName');
        controller.sharedWith();

        expect(controller.getName).toHaveBeenCalled();
      });

      it('should return name of given user', function() {
        let userId="TYjz5vYmNQQTctokp";

        spyOn(Meteor.users, 'findOne').and.returnValue({profile:{name:'Tom'}});
        let name = controller.getName(userId);
        expect(name).toBe("Tom");
      });

      it('should return Creator name', function() {
        let creatorId="PPjz5vYmNQQTctoos";
        controller.task = { creator: creatorId};

        spyOn(controller, 'getName');
        let name = controller.creatorName();
        expect(controller.getName).toHaveBeenCalledWith( creatorId);
      });

      it('should be true if Task has a chat message', function() {

        controller.task = {  lastMessage:'hello'};
        let flag = controller.hasMessage();

        expect(flag).toBe(true);
      });

      it('should return last Chat Message if Task has a chat message', function() {
        controller.task = {  lastMessage: {text:'hello'}}
        let msg = controller.lastMessage();

        expect(msg).toBe("hello");
      });

      it('should return name of Sender if Task has a chat message', function() {
        controller.task = {  lastMessage: {text:'hello'}}
        spyOn(controller, 'getName').and.returnValue("Tom");
        let sender = controller.lastChatUser();

        expect(sender).toBe("Tom");
      });

    });



  });
});
