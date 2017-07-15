var Image = require('./imageModel');
var config = require('../../config');
var AWS = require('aws-sdk');

AWS.config.loadFromPath('../../config/aws.json');

var s3Bucket = new AWS.S3( { params: {Bucket: config.S3BucketName} } )

exports.create = function(imageName, imageFile) {
    // TODO: figure out how to send data to AWS
    var data = {Key: imageName, Body: imageFile};
    s3Bucket.putObject(data, function(err, data) {
        if (err) {
            console.log('Error uploading data: ', data, err); 
        } else {
            console.log('succesfully uploaded the image!', data, err);
        }
    });
}