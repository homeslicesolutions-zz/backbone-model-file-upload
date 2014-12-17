Backbone.Model File Upload
==========================
![alt tag](https://travis-ci.org/homeslicesolutions/backbone-model-file-upload.svg?branch=master)
A concise, non-iframe, & pure XHR2/AJAX Backbone.model file upload. (Good for IE >= 10, FF, Chrome.)



This plugin upgrades the current `save` method to be able to upload files using the HTML5's File API and FormData class.

## How to use
Grab the File object from the DOM, `set` it to an attribute, then call `save`.  That's it!  (`save` with the attribute parameter works as well)
```
model.set('file', [file object]);
model.save({}, [options])
```
```
model.save([file attribute], [file object], [options]);
```
### set & save
#### model.set( [file attribute], [file object], [options] )
#### model.save( [file attribute], [file object], [options] )

In terms of how to use these methods, they have not changed. The only difference is that it has the capability to take a File object grabbed from the DOM (i.e. `<input type="file" />`). 

File, Blob, and FileList are all valid in the model.  Once set it will be uploaded when ready. 

As the file is being uploaded, a trigger `progress` fires as the browser sends chunks of data.  The `progress` trigger sends a progress status in percents.  

If you want to force not using FormData, add the option `{ formData: false }` and the whether or not you have a file object in the model, it'll try to send it as part of the JSON object.  Opposite is true (for whichever circumstance) is that if you set `{ formData: true }`, it will force the usage of FormData.  Not setting it will leave it automatic and it'll try to detect if there is the file in the model.

```js
var fileObject = $(':input[type="file"]')[0].files[0];

var Email = Backbone.Model.extend({ url: 'upload.php', fileAttribute: 'attachment' });
var email = new Email();

email.set('from',       'me@somewhere.com');
email.set('to',         'somebody@somewhere.com');
email.set('subject',    'Greetings!');
email.set('body',       'Just wanted to say hello. Yours truly');
email.set('attachment', fileObject);

email.save();

email.on('progress', console.log);
// Will result: the status in percent i.e. 0.3233

```
### fileAttribute
#### model.fileAttribute = [attribute]
The attribute `file` is the default. As you can see from the example above, you can set it to whatever you want.

## How it works
This plugin will use the FormData class to wrap all the attributes in.  That basically means it's making what we used to know as the old-fashioned "form" into a data object.  The old-fashion "form" only took key-value pairs, so the same applies here.  The attributes gets converted into a FormData object then is sent through as a "multipart/data-form".  So it is recommended to use a flattened model for easier parsing as Jeremy Ashkenas himself usually recommends for all scenarios.

To see how to support file uploads for .NET, see this good link:
http://www.asp.net/web-api/overview/working-with-http/sending-html-form-data,-part-2

For java, there's a great example here using the Spring framework:
http://viralpatel.net/blogs/spring-mvc-multiple-file-upload-example/

In the "test" folder (not finished yet), I included a PHP uploader just for testing purposes, but feel free to extend that.  You have to figure out the file upload limitations, however.

## What happens to a model with nested objects/arrays?
The model will be flattened and the nested value will be separated with it's own unique composite "breadcrumb" key.  The key parsing will reflect the array or object with the index or property respectively.
```
var obj = {
  'family': 'The Smiths',
  'grandpa': {
    'name': 'Ole Joe Smith',
    'children': [
      {
        'name': 'Mary Lee',
        'spouse': 'John Lee',
        'children': [
          {
            'name': 'Tiny Lee'
          }
        ]
      },
      {
        'name': 'Susan Smith'
      }
    ]
  }
}
``` 
Will parse into
```
obj['family']                             => 'The Smiths';
obj['grandpa.name']                       => 'Ole Joe Smith';
obj['grandpa.children.0.name']            => 'Mary Lee'; 
obj['grandpa.children.0.spouse']          => 'John Lee';
obj['grandpa.children.0.children.0.name'] => 'Tiny Lee';
obj['grandpa.children.1.name']            => 'Susan Smith'; 
```

## Non-destructive plugin
The plugin is non-destructive to the existing behaviors.  When a file object is detected, then the method is tweaked and converted to a FormData object.

## Prerequisites
 - jQuery
 - Backbone v1.0
 - Underscore v1.4

## How to load

### Require.js AMD

```js
requirejs.config({
  paths: {
    'jquery': 'assets/js/jquery',
    'underscore': 'assets/js/underscore',
    'backbone': 'assets/js/backbone',
    'backbone-model-file-upload': 'assets/js/backbone-model-file-upload'
  },

  shim: {
    'backbone': {
      deps: ['underscore'],
      exports: 'Backbone'
    },
    'backbone-model-file-upload': {
      deps: ['jquery', 'underscore', 'backbone'],
      exports: 'Backbone'
    }
  }
});
```

### Static

```html
<script src="assets/js/jquery.js" />
<script src="assets/js/underscore.js" />
<script src="assets/js/backbone.js" />
<script src="assets/js/backbone-model-file-upload.js" />
```

### Revisions

c Version v0.1
- First release

#### Version v0.2
- Reformatted to standard AMD boilerplate pattern

#### Version v0.3
- Fixed the use of "attrs" instead of using "this.attributes" at condition check and model parsing/flattening
- Added the option to save just option, i.e:  .save({ silent: true });

#### Version 0.4
 - Fixed all the wonkiness from 0.3 with the attributes and save.  Reverted a lot of code and refactored
 - Added "blob" support as a FileObj entity
 - Added some Jasmine tests

#### Version 0.5
 - Added FileList support

#### Version 0.5.1
 - Fix refactoring error.  

#### Version 0.5.2
 - Add jQuery to the UMD dependency model

#### Version 0.5.3
 - Added CommonJS support
 
### Dev/Installation
If you want to work on this plugin, test it, etc., it just needs an install of `node` and `grunt`. 
```
npm i -d
```
To build
```
grunt build
```
To test
```
npm test OR grunt test
```
