var AWS = require('aws-sdk');
var emr = new AWS.EMR();
exports.handler = (event, context, callback) => {
    var dateObj = new Date();
    dateObj.setDate(dateObj.getDate() - 1);
    var year = dateObj.getUTCFullYear() + "";
    var month = (dateObj.getUTCMonth() + 1) + ""; //months 1-12
    var day = dateObj.getUTCDate() + "";
    var params = {
        "Name": "Launch EMR",
        "Instances": {
            "KeepJobFlowAliveWhenNoSteps": false,
            "TerminationProtected": false,
            "HadoopVersion": "2.8.5",
            "InstanceGroups": [{
                "Name": "Master Instance Group",
                "InstanceRole": "MASTER",
                "InstanceCount": 1,
                "InstanceType": "m5.xlarge",
                "Market": "ON_DEMAND"
            }, {
                "Name": "Core Instance Group",
                "InstanceRole": "CORE",
                "InstanceCount": 1,
                "InstanceType": "m5.xlarge",
                "Market": "ON_DEMAND"
            }]
        },
        "Steps": [{
            "Name": "Spark Application",
            "ActionOnFailure": "CANCEL_AND_WAIT",
            "HadoopJarStep": {
                "Jar": "command-runner.jar",
                "Args": ["spark-submit", "--deploy-mode", "cluster", "s3://aiml-course-fruitball/code/ingest.py", year, month, day]
            }
        }, {
            "Name": "Spark Application",
            "ActionOnFailure": "CANCEL_AND_WAIT",
            "HadoopJarStep": {
                "Jar": "command-runner.jar",
                "Args": ["spark-submit", "--deploy-mode", "cluster", "s3://aiml-course-fruitball/code/etl.py", year, month, day]
            }
        }],
        "Applications": [{
            "Name": "spark"
        }],
        "ServiceRole": "EMR_DefaultRole",
        "JobFlowRole": "EMR_EC2_DefaultRole",
        "ReleaseLabel": "emr-5.28.0",
        "VisibleToAllUsers": true
    };
    emr.runJobFlow(params)
        .on('success', function(response){ console.log("success => " + response); console.log(response); })
        .on('error', function(response){ console.log("error => " + response); console.log(response); })
        .on('complete', function(response){ console.log("complete => "  + response); console.log(response); })
        .send( function(err, data){
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
            callback(null, {
                statusCode: 200,
                body: JSON.stringify(err),
            });
        });
};
