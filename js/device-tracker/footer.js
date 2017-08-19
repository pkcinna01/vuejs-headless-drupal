

var footerView = Vue.component('footer-view',{
  
    template: '<div class="footer-view footer">\
    <div class="container" style="height:100%;padding:0;">\
    <div class="div-table-responsive" style="width:100%">\
        <div class="div-row-valign-middle">\
            <div style="width:33%;">\
            <span>{{(userName) || "Not logged in"}} <template v-if="isAdmin">(Administrator)</template></span>\
            &nbsp;&nbsp;<span>{{urlPath}}</span>\
            </div>\
            <div style="width:33%;text-align:center;">\
            </div>\
            <div style="width:33%;text-align:right;">\
            <img src="img/spinner.gif" v-if="processing"/> \
            <transition name="fade">\
              <span class="footer-view-status" :class="statusClass" v-if="showStatus">\
                <i class="iconStatusClass"></i>\
                &nbsp;{{context}} <template v-if="status.msg">- {{status.msg}}</template> <template v-if="!processing">({{status.code}})</template>\
              </span>\
            </transition>\
            </div>\
        </div>\
    </div>\
    </div>\
    </div>',
  
    props: [ 'user', 'route' ],

    data: function() { 
      return {
        status: {code:0,msg:'',processing:false,context:''},
        showStatus: true
      }
    },
  
    computed: {
      urlPath: function() { return this.route.fullPath.split("?")[0]; },
      userName: function(){ return this.user && this.user.name || 'Not logged in'; },
      isAdmin: function() { return this.user && _.contains(this.user.roles,'administrator'); },
      processing: function() { return this.status && this.status.processing; },
      context: function() { return this.status && this.status.context; },  
      isError: function() { return this.status.code > 0 && this.status.code != 200; },
      isSuccess: function() { return this.status.code == 200; },
      statusClass: function() { 
        if (this.isError) {
          return 'staus-error';
        } else if ( this.isSuccess ) {
          return 'status-success';
        }
        return 'status-default';
      },
      iconStatusClass: function() {
        if ( this.isSuccess ) {
          return ["glyphicon", "glyphicon-ok-sign"];
        } else if ( this.isError ) {
          return ["glyphicon", "glyphicon-exclamation-sign"];
        } else if (!this.processing ) {
          return ["glyphicon", "glyphicon-info-sign"];
        } else {
          return [];
        }
      }
    },

    methods: {
      updateStatus: function(status){
        //console.log('Footer: updateStatus: ' + JSON.stringify(status));
        this.status = status;
        if ( !status.processing && (status.code == 200 || status.code == 0) ) {          
          var _this = this;      
          setTimeout(function(){
            _this.showStatus = false;
          },4000);
        } else {
          this.showStatus = true;
        }
      }
    }
  });
  
  