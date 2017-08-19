
var DrupalSession = {

  mixins: [DrupalResource],

  methods: {

    connect: function (successCallback,errorCallback) {
      this.initContext("Getting drupal session");
      var currentUserUrl = this.drupalUrl + 'jdrupal/connect?_format=json'; //if using jdrupal module
      //var currentUserUrl = this.drupalUrl + 'api/user?_format=json'; // if created custom view to return [{name,roles}]

      if ( !errorCallback ) {
        errorCallback = this.resourceErrorHandler;
      }

      this.httpRequest(this.$http.get(currentUserUrl, {
        'Accept': 'json',
        'Content-Type': 'application/json',
      }), function (response) {
        this.resourceOkHandler(response);
        var currentUser = response.body;
        if (Array.isArray(currentUser)) {
          // TODO - roles always empty for non-admin users when not using jdrupal module
          if (currentUser.length == 0) {
            currentUser = { name: '', roles: ['anonymous'] };
          } else {
            currentUser = currentUser[0];
            if (!Array.isArray(currentUser.roles)) {
              currentUser.roles = [];
            }
            currentUser.roles.push('authenticated');
          }
        }
        
        //console.log('current user from ' + currentUserUrl + ':');
        //console.dir(currentUser);
        if (successCallback) {
          successCallback(currentUser);
        } else {
          this.$root.setUser(currentUser);
        }
      }, errorCallback );
    }
  }
}