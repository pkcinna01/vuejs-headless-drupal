
Vue.component('login-btn-panel', {
    
    template: '<div>\
        <span >{{$root.user && $root.user.name}} <button class="btn btn-xs" v-on:click="logout" v-if="loggedIn">logout</button></span>\
        <span v-if="!loggedIn">\
            <button class="btn btn-xs" v-on:click="login">Login</button>\
        </span>\
    </div>',
    
    mixins: [DrupalSession],
    
    computed: {
        loggedIn: function() { return this.$root.user && this.$root.user.loggedIn; }
    },
    
    mounted: function(){
        this.connect();
    },

    methods: {

        login: function(){
            this.$root.$refs.loginModal.show();
        },

        logout: function() {
            this.initContext("Logout")
            this.httpRequest(this.$http.get(this.drupalUrl + 'user/logout', {
                'Content-Type': 'application/x-www-form-urlencoded'
            }), function(response){ 
                this.resourceOkHandler(response); 
                this.$root.setUser(null);                
            }, function(error){
                if ( error.status == 403) {
                    this.connect();
                } else {
                    this.resourceOkHandler(response); 
                }
            });                            
        }
    }
});