
var deviceList = Vue.component('device-list',{
    
    template: '<div id="device-list" :class="{\'view-processing\':processing}">\
        <view-header :title="title" :processing="processing">\
            <div class="filter div-table-responsive" style="margin-left:auto;margin-right:0;">\
                <div>\
                    <div>\
                        <div class="row">\
                        <div class="col-md-4">\
                            <strong>Name:</strong>\
                            <input type="text" class="form-control" v-model="nameFilter.pattern">\
                        </div>\
                        <div class="col-md-4">\
                            <strong>Model:</strong>\
                            <input type="text" class="form-control" v-model="modelFilter.pattern">\
                        </div>\
                        <div class="col-md-4">\
                            <strong>Company:</strong>\
                            <select name="companyFilter" class="form-control" v-model="companyFilter.pattern">\
                                <option value="">All</option>\
                                <option v-for="company in companies">{{ company }}</option>\
                            </select>\
                        </div>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        </view-header>\
        <div class="item-list">\
            <table class="table table-striped table-condensed table-hover">\
                <thead>\
                <tr>\
                    <th v-on:click="sortBy(\'name\')" style="width:25%;">\
                      <div class="th-inner sortable">\
                        <div style="width:4.5em;" :class="getSortIcon(\'name\')">Name</div>\
                      </div>\
                    </th>\
                    <th v-on:click="sortBy(\'model\')" style="width:25%;">\
                        <div class="th-inner sortable">\
                        <div style="width:4.5em;" :class="getSortIcon(\'model\')">Model</div>\
                        </div>\
                    </th>\
                    <th v-on:click="sortBy(\'company\')" style="width:25%;">\
                        <div class="th-inner sortable">\
                        <div style="width:6em;" :class="getSortIcon(\'company\')">Company</div>\
                        </div>\
                    </th>\
                    <th v-on:click="sortBy(\'assignedTo\')" style="width:25%;">\
                        <div class="th-inner sortable">\
                        <div style="width:7.5em;" :class="getSortIcon(\'assignedTo\')">Assigned To</div>\
                        </div>\
                    </th>\
                </tr>\
                </thead>\
                <tbody>\
                  <tr v-for="device in filteredItems" class="device-item">\
                    <td>{{device.name}}</td>\
                    <td>{{device.model}}</td>\
                    <td>{{device.company}}</td>\
                    <td>{{device.assignedTo}}\
                        <a :href="\'/user/\'+device.ownerId">{{device.ownerName}}</a>\
                    </td>\
                  </tr>\
                </tbody>\
            </table>\
        </div>\
    </div>',

    mixins: [DrupalSession,ItemList],

    data: function() {
        return {
            viewName: 'devices',
            nameFilter: new SubStringFilter('name'),
            modelFilter: new SubStringFilter('model'),
            companyFilter: new SubStringFilter('company'),
            serverFieldMappings: {
                name: 'title',
                name_1: 'title_1',
                model: 'field_model_value',
                model_1: 'field_model_value_1',
                company: 'field_company_value',
                company_1: 'field_company_value_1',
                assignedTo: 'field_assigned_to_target_id',
                assignedTo_1: 'field_assigned_to_target_id_1',
            }
        }
    },

    computed: {
        companies: function() {
            var companies = [];
            _.each(this.items,function(device){
                var company = device.company;
                _.includes(companies,company) || companies.push(company);
            });                    
            return companies.sort();        
        }
    },

    created: function(){
        this.filters = [ this.nameFilter, this.modelFilter, this.companyFilter ];    
        this.processUrlQuery();
        
        //register watchers AFTER filters are modified by processUrlQuery
        var _this = this;
        _.each(['name','model','company'],function(key){ _this.$watch( key +'Filter.pattern',_this.debouncedApplyFilters) });
        
        this.remoteFilterEnabled = true;
        this.remoteSortEnabled = true;
    },

    mounted: function(){ 
        this.getItems();
    },
});
