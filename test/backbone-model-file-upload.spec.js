!function(){
  'use strict';

  describe('Testing Backbone Model Plugin', function(){

    Backbone.$.ajaxSetup({
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    });

    var File = Backbone.Model.extend({
      url: 'http://localhost:8989/',
      fileAttribute: 'fileAttachment'
    });



    var fileModel;
    var simulatedFileObj;
    var simulatedFileObj2;

    beforeEach(function(){

      simulatedFileObj = new Blob(['<strong>Hello World</strong>'], {type : 'text/html'});
      simulatedFileObj2 = new Blob(['<strong>Hello Again, World</strong>'], {type : 'text/html'});

      fileModel = new File({
        from: 'sample@email.com',
        subject: 'Hello, friend!',
        body: 'Dear friend, Just saying hello! Love, Yours truly.',
        nestedObject: {
          nest: 'eggs',
          nestier: {
            nestiest: {
              0: 'one',
              1: 'two',
              2: 'three'
            }
          }
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

        // Assert Blob (phantomJS can't do Blobs so just test minimal attributes)
        expect(model.get('fileAttachment').size).toBe(28);
        expect(model.get('fileAttachment').type).toBe('text/html');
        //expect(model.get('fileAttachment').data).toBe('data:text/html;base64,PHN0cm9uZz5IZWxsbyBXb3JsZDwvc3Ryb25nPg==');

        done();

      });

      // Act
      fileModel.save(null);

    });

    it ('should be able to be saved in as an argument of "save" as object', function(done){

      // Listen
      fileModel.on('sync', function(model){

        // Assert
        expect(model.get('from')).toBe('sample@email.com');

        // Assert Blob (phantomJS can't do Blobs so just test minimal attributes)
        expect(model.get('fileAttachment').size).toBe(28);
        expect(model.get('fileAttachment').type).toBe('text/html');
        //expect(model.get('fileAttachment').data).toBe('data:text/html;base64,PHN0cm9uZz5IZWxsbyBXb3JsZDwvc3Ryb25nPg==');

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
        // Assert Blob (phantomJS can't do Blobs so just test minimal attributes)
        expect(model.get('fileAttachment').size).toBe(28);
        expect(model.get('fileAttachment').type).toBe('text/html');
        //expect(model.get('fileAttachment').data).toBe('data:text/html;base64,PHN0cm9uZz5IZWxsbyBXb3JsZDwvc3Ryb25nPg==');

        done();

      });

      // Act
      fileModel.save('fileAttachment', simulatedFileObj);

    });

    it ('should be able to save an array of multiple file objects', function(done){
    // Listen
    fileModel.on('sync', function(model){
        // Assert
        expect(model.get('from')).toBe('sample@email.com');

        // Assert Blob (phantomJS can't do Blobs so just test minimal attributes)
        expect(model.get('fileAttachment')[0].size).toBe(28);
        expect(model.get('fileAttachment')[0].type).toBe('text/html');
        //expect(model.get('fileAttachment')[0].data).toBe('data:text/html;base64,PHN0cm9uZz5IZWxsbyBXb3JsZDwvc3Ryb25nPg==')
        expect(model.get('fileAttachment')[1].size).toBe(35);
        expect(model.get('fileAttachment')[1].type).toBe('text/html');
        //expect(model.get('fileAttachment')[1].data).toBe('data:text/html;base64,PHN0cm9uZz5IZWxsbyBBZ2FpbiwgV29ybGQ8L3N0cm9uZz4K=')

        done();

      });

      // Act
      fileModel.save('fileAttachment', [simulatedFileObj, simulatedFileObj2], {formData: true});
    });

    it ('should be able to have "wait" and "validate" option', function(done){

      // Listen
      fileModel.on('sync', function(model){

        // Assert
        expect(model.get('from')).toBe('sample@email.com');
        // Assert Blob (phantomJS can't do Blobs so just test minimal attributes)
        expect(model.get('fileAttachment').size).toBe(28);
        expect(model.get('fileAttachment').type).toBe('text/html');
        //expect(model.get('fileAttachment').data).toBe('data:text/html;base64,PHN0cm9uZz5IZWxsbyBXb3JsZDwvc3Ryb25nPg==');

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
      fileModel.save();

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

    it('should still silent true with file', function(done){

      var changed = false;

      // Listen
      fileModel.on('sync', function(model){

        // Assert
        // Assert Blob (phantomJS can't do Blobs so just test minimal attributes)
        expect(model.get('fileAttachment').size).toBe(28);
        expect(model.get('fileAttachment').type).toBe('text/html');
        //expect(model.get('fileAttachment').data).toBe('data:text/html;base64,PHN0cm9uZz5IZWxsbyBXb3JsZDwvc3Ryb25nPg==');

        setTimeout(function(){
          expect(changed).not.toBeTruthy();
          done();
        },500);

      });

      fileModel.on('change', function(){
        changed = true;
      });

      // Act
      fileModel.save({fileAttachment: simulatedFileObj}, {silent: true});

    });

    it('should still silent true without file', function(done){

      var changed = false;

      // Listen
      fileModel.on('sync', function(model){

        // Assert
        expect(model.get('from')).toBe('yes');

        setTimeout(function(){
          expect(changed).not.toBeTruthy();
          done();
        },500);

      });

      fileModel.on('change', function(){
        changed = true;
      });

      // Act
      fileModel.save({from: "yes"}, {silent: true});

    });

    it('should flatten correctly using a bracket notation', function(){

      // Arrange
      var expected = {
        "from": "sample@email.com",
        "subject": "Hello, friend!",
        "body": "Dear friend, Just saying hello! Love, Yours truly.",
        "nestedObject[nest]": "eggs",
        "nestedObject[nestier[nestiest[0]]]": "one",
        "nestedObject[nestier[nestiest[1]]]": "two",
        "nestedObject[nestier[nestiest[2]]]": "three"
      };

      var flattened = fileModel._flatten(fileModel.toJSON());

      expect(flattened["nestedObject[nest]"]).toBe("eggs")
      expect(flattened["nestedObject[nestier[nestiest[0]]]"]).toBe("one");
      expect(flattened["nestedObject[nestier[nestiest[1]]]"]).toBe("two");
      expect(flattened["nestedObject[nestier[nestiest[2]]]"]).toBe("three");
    });

    it('should unflatten correctly using internal "unflatten" function', function(){

      var flattened = fileModel._flatten(fileModel.toJSON()),
          unflattened = fileModel._unflatten(flattened);

      expect(_.isEqual(unflattened, fileModel.toJSON())).toBeTruthy();

      console.log(JSON.stringify(fileModel._flatten({
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
      })));

    });

  });


}();
