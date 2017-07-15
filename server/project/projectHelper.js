var async = require('async');
var fs = require('fs');
var unzip = require('unzip');

exports.uploadDataSet = function (read_path, project, callback) {
    var write_path = './images/' + project.business_user + '/' + project._id;
    async.waterfall([
        function (next) {
            if (!fs.existsSync('./images')) {
                fs.mkdir('./images/', function(){
                    fs.mkdir('./images/' + project.business_user, function(){
                        fs.mkdir(write_path, function(){
                            next();
                        });
                    });
                });
            } else if (!fs.existsSync('./images/' + project.business_user)) {
                fs.mkdir('./images/' + project.business_user, function() {
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
            fs.createReadStream(read_path)
            .pipe(unzip.Extract({ path: write_path }));
            next();
        }, function (next) {
            fs.readdir(write_path, function (err, filenames) {
                if (err) return err;
                else {
                    filenames.forEach(function (filename) {
                        project.images.push({
                            path: write_path + '/' + filename
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