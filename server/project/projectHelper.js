var Image = require('../image/imageModel');
var async = require('async');
var fs = require('fs');
var unzip = require('unzip');

exports.uploadDataSet = function (read_path, project, callback) {
    var write_path = './images/' + project._id;
    async.waterfall([
        function (next) {
            if (!fs.existsSync('./images')) {
                fs.mkdir('./images/', function(){
                    fs.mkdir(write_path, function(){
                        next();
                    });
                });
            } else if (!fs.existsSync(write_path)) {
                fs.mkdir(write_path, function(){
                    next();
                });
            }
            else next();
        }, function (next) {
            var readStream = fs.createReadStream(read_path)
            .pipe(unzip.Extract({ path: write_path }));
            readStream
            .on('data', function (chunk) {
                console.log(chunk);
                readStream.destroy();
                next();
            })
            .on('end', function () {
                console.log('All the data in the file has been read');
                next();
            })
            .on('close', function (err) {
                console.log('Stream has been destroyed and file has been closed');
                next();
            });
        }, function (next) {
            fs.readdir(write_path, 'utf8', function (err, filenames) {
                if (err) return callback(err);
                else {
                    filenames.forEach(function (filename) {
                        console.log(filename);
                        var image = new Image(function(err, image) {
                            project.images.push(image);
                        });
                    });
                    next();
                }
            });
        }, function() {
            project.save(function (err) {
                if (err) return callback(err);
                else return callback();
            });
        }]);
};