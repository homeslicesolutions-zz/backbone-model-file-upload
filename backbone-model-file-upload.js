//     Backbone.Model File Upload v0.3
//     by Joe Vu - joe.vu@homeslicesolutions.com
//     For all details and documentation:
//     https://github.com/homeslicesolutions/backbone-model-file-upload
//     Contributors:
//       lutherism - Alex Jansen - alex.openrobot.net
//       bildja - Dima Bildin - github.com/bildja

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['underscore', 'backbone'], factory);
    } else {
        // Browser globals
        factory(_, Backbone);
    }
}(this, function(_, Backbone){

  // Clone the original Backbone.Model.prototype
  var backboneModelClone = _.clone( Backbone.Model.prototype );

  // Extending out
  var FileModel = Backbone.Model.extend({

    // ! Default file attribute - can be overwritten
    fileAttribute: 'file',

    // @ Save - overwritten
    save: function(key, val, options) {

      // Variables
      var attrs, attributes = this.attributes;

      // Signature parsing - similar to original Backbone.Model.save
      // Handle (key, value, options), ({key: value}, options), and (options) -style arguments.
      if (typeof key === 'object') {
        if (typeof val === void 0) {
          attrs = attributes;
          options = key;
        } else {
          attrs = key;
          options = val;
        }
      } else {
        (attrs = {})[key] = val;
      }

      // Validate & wait options - taken directly from original Backbone.Model.save
      options = _.extend({validate: true}, options);
      if (attrs && !options.wait) {
        if (!this.set(attrs, options)) return false;
      } else {
        if (!this._validate(attrs, options)) return false;
      }
      if (attrs && options.wait) {
        this.attributes = _.extend({}, attributes, attrs);
      }

      // Check for "formData" flag and check for if file exist.
      if ( options.formData === true 
           || options.formData !== false 
              && attrs[ this.fileAttribute ] 
              && attrs[ this.fileAttribute ] instanceof File ) {
        
        // Flatten Attributes reapplying File Object
        var formAttrs = _.clone( attrs ),
            fileAttr = attrs[ this.fileAttribute ];
        formAttrs = this._flatten( formAttrs );
        formAttrs[ this.fileAttribute ] = fileAttr;

        // Converting Attributes to Form Data
        var formData = new FormData();
        _.each( formAttrs, function( value, key ){
          formData.append( key, value );
        });

        // Set options for AJAX call
        options = options || {};
        options.data = formData;
        options.processData = false;
        options.contentType = false;

        // Apply custom XHR for processing status & listen to "progress"
        var that = this;
        options.xhr = function() {
          var xhr = $.ajaxSettings.xhr();
          xhr.upload.addEventListener('progress', function(){

            that._progressHandler.apply(that, arguments);
          }, false);
          return xhr;
        }
      }

      // Resume back to original state
      if (attrs && options.wait) this.attributes = attributes;

      // Continue to call the existing "save" method
      return backboneModelClone.save.call(this, attrs, options);

    },

    // _ FlattenObject gist by "penguinboy".  Thank You!
    // https://gist.github.com/penguinboy/762197
    _flatten: function( obj ) {
      var output = {};
      for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
          var flatObject = this._flatten(obj[i]);
          for (var x in flatObject) {
            if (!flatObject.hasOwnProperty(x)) continue;
            output[i + '.' + x] = flatObject[x];
          }
        } else {
          output[i] = obj[i];
        }
      }
      return output;

    },

    // _ Get the Progress of the uploading file
    _progressHandler: function( event ) {
      if (event.lengthComputable) {
        var percentComplete = event.loaded / event.total;
        this.trigger( 'progress', percentComplete );
      }
    }

  });

  //Exports
  Backbone.FileModel = FileModel;
  
  return FileModel;
}));
