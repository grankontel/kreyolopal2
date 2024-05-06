// mongosh "mongodb+srv://cluster0.llxjy.mongodb.net/zakari"  --username zakari --file ./init.mongodb.js

db.reference.createIndex(
   { entry: 1 },
   { unique: true, partialFilterExpression: { docType: "entry" } }
);


db.reference.createIndex(
   { entry: 1, docType: -1, kreyol: 1 },
   { sparse: true, name: 'search' }
);


db.reference.createIndex(
   { variations: 1 },
   { name: 'suggest', partialFilterExpression: { docType: "entry" } }
);


db.reference.createIndex(
   { definition_id: 1 },
   { sparse: true, name: 'definition' }
);


db.validated.createIndex(
   { entry: 1 },
   { unique: true, partialFilterExpression: { docType: "entry" } }
);


db.validated.createIndex(
   { entry: 1, docType: -1, kreyol: 1 },
   { sparse: true, name: 'search' }
);


db.validated.createIndex(
   { variations: 1 },
   { name: 'suggest', partialFilterExpression: { docType: "entry" } }
);


db.validated.createIndex(
   { definition_id: 1 },
   { sparse: true, name: 'definition' }
);

db.lexicons.createIndex(
   { entry: 1  },
   { unique: true}
);


db.lexicons.createIndex(
   { entry: 1, lexicons: 1 },
   { sparse: true, name: 'search' }
);


db.lexicons.createIndex(
   { variations: 1, lexicons: 1 },
   { sparse: true, name: 'suggest'}
);


db.proposals.createIndex(
   { entry: 1 },
   { unique: true, partialFilterExpression: { docType: "entry" } }
);


db.proposals.createIndex(
   { entry: 1, docType: -1, kreyol: 1 },
   { sparse: true, name: 'search' }
);


db.proposals.createIndex(
   { definition_id: 1 },
   { sparse: true, name: 'definition' }
);
