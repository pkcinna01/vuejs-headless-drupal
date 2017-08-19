var MsgList = Vue.extend({

  data: function(){
    return {
      msgs: []
    };
  },

  computed: {
    title: function() {
      var msgTypes = _.uniq(_.map(this.msgs,function(m){ return m.type })).map(function(t){return capitalize(t);});
      return 'Application ' + msgTypes;
    },
    titleCssClass: function() {
      if ( _.findWhere(this.msgs,{type:'error'})){
        return 'msg-panel-title-error';
      }
      return 'msg-panel-title-info';
    }
  },

  methods: {
    addMsg: function(msgType,msgText,element) {
        var newMsg = { type: msgType, text: msgText};
        if ( !_.some(this.msgs, function(m){ return _.isMatch(m, newMsg) })){
            this.msgs.push( newMsg );
        }
    },
    clear: function(){
      this.msgs = [];
    },
    getMsgCssClass: function(msgType) {
        if ( msgType ) {
            msgType = msgType.toLowerCase();
            if ( msgType == 'error' ) {
                return 'msg-panel-error';
            } else if ( msgType == 'warning' ) {
                return 'msg-panel-warning';
            } else if ( msgType == 'success' ) {
                return 'msg-panel-success';
            } 
        } 
        return 'msg-panel-info'; 
    }
  }
});

var msgPanel = Vue.component('msg-panel',{
  template: '<div id="app-msg-panel" class="modal fade msg-panel">\
      <div class="modal-dialog">\
          <div class="modal-content">\
              <div class="modal-header">\
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
                  <h4 class="modal-title" :class="titleCssClass">{{title}}</h4>\
              </div>\
              <div class="modal-body">\
                  <p class="text-warning" v-for="msg in msgs" :class="getMsgCssClass(msg.type)">{{msg.text}}</p>\
              </div>\
              <div class="modal-footer">\
                  <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
              </div>\
          </div>\
      </div>\
  </div>',

  mixins: [ MsgList ],

  mounted: function(){
    $('#app-msg-panel').on("hidden.bs.modal", this.clear)
  },

  methods: {
      close: function(){
          this.clear();
      }
  },
  
  watch: {
    msgs: function(msgs) {
      msgs.length && $('#app-msg-panel').modal('show');
    }
  }
});