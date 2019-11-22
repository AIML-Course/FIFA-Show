# Federation International Fruitball Association

Go through the entire batch data science processes

### Web

```
index.html
script/apis.js
script/graph.js
```

### Lambda Functions

```
getLeaderboard
getMatchAttributes
getMatchResult
```

### EMR Steps

```
spark-submit --deploy-mode cluster s3://aiml-course-fruitball/code/ingest.py 2019 11 21
spark-submit --deploy-mode cluster s3://aiml-course-fruitball/code/etl.py 2019 11 21
```
