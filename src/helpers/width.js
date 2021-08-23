const handlebars = require('handlebars');
module.exports = function(size) {
    return new handlebars.SafeString(size.split('x')[0]);
}