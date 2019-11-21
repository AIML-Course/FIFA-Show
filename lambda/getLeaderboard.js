const AWS = require('aws-sdk');
const s3 = new AWS.S3();
function fileCascade(files, i, str, cb) {
    if(i == files.length) {
        return cb(null, {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": str
        });
    } else {
        var file = files[i];
        var params = {Bucket: "aiml-course-fruitball", Key: file.Key};
        s3.getObject(params, function (err, data) {
            if(err) {
                console.log(err);
                return cb(null, {
                    "statusCode": 400,
                    "headers": {
                        "Access-Control-Allow-Origin": "*"
                    },
                    "body": JSON.stringify(err)
                });
            } else {
                return fileCascade(
                    files,
                    i + 1,
                    str + data.Body.toString() + "\n",
                    cb
                );
            }
        });
    }
}

exports.handler = function(event, context, callback) {
    var dateObj = new Date();
    // dateObj.setDate(dateObj.getDate() - 1);
    var year = dateObj.getUTCFullYear();
    var month = dateObj.getUTCMonth() + 1; //months 1-12
    var day = dateObj.getUTCDate();
    var params = {
        Bucket: 'aiml-course-fruitball',
        Prefix: 'egress/' + year + '/' + month + '/' + day + '/'
    };
    s3.listObjects(params, function (err, data) {
        if(err) throw err;
        var files = data.Contents.filter(f => f.Size > 0);
        fileCascade(files, 0, "", callback);
    });
};
