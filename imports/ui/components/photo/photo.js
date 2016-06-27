import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { taskHelper } from '/imports/api/methods/taskHelper';

import './photo.html';
import { myFileUploads } from '/lib/slingCommon';  // file size limit is set here

const name = 'photo';


var slingUploader = new Slingshot.Upload(myFileUploads);
var latestUrl="";

class Photo {
  constructor($scope, $reactive, $timeout, uiService) {
    'ngInject';

    console.log("photo component");

    this.uiService = uiService;
    this.$timeout = $timeout;

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

    this.error='';
    this.message='';

  }

  allow() {
    if ( this.isProfilePhoto() ) {
        if ( Meteor.user().services.password ) {
          return true;
        } else {
          this.error={};
          this.error.message = "You logged in via Google or Facebook, please update your Profile photo there";
          return false;
        }
    }
    return true;
  }

  isProfilePhoto() {
    return (this.photoType == 'profile' || this.photoType==null);
  }

  isTaskPhoto() {
    return (this.photoType == 'task');
  }


  action() {
    if (!this.allow()) {
      return;
    }

   var input = document.getElementById('fileToUpload');
   var file = input.files[0];

   if ( file==null) {
     return;
   }

   var error = slingUploader.validate(file);
    if (error) {
      console.error("validation failed");
      this.error = error;
      return;
    }

   params={};
   params.photoType = this.photoType;

   if (this.task!=null) {
     params.taskId = this.task._id;
   }

   myTimeout = this.$timeout;

   processImage(file, 300, 300, function(dataURI, params, myTimeout ) {

     var blob = dataURItoBlob(dataURI);

     slingUploader.send(blob, function (error, newUrl) {
       console.log("newUrl = ", newUrl);

        this.params.newUrl = newUrl;
        taskHelper.replacePhoto(this.params);

        this.myTimeout(function() {
          console.log("refresh screen");
        },100);
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
  bindings: {
    task: '<',
    photoType: '@'   // profile OR task
  },
  controllerAs: name,
  controller: Photo
})
