App.accessRule('http://localhost:3000/*');
App.accessRule('*://intdemo.herokuapp.com/*');
App.accessRule('https://enginex.kadira.io/simplentp/sync');
App.accessRule('https://enginex.kadira.io/errors');
App.accessRule('https://graph.facebook.com/*');
App.accessRule('https://fbcdn-profile-a.akamaihd.net/*');  // FB profile photos get redirected here. IOS needs this !?
App.accessRule('https://*.fbcdn.net/*');     // Facebook Cover Photo
App.accessRule('*://10.0.2.2/*'); // localhost meteor. Android talks to localhost over 10.0.2.2.
App.accessRule('http://meteor.local');
