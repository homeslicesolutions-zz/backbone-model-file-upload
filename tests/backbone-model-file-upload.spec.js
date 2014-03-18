!function(){
  'use strict'

  var File = Backbone.Model.extend({
    url: 'upload-test.php',
    fileAttribute: 'fileAttachment'
  });

  var file = new File({
    from: 'sample@email.com',
    subject: 'Hello, friend!',
    body: 'Dear friend, Just saying hello! Love, Yours truly.',
    nestedObject: {
      nest: 'eggs'
    }
  });

  $('#fileupload').on('change', function(e){
    var fileObj = $(this)[0].files[0];
    console.log(fileObj)
    file.set('fileAttachment', fileObj);
    file.save();
  })

  //file.save();

 

}();