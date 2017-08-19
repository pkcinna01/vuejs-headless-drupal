
const anonymousUser = {
    name: '',
    roles: ['anonymous'],
    loggedIn: false
};

function capitalize(text) {
    if ( !text ) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
}

Vue.component('view-header', {
    template: '<div class="well well-sm div-table-responsive view-header">\
      <div class="div-row-valign-middle">\
        <div>\
          <view-header-head :title="title" :processing="processing"></view-header-title>\
        </div>\
        <div style="width:100%;">\
          <slot></slot>\
        </div>\
      </div>\
      </div>',

    props: ['title','processing' ]
});

Vue.component('view-header-head', {
  template: '<div class="view-header-head div-table">\
        <div class="div-row-valign-middle">\
            <div style="min-width:25px;width:25px;padding:0;">\
                <img src="img/spinner.gif" height="20" width="20" v-if="processing"/>\
            </div>\
            <div class="view-header-title">\
               {{title}}\
            </div>\
        </div>\
    </div>',

  props: ['title','processing' ]
});

Vue.component('view-processing-status', {
    template: '<span class="view-processing-status" v-if="processing">\
        <img src="img/spinner.gif"/>\
        Processing: {{msg}}\
      </span>',

    props: ['msg','processing' ]
});


Vue.use(VeeValidate);

router.onReady(function(){
    if ( router.currentRoute.fullPath.lastIndexOf( '/error/', 0) === 0 ){
        console.log("redirecting to home instead of " + router.currentRoute.fullPath);
        router.push('/');
    }
});  
  
const app = new Vue({

    mixins: [ DrupalSession ],

    data: {
        user: null,
        statusObj: {code:0,msg:'',processing:false},
    },

    computed: {
        loggedIn: function() {
            return this.user && this.user.loggedIn;
        }
    },

    mounted: function(){
        this.$on('app-msg',this.$refs.msgPanel.addMsg);       
        this.$on('status-msg', this.$refs.footer.updateStatus);
     },
 
    methods: {
        setUser: function(user){
            var oldUser = this.user;
            if ( !user ) {
                this.user = anonymousUser;
            } else {
                this.user = user;
                this.user.loggedIn = user.name != '';
            }
            var userChanged = oldUser && oldUser.name != this.user.name;
            //console.log('old user: '+ JSON.stringify(oldUser));
            //console.log('new user: '+ JSON.stringify(this.user));
            if ( userChanged ) {
                var historyIndex = 0;
                this.$router.go(historyIndex); // allows router guards to be applied to new user
            }
        },
    },

    router: router,

    http:{
      root: '/'
    },
}).$mount('#app')
