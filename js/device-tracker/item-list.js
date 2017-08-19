

function SubStringFilter(key) {

  this.key = key;

  this.pattern = '';
  
  this.local = function(){ 
    if ( !this.pattern ) {
      return null; 
    }
    var pattern = this.pattern.toLowerCase();
    return function(src){
      if ( typeof src === 'object' ) 
         src = (src && src[key]);
      if ( src == null ) 
        return false;
      return  String(src).toLowerCase().indexOf(pattern) >= 0;
    };
  };

  this.remote = function(){ 
    if ( !this.pattern ) {
      return null; 
    }
    return { field: key, pattern: this.pattern.toLowerCase() };
  };
};


var debounceFilterWaitMs = 500;

var ItemList = {

  props: ['user'],

  data: function() {
    return {
      viewName: 'items',
      items: [],
      filters: [],
      sortKey: '',
      reverseSort: false,
      serverFieldMappings: {},
      remoteFilterEnabled: true,
      remoteSortEnabled: true,
      debouncedGetItems: _.debounce(this.getItems,debounceFilterWaitMs)
    }
  },

  computed: {

    title: function() {
      return capitalize(this.viewName);
    },

    localFilteredItems: function() {
      return this.localFilter(this.$data.filters,this.items);
    },

    localSortedItems: function(){   
      return this.localSort(this.sortKey,this.reverseSort,this.localFilteredItems);   
    },

    filteredItems: function(){
      if ( this.remoteFilterEnabled ) {
        return this.items;  // getItems returns serverside filtered data
      } else {
        return this.localFilteredItems;
      }
    }
  },

  methods: {

    getItems: function(processItemsCallback) {
      this.initContext('Get ' + this.title);

      var options = { params: {} };
      var mappings = this.$data.serverFieldMappings; 
      
      if ( this.remoteFilterEnabled ) {
        _.chain(this.$data.filters).map(function(f){return f.remote();}).compact().each( function(f){
          var key = f.field;
          if ( mappings[key] ){
            key = mappings[key];
          }
          options.params[key] = f.pattern; 
        });
      }

      if ( this.remoteSortEnabled ) {
        if ( this.sortKey ) {
          var key = this.sortKey;
          if ( this.reverseSort ) {
            key += '_1';
          }
          if ( mappings[key] ){
            key = mappings[key];
          }
          options.params.sort_by = key;
        }
      }

      var urlPath = '/api/' + this.viewName;
      console.log('ItemList.getItems() ' + urlPath + ' ' + JSON.stringify(options));
      
      var _this = this;

      this.httpRequest(this.$http.get(urlPath, options),
        function (response) {
          this.resourceOkHandler(response);
          this.items = response.body;
          if (processItemsCallback) {
            processItemsCallback(this.items);
          }
        },function(error){
          if ( error.status == 403 ) {
            _this.updateStatusFromError(error);
            _this.connect( function(user){
              if ( user.name ) {
                this.resourceErrorHandler(error);
              } else {
                _this.$root.$emit('app-msg','warning', "' Lost user session (logged out)." );
                _this.$root.setUser(user);
              }
            });
          } else {
              _this.resourceErrorHandler(error);
          }
        });
    },

    sortBy: function(sortKey) {
      if ( sortKey == this.sortKey ) {
        this.reverseSort = !this.reverseSort;
      }
      this.sortKey = sortKey;
      this.remoteSortEnabled ? 
        this.getItems() : this.localSort();
    },

    localSort: function(){
      if ( this.sortKey ){
        var items = this.$data.items;
        var key = this.sortKey;
        items = _.sortBy(items, function (item) {
          return item[key];
        })
        if (this.reverseSort) {
          items.reverse();
        }
        this.items = items;
      }
    },

    localFilter: function(filters,items){
      filters = _.chain(filters).map(function(f){return f.local();}).compact().value();
      console.log('filtering ' + items.length + ' items with ' + filters.length + ' filters.');
      console.dir(filters);
      if (filters.length) {
        items = _.filter(items, function(item) {
          var someFailed = _.some(filters, function(filter) { 
            var passed = filter(item); 
            return !passed; 
          });
          return !someFailed;
        });
      }
      return items;
    },

    debouncedApplyFilters: function(){
      if ( this.remoteFilterEnabled ) 
        this.debouncedGetItems();
    },

    applyFilters: function(){
      if ( this.remoteFilterEnabled ) 
        this.getItems();
    },

    getSortIcon: function(key){
      if ( key == this.sortKey ) {
        if ( this.reverseSort ) {
          return 'desc';
        }
        return 'asc';
      } 
      return 'both';
    },

    processUrlQuery: function(){
      filters = this.filters;
      var query = this.$route.query;
      this.sortKey = query.sortKey;
      this.reverseSort = query.reverseSort; 
      var filterKeys = _.without(_.keys(query),'sortKey','reverseSort');
      _.each(filters,function(filter){
        _.each(filterKeys, function(filterKey){ 
          if ( filterKey == filter.key ) {
            filter.pattern = query[filterKey];
          }
        });
      });
    }

  },


  watch: {
    '$route': function(newVal,oldVal){ 
      this.processUrlQuery(); 
      this.applyFilters(); 
    }
  }
};