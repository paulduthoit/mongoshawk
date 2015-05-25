/*

	Query Selector (Find Filter)

		Comparison

			$gt 				{ <field>: { $gt: <value> } }
			$gte 				{ <field>: { $gte: <value> } }
			$lt 				{ <field>: { $lt: <value> } }
			$lte				{ <field>: { $lte: <value> } }
			$ne					{ <field>: { $ne: <value> } }
			$in					{ <field>: { $in: [ <value1>, ... , <valueN> ] } }
			$nin				{ <field>: { $nin: [ <value1>, ... , <valueN> ] } }

		Logical

			$not 				{ <field>: { $not: { <expression> } } }
			$and 				{ $and: [ { <expression1> }, ... , { <expressionN> } ] }
			$or 				{ $or: [ { <expression1> }, ... , { <expressionN> } ] }
			$nor				{ $nor: [ { <expression1> }, ... , { <expressionN> } ] }

		Element

			$exists				{ <field>: { $exists: <boolean> } }
			$type 				{ <field>: { $type: <bsonType> } }

		Evaluation

			$mod				{ <field>: { $mod: [ <divisor>, <remainder> ] } }
			$regex 				{ <field>: { $regex: /<pattern>/<options> } }
			$text 				{ $text: { $search: <string>, $language: <string> } }
			$where 				{ $where: <javascript> }

		Geospatial

			$geoIntersects 		XXXXXXXX
			$geoWithin 			XXXXXXXX
			$nearSphere 		XXXXXXXX
			$near 				XXXXXXXX

		Array

			$all 				{ <field>: { $all: [ <value1>, ... , <valueN> ] } }
			$elemMatch 			{ <field>: { $elemMatch: { <query1>, ... , <queryN> } } }
			$size 				{ <field>: { $size: <number> } }


	Projection Operators (Find Fields)

		$ 						{ <field>.$: 1 }
		$elemMatch 				{ <field>: { $elemMatch: { <query1>, ... , <queryN> } } }
		$meta 					{ score: { $meta: "textScore" } } (only with $text query)
		$slice 					{ <field>: { $slice: <number> } }


	Update Operators (Update Body)

		Fields

			$currentDate 			{ $currentDate: { <field1>: <typeSpecification1>, ... , <fieldN>: <typeSpecificationN> } } (typeSpecification1 : true OR { $type: "timestamp" } OR { $type: "date" })
			$inc 					{ $inc: { <field1>: <amount1>, ... , <fieldN>: <amountN> } }
			$max 					{ $max: { <field1>: <value1>, ... , <fieldN>: <valueN> } }
			$min 					{ $min: { <field1>: <value1>, ... , <fieldN>: <valueN> } }
			$mul 					{ $mul: { <field1>: <number1>, ... , <fieldN>: <numberN> } }
			$rename 				{ $rename: { <field1>: <newName1>, ... , <fieldN>: <newNameN> } }
			$setOnInsert			{ $setOnInsert: { <field1>: <value1>, ... , <fieldN>: <valueN> } } (only with upsert option)
			$set 					{ $set: { <field1>: <value1>, ... , <fieldN>: <valueN> } }
			$unset 					{ $unset: { <field1>: "", ... , <fieldN>: "" } }

		Array

			$ 						{ <updateOperator>: { "<field>.$" : value } }
			$addToSet 				{ $addToSet: { <field1>: <value1>, ... , <fieldN>: <valueN> } }
			$pop 					{ $pop: { <field1>: <-1|1>, ... , <fieldN>: <-1|1> } }
			$pullAll 				{ $pullAll: { <field1>: [ <value1>, ... , <valueN> ], ... , <fieldN>: [ <value1>, ... , <valueN> ] } }
			$pull 					{ $pull: { <field1>: <value1|query1>, ... , <fieldN>: <valueN|queryN> } }
			$pushAll 				{ $pushAll: { <field1>: [ <value1>, ... , <valueN> ], ... , <fieldN>: [ <value1>, ... , <valueN> ] } } (deprecated : use $push with $each)
			$push 					{ $push: { <field1>: <value1>, ... , <fieldN>: <valueN> } }

		Modifiers

			$each 					{ $push|$addToSet: { <field>: { $each: [ <value1>, ... , <valueN> ] } } }
				$position 			{ $push: { <field>: { $each: [ <value1>, ... , <valueN> ], $position: <number> } } }
				$slice 				{ $push: { <field>: { $each: [ <value1>, ... , <valueN> ], $slice: <number> } } }
				$sort 				{ $push: { <field>: { $each: [ <value1>, ... , <valueN> ], $sort: <sortSpecification> } } } (sortSpecification : <-1|1> OR { <field>: <-1|1> })

		Bitwise

			$bit 					{ $bit: { <field>: { <and|or|xor>: <int> } } }

		Isolation (at the end of the query)

			$isolated				$isolated : 1


*/