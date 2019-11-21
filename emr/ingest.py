from pyspark.sql.functions import col
from pyspark.sql import SparkSession
spark = SparkSession.builder.appName("appName").getOrCreate()

import sys
y = sys.argv[1]
m = sys.argv[2]
d = sys.argv[3]
spark.read.json(
	"s3://aiml-course-fruitball/ingress/" + y + "/" + m + "/" + d
).select(
	[col('record.team1.players').getItem(i)["value"].alias("t1p" + str(i)) for i in range(14)] +
	[col('record.team2.players').getItem(i)["value"].alias("t2p" + str(i)) for i in range(14)] +
	[col('record.result.t1Score'), col('record.result.t2Score')] +
	[col('record.team1.formation').alias("t1form")] +
	[col('record.team2.formation').alias("t2form")] +
	[col('name'), col('select'), col('record.result.winner')]
).write.parquet("s3://aiml-course-fruitball/ingest/" + y + "/" + m + "/" + d)
