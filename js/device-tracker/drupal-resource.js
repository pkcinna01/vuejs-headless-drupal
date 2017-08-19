var DrupalResource = {
    
    data: function(){
      return {
        processing: false,
        status: 0,
        statusText: '',
        contextDesc: '',
        statusEventTarget: this.$root,
        drupalUrl: '/'
      }
    },

    computed: {
        failed: function(){
            return this.status>=300 || this.status < 0;
        },
        statusMsg: function(){
            return this.contextDesc + ' - ' + this.statusText + ' (' + this.status + ')';
        },
        statusObj: function() {
            return {
                code: this.status,
                msg: this.statusText,
                context: this.contextDesc,
                processing: this.processing
            };
        }
    },

    methods: {
        httpRequest: function(reqPromise,okFn,errorFn){
            this.processing = true;
            if ( !okFn ) {
                okFn = this.resourceOkHandler;
            }
            if ( !errorFn ) {
                errorFn = this.resourceErrorHandler;
            }
            //todo - if not authenticated, pop up login
            reqPromise.then(okFn,errorFn);
        },
        resourceOkHandler: function(response) {
          this.processing = false;
          //console.dir(response);
          this.status = response.status;
          this.statusText = response.statusText;
        },
        updateStatusFromError: function(error) {
            console.log("error:" + JSON.stringify(error));
            this.status = error.status || -1;
            this.statusText = error.statusText || "No response or request blocked";
        },
        resourceErrorHandler: function(error) {
          this.processing = false;
          this.updateStatusFromError(error);
          this.statusEventTarget.$emit('app-msg', 'error', this.statusMsg, this.$el);
        },
        initContext: function(text) {
            this.status = 0;
            this.statusText = '';
            this.contextDesc = text;
        }
    },
    
    watch: {
        statusObj: function(n,o){
            if( this.$root )
                this.$root.$emit('status-msg', n, o);
        }
    }

};