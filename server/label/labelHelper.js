var Label = require('./labelModel.js');
var error = require('../../config/error')

exports.create = function(label, callback) {
  if (!label.name || !label.x || !label.y || !label.width || !label.height) {
    return callback(error.createFail("label"))
  }

  var newLabel = new Label({
    name: label.name,
    x: label.x,
    y: label.y,
    width: label.width,
    height: label.height
  })

  newLabel.save(function(err, label) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, label);
    }
  })
}