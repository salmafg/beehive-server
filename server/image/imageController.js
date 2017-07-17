var Uploader = require('s3-image-uploader');
var Image = require('./imageModel');
var awsConfig = require('../../config/awsConfig');
var config = require('../../config');

var uploader = new Uploader({
  aws: {
    key : awsConfig.accessKeyId,
    secret : awsConfig.secretAccessKey
  },
  websockets: false
});

exports.create = function(imagePath, fileName, next) {
    var image = new Image();
    image.save(function(err, image) {
        if (err) return next(err);
        else {
            uploader.upload({
                fileId: image._id,
                bucket: awsConfig.bucketName,
                source: imagePath,
                name: image._id + "__" + fileName
            }, function(data) {
                console.log('AWS upload success:', data);
                image.path = config.s3BasePath + data.path;
                image.save(function(err, image) {
                    next(null, image._id);
                });
            }, function(errMsg, errObject) {
                console.error('AWS unable to upload: ' + errMsg + ':', errObject);
                next(err);
            });
        }
    })
}