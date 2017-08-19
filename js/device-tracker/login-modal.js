

var loginModal = Vue.component('login-modal', {
    template: '<div id="login-modal" class="modal fade login-modal">\
        <div class="modal-dialog">\
            <div style="z-index:-2000;opacity:1;" class="modal-content" :class="{\'modal-processing\':processing}">\
                <form v-on:submit="login">\
                    <div class="modal-header">\
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
                        <h4 class="modal-title" >Login</h4>\
                    </div>\
                    <div class="modal-body">\
                            <p class="text-warning alert alert-danger" v-for="msg in msgs" :class="getMsgCssClass(msg.type)">{{msg.text}}</p>\
                            <div>\
                                <div class="form-group">\
                                    <label>User</label>\
                                    <span class="validation-error" v-show="errors.has(\'name\')">Required</span>\
                                    <input type="text" name="name" class="form-control"\
                                        v-bind:value="name" v-model="name" v-validate="\'required\'"\
                                        :class="{\'input-validation-error\':errors.has(\'name\')}"\
                                        :disabled="processing">\
                                </div>\
                                <div class="form-group">\
                                    <label>Password</label>\
                                    <span class="validation-error" v-show="errors.has(\'pass\')">Required</span>\
                                    <input type="password" name="pass" class="form-control" v-model="pass" v-validate="\'required\'"\
                                    :class="{\'input-validation-error\':errors.has(\'pass\')}"\
                                    :disabled="processing">\
                                </div>\
                            </div>\
                        </div>\
                    <div class="modal-footer">\
                        <button class="btn btn-success" v-on:click=\'login\' :disabled="processing||!allowLogin">Login</button>\
                        <button type="button" class="btn btn-danger" data-dismiss="modal">Cancel</button>\
                    </div>\
                </form>\
            </div>\
        </div>\
    </div>',
    
    mixins: [MsgList,DrupalSession],
    
    data: function(){
        return {
            name: '',
            pass: '',
            allowLogin: true,
            successOp: null
        }
    },

    computed: {
        loggedIn: function() {
            return this.$root.loggedIn;
        }
    },

    mounted: function(){
        this.statusEventTarget = this; 
        this.$on('app-msg',this.addMsg);
        $('#login-modal').modal({
            backdrop: 'static',
            keyboard: false,
            show: false
        });
        $('#login-modal').on("hidden.bs.modal", this.reset);        
    },

    methods: {

        reset: function(){
            this.name = '';
            this.pass = '';
            this.roles = [];
            this.msgs = [];
            this.successOp = null;
            this.allowLogin = true;
            this.$nextTick(function(){
                this.errors.clear();
            });
        },

        show: function(successOp){
            this.successOp = successOp
            var _this = this;
            this.connect(function(user){
                if ( user.name ) {
                    _this.$root.setUser(user);
                    _this.$root.$emit('app-msg','info', "'" + user.name + "' already logged in." );                    
                    $('#login-modal').modal('hide');
                    if ( _this.successOp ) {
                        _this.successOp();
                    }
                }
            });
            $('#login-modal').modal('show');
        },

        login: function(event){
            var _this = this;
            event.preventDefault();
            this.initContext("Login")
            this.clear();
            this.$validator.validateAll().then(function(result){
                var data = {
                    'form_id': 'user_login_form',
                    'name': _this.name,
                    'pass': _this.pass
                }
                var options = {
                    headers:{
                        //'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                };
                _this.httpRequest(_this.$http.post(_this.drupalUrl + 'user/login?_format=json', data, options), 
                    function(response){
                        _this.resourceOkHandler(response); 
                        _this.pass = '';
                        _this.connect();
                        $('#login-modal').modal('hide');
                        if ( _this.successOp ) {
                            _this.successOp();
                        }
                    }, function(error){
                        _this.updateStatusFromError(error);
                        if ( error.status == 403 ) {
                            _this.addMsg('error','Received 403 error. Checking for existing user session...')
                            _this.connect( function(user){
                                _this.allowLogin = false;
                                if ( user.name != '' ) {
                                    $('#login-modal').modal('hide');
                                    _this.$root.$emit('app-msg','warning', "'" + user.name + "' already logged in." );
                                    _this.$root.setUser(user);
                                    if ( _this.successOp ) {
                                        _this.successOp();
                                    }
                                } else {
                                    _this.addMsg('error','No existing session.  Unauthorized from this location (or browser).');
                                }
                            });
                        } else {
                            //_this.resourceErrorHandler(error);
                            _this.addMsg('error',_this.statusMsg);
                        }
                    } );                            
            
            }, function(error){
                _this.addMsg('error','Validation error(s)');
            });
        }
    }    
}); 



