var AWS = require('aws-sdk');
const config = require('config');

var s3 = new AWS.S3({
  accessKeyId: config.get('S3_KEY'),
  secretAccessKey: config.get('S3_SECRET'),
  region: config.get('S3_REGION')
});

class Uploads {
  static async uploadFile (file, _user, stamp) {
    var buffer = Buffer.from(file.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    console.log(buffer);
    var filename = config.get('S3_FOLDER') + _user + stamp + '.jpg';

    var params = {
      Bucket: 'compcult',
      Key: filename,
      Body: buffer,
      ACL: 'public-read',
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg'
    };

    await s3.upload(params).promise();
  }

  static async uploadAudio (file, _user, stamp) {
    var buffer = Buffer.from(file, 'base64');
    var filename = config.get('S3_FOLDER') + _user + stamp + '.wav';

    var params = {
      Bucket: 'compcult',
      Key: filename,
      Body: buffer,
      ACL: 'public-read',
      ContentEncoding: 'base64',
      ContentType: 'audio/wav'
    };

    let putObjectPromise = await s3.upload(params).promise();
    let location = putObjectPromise.Location;

    console.log(location);
  }

  static async uploadVideo (file, _user, stamp) {
    var buffer = Buffer.from(file, 'base64');
    var filename = config.get('S3_FOLDER') + _user + stamp + '.mp4';

    var params = {
      Bucket: 'compcult',
      Key: filename,
      Body: buffer,
      ACL: 'public-read',
      ContentEncoding: 'base64',
      ContentType: 'video/mp4'
    };

    let putObjectPromise = await s3.upload(params).promise();
    let location = putObjectPromise.Location;

    console.log(location);
  }
}

module.exports = Uploads;
