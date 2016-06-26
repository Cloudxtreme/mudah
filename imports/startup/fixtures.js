import { Meteor } from 'meteor/meteor';
import { Tasks } from '../api/tasks';
import { updateStatus } from '../api/methods/taskMethods';  // import the Methods to run on the Server side
import { Email } from 'meteor/email'
import { Accounts } from 'meteor/accounts-base';

import { myFileUploads } from '/lib/slingCommon';

Meteor.startup(() => {

  console.log("start up. curr_env=" + Meteor.settings.public.curr_env );

  slingshot();
  configureKadira();
  configureOAuth();
  configureEmail();

  function configureKadira() { // monitoring
    Kadira.connect( Meteor.settings.private.kadira_id ,  Meteor.settings.private.kadira_secret);
  }

  function configureOAuth() {
    // Facebook OAuth
    ServiceConfiguration.configurations.upsert(
      { service: "facebook" },
      {
        $set: {
          appId:  Meteor.settings.private.facebook.appId,
          secret: Meteor.settings.private.facebook.secret
        }
      }
    );
    console.log("facebook configured");

    // Google OAuth
    ServiceConfiguration.configurations.upsert(
      { service: "google" },
      {
        $set: {
          clientId:  Meteor.settings.private.google.clientId,
          secret: Meteor.settings.private.google.secret
        }
      }
    );
    console.log("google configured");
  }

  function configureEmail() {
    console.log("configure SMTP server");
    process.env.MAIL_URL = Meteor.settings.private.smtp.mail_url;

    Accounts.emailTemplates.siteName = "Integritometer";
    Accounts.emailTemplates.from = "Admin <accounts@integritometer.com>";
    configureResetPwdEmail();
    configureVerifyEmail();
    //sendRestartEmail();
  }

  function configureResetPwdEmail() {

      Accounts.emailTemplates.resetPassword.subject = function (user) {
        return "Integritometer - Reset Password for " + user.profile.name;
      };
      Accounts.emailTemplates.resetPassword.text = function (user, url) {

        let newUrl = url.replace('#/reset-password', '/resetuserpassword');
        console.log("newUrl=", newUrl);

        return "To reset your password, simply click the link below:\n\n"
        + newUrl +
        "\n\n" +
        "Regards, The Integritometer Team";
      };
  }

  function configureVerifyEmail() {
      Accounts.emailTemplates.verifyEmail.subject = function (user) {
        return "Integritometer - Verify Email for " + user.profile.name;
      };
      Accounts.emailTemplates.verifyEmail.text = function (user, url) {

        // change URL to call our custom verifyLoginEmail component
        let newUrl = url.replace('#/verify-email', '/verifyloginemail');
        console.log("newUrl=", newUrl);
        return "To activate your account, simply click the link below:\n\n"
        + newUrl +
        "\n\n" +
        "Regards, The Integritometer Team";
      };
  }

  function sendRestartEmail() {
    Email.send({
      to: "ssleong@hotmail.com",
      from: "admin@integritometer.com",
      subject: "Integritometer Server restarted",
      text: "The contents of our email in plain text."
    });
    console.log("sent email");
  }

  function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid.toUpperCase();
  }

  function slingshot() {
    console.log("slingshot...");


    Slingshot.createDirective(myFileUploads, Slingshot.S3Storage, {
      AWSAccessKeyId: Meteor.settings.private.amazon.AWSAccessKeyId,
      AWSSecretAccessKey: Meteor.settings.private.amazon.AWSSecretAccessKey,
      bucket: Meteor.settings.private.amazon.AWSBucket,
      //region: Meteor.settings.private.amazon.AWSRegion

      acl: "public-read",

      authorize: function () {
        //Deny uploads if user is not logged in.
        if (!this.userId) {
          var message = "Please login before posting files";
          throw new Meteor.Error("Login Required", message);
        }

        return true;
      },

      key: function (file) {
        //Store file into a directory by the user's id
        return this.userId + "/" + generateUUID();
      }
    });

    console.log("AFTER init slingshot...");
  }
});
