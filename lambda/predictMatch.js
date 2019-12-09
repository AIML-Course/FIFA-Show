const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const https = require('https');

exports.handler = function (event, context, callback) {
    var params = {Bucket: "aiml-course-fruitball", Key: "model/w.csv"};
    https.get(`https://kwtw3f5wyf.execute-api.ap-northeast-1.amazonaws.com/default/getMatchAttributes`, (req, res) => {
        let html = '';
        req.on('data', function (data) {
            html += data;
        });
        req.on('end', function () {
            console.log(html);
            let result = JSON.parse(html);
            console.log(result);
            
            s3.getObject(params, function (err, data) {
                if(err) {
                    console.log(err);
                    return callback(null, {
                        "statusCode": 400,
                        "body": JSON.stringify(err)
                    });
                } else {
                    var wStr = data.Body.toString();
                    var w = wStr.split(',').map(wi => parseFloat(wi));
                    console.log(w);
                    var t1Score = 0;
                    var t2Score = 0;
                    for(var i = 0; i < 14; i++) {
                        t1Score += result.team1.players[i].value * w[i];
                        t2Score += result.team2.players[i].value * w[i];
                    }
                    console.log(t1Score + "\n");
                    console.log(t2Score + "\n");
                    return callback(null, {
                        "statusCode": 200,
                        "body": t1Score > t2Score
                    });
                }
            });
        });
    });
};
