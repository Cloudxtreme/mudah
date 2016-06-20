import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { taskHelper } from '/imports/api/methods/taskHelper';

import './photo.html';

const name = 'photo';


var slingUploader = new Slingshot.Upload("myFileUploads");

class Photo {
  constructor($scope, $reactive, uiService) {
    'ngInject';

    console.log("photo component");

    this.uiService = uiService;

    $reactive(this).attach($scope);

    this.helpers({
      progress() {
        let currProgress = slingUploader.progress();
        console.log("progress=", Math.round( currProgress ));

        if (   !isNaN( currProgress )) {
          return Math.round( currProgress * 100);
        }
        return 0;
      },
      currentUser() {
        return Meteor.user();
      }
    });

    this.message='';
  }

  allow() {
    if ( Meteor.user().services.password ) {
      return true;
    } else {
      this.error={};
      this.error.message = "You logged in via Google or Facebook, please update your Profile photo there";
      return false;
    }
  }


  action() {
    if (!this.allow()) {
      return;
    }

   var input: any = document.getElementById('fileToUpload');
   var file = input.files[0];

   if ( file==null) {
     return;
   }

   processImage(file, 300, 300, function(dataURI) {

      var blob = dataURItoBlob(dataURI);

     slingUploader.send(blob, function (error, downloadUrl) {
       console.log("downloadUrl = ", downloadUrl);
       //   Meteor.users.update(Meteor.userId(), {$push: {"profile.files": {'name': file.name, 'url': downloadUrl}}});
        taskHelper.replaceProfilePhoto(downloadUrl);
     })
   });
  }


}

function dataURItoBlob(dataURI) {
  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  var binary = atob(dataURI.split(',')[1]);
  var array = [];
  for(var i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], {type: mimeString});
}

// create a module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: Photo
})
.config(config);

function config($stateProvider) {
'ngInject';
$stateProvider
  .state('tab.photo', {
    url: '/photo',
    views: {
      'tab-notice': {
        template: '<photo></photo>'
      }
    },
    resolve: {
      currentUser($q) {
        if (Meteor.userId() === null) {
          return $q.reject('AUTH_REQUIRED');
        } else {
          return $q.resolve();
        }
      }
    }
  });
}
