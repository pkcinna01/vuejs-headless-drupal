
var headerView = Vue.component('header-view',{

  template: '<nav class="navbar navbar-default navbar-static-top">\
    <div class="container">\
        <div class="navbar-header">\
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false"\
                aria-controls="navbar">\
            <span class="sr-only">Toggle navigation</span>\
            <span class="icon-bar"></span>\
            <span class="icon-bar"></span>\
            <span class="icon-bar"></span>\
            </button>\
            <a class="navbar-brand" href="#">XMonit</a>\
        </div>\
        <div id="navbar" class="navbar-collapse collapse">\
            <ul class="nav navbar-nav">\
                <router-link tag="li" to="/" exact><a>Home</a></router-link>\
                <router-link tag="li" to="/about"><a>About</a></router-link>\
                <router-link tag="li" to="/contact"><a>Contact</a></router-link>\
                <li class="dropdown">\
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button"\
                        aria-haspopup="true" aria-expanded="false">Browse<span class="caret"></span></a>\
                    <ul class="dropdown-menu">\
                        <router-link tag="li" to="/devices" exact><a>Devices</a></router-link>\
                    </ul>\
                </li>\
                <li class="dropdown" v-if="isAdmin">\
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button"\
                        aria-haspopup="true" aria-expanded="false"><i class="glyphicon glyphicon-cog"></i> Administration<span class="caret"></span></a>\
                    <ul class="dropdown-menu">\
                        <router-link tag="li" to="/users" exact><a>Users</a></router-link>\
                    </ul>\
                </li>\
            </ul>\
            <ul class="nav navbar-nav navbar-right">\
                <router-link tag="li" to="/help"><a><i class="glyphicon glyphicon-question-sign"></i> Help</a></router-link>\
                <li>\
                    <login-btn-panel class="navbar-item"></login-btn-panel>\
                </li>\
            </ul>\
        </div>\
    </div>\
  </nav>',

  props: {
      user: null
  },

  computed: {
    isAdmin: function() {
        return this.user && _.contains(this.user.roles,'administrator');
    }
  }

});

