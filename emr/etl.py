from pyspark.sql.functions import col, when
from pyspark.sql import SparkSession
spark = SparkSession.builder.appName("appName").getOrCreate()

import sys
y = sys.argv[1]
m = sys.argv[2]
d = sys.argv[3]
spark.read.parquet(
	"s3://aiml-course-fruitball/ingest/" + y + "/" + m + "/" + d
).withColumn("score",
	when(col("select") == col("winner"), 9).otherwise(1)
).select(
	[col("name"), col("score")]
).groupby(['name']).sum().withColumnRenamed(
	'sum(score)', 'score'
).write.csv(
	"s3://aiml-course-fruitball/egress/" + y + "/" + m + "/" + d
)
