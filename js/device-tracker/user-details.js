
var userDetails = Vue.component('user-details',{
    template: '<div class="user-details" :class="{\'view-processing\':processing}">\
        <div>\
            <br>\
            <div class="well well-md">\
                <div class="row list-item"><div class="col-sm-2"><label>Username</label></div>\
                    <div class="col-sm-2">\
                    name here\
                    </div>\
                </div>\
            </div>\
        </div>\
        User: {{ user && user.name }}\
    </div>',

    mixins: [DrupalResource],

    props: [ 'user' ],

    mounted: function(){
    },    

    data: function(){
        return {
        }
    },

    watch: {
    }
});
