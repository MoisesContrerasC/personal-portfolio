process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var express = require('./config/express');
var app = express();
app.listen(process.env.PORT || 3000, function(){

    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);

  });
module.exports = app;
console.log('Server running at http://localhost:3000/');
