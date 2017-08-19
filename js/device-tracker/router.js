
function guardsOp (guards, from, to, lastNext, i) {
  let guard = guards[i]
  if (guards.length === i + 1) {
    guard(from, to, lastNext)
  } else {
    guard(from, to, function (nextArg) {
      switch (typeof (nextArg)) {
        case 'undefined':
          guardsOp(guards, from, to, lastNext, i + 1)
          break
        case 'object':
          lastNext(nextArg)
          break
        case 'boolean':
          lastNext(nextArg)
          break
        case 'string':
          lastNext(nextArg)
          break
      }
    })
  }
}

function Guards(ListOfGuards) {
  return function (from, to, next) {
    guardsOp(ListOfGuards, from, to, next, 0)
  }
}

function AuthGuard(to,from,next) {
  var user = router.app.user;
  if ( !user || !_.contains(user.roles,'authenticated') ) {
      router.app.$refs.loginModal.show(function() {
          next();
      });        
  } else {
      next();
  }
};

function AdminGuard(to,from,next) {
  var user = router.app.user;
  if ( !user || !_.contains(user.roles,'administrator') ) {
      next({ path: '/error/Administrator-Role-Required', 
             query: { to: to.fullPath, details: 'Drupal user "' + user.name + '" not an administrator.'} });
  } else {
      next();
  }
};

function DrupalSessionGuard(to,from,next) {
  if ( !router.app.user ) {
      function connect() {
          router.app.connect(function(user){
              router.app.setUser(user);
              next();                    
          }, function(error){
              //router.app.resourceErrorHandler(error);
              //router.app.setUser(anonymousUser);
              router.app.updateStatusFromError(error);
              next({ path: '/error/Failed-Connecting-to-Drupal', 
              query: { to: to.fullPath, 
                  details: 'Requested page requires a Drupal session from ' + error.url } });
          });    
      }
      if ( !router.app.connect ) {
          //console.log('App not created yet...');
          router.app.$nextTick(connect);
      } else {
          connect();
      }
  } else {
      next();
  }
};

function routeProps() {
  return {
      user: router.app.user
  };
}

var adminGuards = Guards([AuthGuard,AuthGuard,AdminGuard]);

const router = new VueRouter({
 routes: [
      { path: '/', component: { template: '#home-template' } },
      { path: '/devices', component: deviceList, beforeEnter: Guards([DrupalSessionGuard,AuthGuard]), props: routeProps },
      { path: '/users', component: userList, beforeEnter: adminGuards, props: routeProps },
      { path: '/user/:id', component: userDetails, beforeEnter: adminGuards, props: routeProps },
      { path: '/about', component: { template: '#about-template' } },
      { path: '/contact', component: { template: '#contact-template' } },
      { path: '/help', component: { template: '#help-template' } },
      { path: '/error/:type', component: { template: '#error-template', props: ['type'] }, props: true },
      { path: '*', redirect: function(to){
          return { 
              path: 'error/Page-Not-Found',
              query: {
                  to: to.fullPath, 
                  details: 'Broken link or invalid path.'
              } 
          }; 
      }}
  ],    
  linkActiveClass: "active"
});


