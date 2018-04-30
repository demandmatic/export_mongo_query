var mongodb = require('mongodb');
var es = require('event-stream');

const config = {
	db: {
		url: 'mongodb://localhost:27017/',
		name: 'prod',
	},
	fileName: 'out.csv'
}

mongodb.MongoClient.connect(config.db.url, function (err, db) {
	if (err) throw err;
	let getParams = {
		collection: 'entries',
		cond: {},
		selected: {
			'email': 1,
			'name': 1,
			'score': 1
		}
	}
	doExport(db, getParams)
});

let doExport = (db, getParams) => {
	var dbo = db.db(config.db.name);
	let stream = dbo.collection(getParams.collection, { readPreference: 'secondaryPreferred' }).find(getParams.cond, getParams.selected).stream()

	stream
		.pipe(es.map(function (doc, next) {
			// TODO: add function to export
			next(null, doc);
		}))
		.on('close', function () {
			db.close();
		});
}
