var Uploader = require('s3-image-uploader');
var Image = require('./imageModel');
var awsConfig = require('../../config/awsConfig');

var uploader = new Uploader({
  aws: {
    key : awsConfig.accessKeyId,
    secret : awsConfig.secretAccessKey
  },
  websockets: false
});

exports.create = function(imagePath, fileName, next) {
    var image = new Image();
    console.log("imageController.create");
    image.save(function(err, image) {
        if (err) return next(err);
        else {
            console.log("before uploader.upload");
            uploader.upload({
                fileId: image._id,
                bucket: awsConfig.bucketName,
                source: imagePath,
                name: fileName
            }, function(data) { // success
                console.log('upload success:', data);
              // execute success code
            }, function(errMsg, errObject) { //error
                console.error('unable to upload: ' + errMsg + ':', errObject);
              // execute error code
            });
        }
    })
}