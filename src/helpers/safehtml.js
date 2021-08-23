const handlebars = require('handlebars');
module.exports = function(html) {
    return new handlebars.SafeString(html);
}