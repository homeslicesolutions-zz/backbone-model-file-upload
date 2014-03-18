Backbone.Model File Upload
==========================
A concise, non-iframe, & pure XHR2/AJAX Backbone.model file upload.

This plugin upgrades the current `save` method to be able to upload files.

NOTE: This file upload plugin can only work if the model is flattened.  Deep nested objects within in the model will not output correctly.  (Explained later)

## How to use
Grab the File object from the DOM, `set` it to an attribute, then call `save`.  That's it!  (`save` with the attribute parameter works as well)
```
model.save([file attribute], [file object], [options]);
```
```
model.set('file', [file object]);
model.save({}, [options])

```
### save & set
#### model.save( [file attribute], [file object], [options] )
#### model.set( [file attribute], [file object], [options] )
In terms of how to use these methods, they have not changed. The only difference is that it has the capability to take a File object grabbed from the DOM (i.e. `<input type="file" />`).  As the file is being uploaded, a trigger `progress` is being sent as the browser sends chunks of data.  The `progress` trigger sends a progress status in percents.

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
This plugin will use the FormData class to wrap all the attributes in.  That basically means it's making what we used to know as the old-fashioned "form" into a data object.  The old-fashion "form" only took key-value pairs, so the same applies here.  The attributes gets converted into a FormData object then is sent through as a "multipart/data-form".  So it is recommended to use a flattened model as Jeremy Ashkenas himself recommends.

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
