!function(){
  'use strict'

  describe('Testing Backbone Model Plugin', function(){

    var File = Backbone.Model.extend({
      url: 'upload-test.php',
      fileAttribute: 'fileAttachment'
    });

    var fileModel;
    var simulatedFileObj;

    beforeEach(function(){

      simulatedFileObj = new Blob(['<strong>Hello World</strong>'], {type : 'text/html'});

      fileModel = new File({
        from: 'sample@email.com',
        subject: 'Hello, friend!',
        body: 'Dear friend, Just saying hello! Love, Yours truly.',
        nestedObject: {
          nest: 'eggs'
        }
      });

    });

    it('should detect the file(blob) save successfully', function(done){
      
      // Arrange
      fileModel.set({fileAttachment: simulatedFileObj});

      // Listen
      fileModel.on('sync', function(model){
        
        // Assert
        expect(model.get('from')).toBe('sample@email.com');
        expect(model.get('fileAttachment').data).toBe('data:text/html;base64,PHN0cm9uZz5IZWxsbyBXb3JsZDwvc3Ryb25nPg==');

        done();

      })

      // Act
      fileModel.save(null);

    });

    it ('should be able to be saved in as an argument of "save" as object', function(done){

      // Listen
      fileModel.on('sync', function(model){
        
        // Assert
        expect(model.get('from')).toBe('sample@email.com');
        expect(model.get('fileAttachment').data).toBe('data:text/html;base64,PHN0cm9uZz5IZWxsbyBXb3JsZDwvc3Ryb25nPg==');

        done();

      });

      // Act
      fileModel.save({fileAttachment: simulatedFileObj});

    });

    it ('should be able to be saved in as an argument of "save" as key/value argument', function(done){

      // Listen
      fileModel.on('sync', function(model){
        
        // Assert
        expect(model.get('from')).toBe('sample@email.com');
        expect(model.get('fileAttachment').data).toBe('data:text/html;base64,PHN0cm9uZz5IZWxsbyBXb3JsZDwvc3Ryb25nPg==');

        done();

      });

      // Act
      fileModel.save('fileAttachment', simulatedFileObj);

    });

    it ('should be able to have "wait" and "validate" option', function(done){

      // Listen
      fileModel.on('sync', function(model){
        
        // Assert
        expect(model.get('from')).toBe('sample@email.com');
        expect(model.get('fileAttachment').data).toBe('data:text/html;base64,PHN0cm9uZz5IZWxsbyBXb3JsZDwvc3Ryb25nPg==');

        done();

      });

      // Act
      fileModel.save({fileAttachment: simulatedFileObj},{wait: true, validate: false});

    });

    it('should still have the option to save normally by setting it and save(null)', function(done){

      // Listen
      fileModel.on('sync', function(model){
        
        // Assert
        expect(model.get('from')).toBe('somethingelse@email.com');
        //expect(model.get('fileAttachment').data).toBe('data:text/html;base64,PHN0cm9uZz5IZWxsbyBXb3JsZDwvc3Ryb25nPg==');

        done();

      });

      // Act
      fileModel.set({from: 'somethingelse@email.com'});
      fileModel.save(null);

    });

    it('should still have the option to save normally by save("from","yes")', function(done){

      // Listen
      fileModel.on('sync', function(model){
        
        // Assert
        expect(model.get('from')).toBe('yes');
        //expect(model.get('fileAttachment').data).toBe('data:text/html;base64,PHN0cm9uZz5IZWxsbyBXb3JsZDwvc3Ryb25nPg==');

        done();

      });

      // Act
      fileModel.save('from','yes');

    });

    it('should still have the option to save normally by save({from: "yes"})', function(done){

      // Listen
      fileModel.on('sync', function(model){
        
        // Assert
        expect(model.get('from')).toBe('yes');
        //expect(model.get('fileAttachment').data).toBe('data:text/html;base64,PHN0cm9uZz5IZWxsbyBXb3JsZDwvc3Ryb25nPg==');

        done();

      });

      // Act
      fileModel.save({from: "yes"});

    });

  });

}();