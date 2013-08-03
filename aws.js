var AWS = require('aws-sdk'),
    fs = require('fs');

AWS.config.loadFromPath('./config.json');

// Set your region for future requests.
AWS.config.update({region: 'eu-west-1'});

var s3 = new AWS.S3();
s3.listBuckets(function(err, data) {
  for (var index in data.Buckets) {
    var bucket = data.Buckets[index];
    console.log("Bucket: ", bucket.Name, ' : ', bucket.CreationDate);
  }
});

fs.readFile("./Foto-3.jpg", function(err, data) {
  if (err) { throw err };
  console.log(data);

var data = {
  Bucket: 'raiseyourvoice2',
  Key: 'image',
  Body: data
};
s3.putObject(data, function(err, data) {
  if (err) {
    console.log("Error uploading data: ", err);
  } else {
    console.log("Successfully uploaded data to raiseyourvoice2/image");
  }
});

});
