var easymidi = require('easymidi');
var input = new easymidi.Input('Akai APC20');
input.on('noteon', function (msg) {
  // do something with msg
});