var async = require('async');
var fs = require('fs');
var unzip = require('unzip');
var imageController = require('../image/imageController');

exports.uploadDataSet = function (read_path, project, callback) {
    var rootFolder = './images';
    var write_path = rootFolder + '/' + project.businessUser + '/' + project._id;
    async.waterfall([
        function (next) {
            if (!fs.existsSync(rootFolder)) {
                fs.mkdir(rootFolder + '/', function(){
                    fs.mkdir(rootFolder + '/' + project.businessUser, function(){
                        fs.mkdir(write_path, function(){
                            next();
                        });
                    });
                });
            } else if (!fs.existsSync(rootFolder + '/' + project.businessUser)) {
                fs.mkdir(rootFolder + '/' + project.businessUser, function() {
                    fs.mkdir(write_path, function(){
                        next();
                    });
                });
            } else if (!fs.existsSync(write_path)) {
                fs.mkdir(write_path, function(){
                    next();
                });
            } else {
                next();
            }
        },

        function (next) {
            fs.createReadStream(read_path)
            .pipe(unzip.Extract({ path: write_path }));
            next();
        },

        function (next) {
            fs.readdir(write_path, function (err, filenames) {
                if (err) {
                    return err;
                } else {
                    filenames.forEach(function (filename) {
                        var imagePath = write_path + '/' + filename;
                        imageController.create(imagePath, filename, function(err, image) {
                            if (err) return callback(err);
                            // console.log("IMAGE SUCCESSFULLY SAVED:")
                            /*project.images.push({
                                path: write_path + '/' + filename
                            });*/
                        });
                    });
                    next();
                }
            });
        },

        function() {
            console.log("async.waterfall 3");
            project.save(function (err) {
                if (err) return callback(err);
                else return callback();
            });
        }
    ]);
};