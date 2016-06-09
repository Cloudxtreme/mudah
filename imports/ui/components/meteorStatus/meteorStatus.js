import { Meteor } from 'meteor/meteor'
import angularMeteor from 'angular-meteor';

import './meteorStatus.html';
const name = 'meteorStatus';

class MeteorStatus {
  constructor($scope, $reactive) {
    'ngInject';

    this.settings = Meteor.settings;

    $reactive(this).attach($scope);

    this.helpers({
      isOffline() {
        return !Meteor.status().connected;
      }
    });
  }

  disconnect() {
    console.log("disconnect()");
    Meteor.disconnect();
  };

  reconnect() {
    console.log("reconnect()");
    Meteor.reconnect();
  };

}

// create a module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: MeteorStatus
})
