const crypto = require('crypto');
const forms = [
    {"name": "4-4-2", "value": [1.0, 1.0, 1.0]},
    {"name": "4-3-3", "value": [1.0, 0.8, 1.1]},
    {"name": "4-3-2-1", "value": [1.2, 1.2, 0.8]},
    {"name": "4-2-3-1", "value": [1.0, 1.2, 0.9]},
    {"name": "4-2-2-2", "value": [0.9, 1.1, 1.0]},
    {"name": "4-5-1", "value": [1.0, 1.4, 0.8]},
    {"name": "5-3-2", "value": [1.2, 0.8, 1.0]},
    {"name": "5-4-1", "value": [1.2, 1.0, 0.9]},
    {"name": "3-4-3", "value": [0.8, 1.0, 1.1]},
    {"name": "3-5-2", "value": [0.8, 1.2, 1.0]},
    {"name": "3-6-1", "value": [0.8, 1.4, 0.9]}
];
function posSum(t, pos) {
    return t.players.filter(p =>
        p.position == pos
    ).reduce((a, p) => a + p.value, 0);
}
function features(t) {
    var fsum = posSum(t, "F");
    var msum = posSum(t, "M");
    var bsum = posSum(t, "B");
    var gsum = posSum(t, "G");
    var form = forms.filter(f => f.name == t.formation);
    var value = [1, 1, 1];
    if(form.length > 0) {
        value = form[0].value;
    }
    return {
        "attack": (fsum + msum / 5) * Math.pow(value[2], 2),
        "control": (msum + bsum) * Math.pow(value[1], 2),
        "defend": (gsum + bsum / 5) * Math.pow(value[0], 2)
    };
}
function versus(t1, t2) {
    var f1 = features(t1);
    var f2 = features(t2);
    var totalC = (f1.control + f2.control);
    var e1 = f1.control / totalC * Math.max(0, f1.attack - f2.defend);
    var e2 = f2.control / totalC * Math.max(0, f2.attack - f1.defend);
    var p1 = Math.floor(e1 / 10 + e1 * 4 / 10 * Math.random());
    var p2 = Math.floor(e2 / 10 + e2 * 4 / 10 * Math.random());
    while(p1 == p2) {
        // console.log(p1 + " : " + p2);
        p1 += Math.floor((e1 / 5 + 1.1) * Math.random());
        p2 += Math.floor((e2 / 5 + 1.1) * Math.random());
    }
    var winner = 1;
    if(p2 > p1) winner = 2;
    // console.log(p1 + " : " + p2);
    return {
        "team1": t1,
        "team2": t2,
        "result": {
            "t1Score": p1,
            "t2Score": p2,
            "winner": winner
        }
    };
}

const AWS = require('aws-sdk');
const s3 = new AWS.S3();
exports.handler = function(event, context, callback) {
    console.log(event);
    if(body && body.match) {
        var body = JSON.parse(event.body);
        var checkMatch = {
            "team1": body.match.team1,
            "team2": body.match.team2
        };
        var checkHash = crypto.createHash('md5').update(JSON.stringify(checkMatch) + "-hinmay").digest('hex');
        if(body.match.hash == checkHash) {
            var dateObj = new Date();
            var year = dateObj.getUTCFullYear();
            var month = dateObj.getUTCMonth() + 1; //months 1-12
            var day = dateObj.getUTCDate();
            var result = {
                record: versus(body.match.team1, body.match.team2),
                name: body.name,
                select: body.select,
                time: dateObj.toISOString()
            };
            var dstBucket = "aiml-course-fruitball";
            var dstKey = "ingress/" + year + "/" + month + "/" + day + "/" + result.name + "-" + result.time + ".json";
            s3.putObject({
                Bucket: dstBucket,
                Key: dstKey,
                Body: JSON.stringify(result),
                ContentType: "application/json"
            }, function (err, data) {
                if(err) {
                    console.log("[ERROR] " + JSON.stringify(err));
                    var resErr = {
                        statusCode: 400,
                        headers: {
                            "Access-Control-Allow-Origin": "*"
                        },
                        body: err
                    };
                    callback(null, resErr);
                } else {
                    console.log("[ETAG] " + data.ETag.slice(1, -1));
                    var resVal = {
                        statusCode: 200,
                        headers: {
                            "Access-Control-Allow-Origin": "*"
                        },
                        body: JSON.stringify(result.record.result)
                    };
                    callback(null, resVal);
                }
            });
        } else {
            callback(null, {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*"
                },
                body: "hash mis-matched"
            });
        }
    } else {
        callback(null, {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: "no body"
        });
    }
}
