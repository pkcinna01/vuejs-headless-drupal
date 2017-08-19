//TODO - drupal users view not sorting so using local sort

var userList = Vue.component('user-list',{
    template: '<div id="user-list" :class="{\'view-processing\':processing}">\
        <view-header :title="title" :processing="processing"></view-header>\
        <div class="user-list">\
            <br>\
            <table class="table table-striped table-condensed table-hover">\
            <thead>\
            <tr>\
                <th v-on:click="sortBy(\'name\')" style="width:25%;">\
                  <div class="th-inner sortable">\
                    <div style="width:4.5em;" :class="getSortIcon(\'name\')">Name</div>\
                  </div>\
                </th>\
                <th v-on:click="sortBy(\'mail\')" style="width:25%;">\
                    <div class="th-inner sortable">\
                    <div style="width:4.5em;" :class="getSortIcon(\'mail\')">Email</div>\
                    </div>\
                </th>\
                <th v-on:click="sortBy(\'roles\')" style="width:50%;">\
                    <div class="th-inner sortable">\
                    <div style="width:4.5em;" :class="getSortIcon(\'roles\')">Roles</div>\
                    </div>\
                </th>\
            </tr>\
            </thead>\
            <tbody>\
              <tr v-for="user in filteredItems" class="device-item">\
                <td>{{user.name}}</td>\
                <td>{{user.mail}}</td>\
                <td><label v-for="role in user.roles">{{role}}&nbsp;</label></td>\
              </tr>\
            </tbody>\
        </table>\
        </div>\
    </div>',

    mixins: [DrupalSession,ItemList],

    mounted: function(){
        this.getItems();
        //this.remoteFilterEnabled = false;
        this.remoteSortEnabled = false;
    },    

    data: function(){
        return {
            viewName: 'users'
        }
    },
});
