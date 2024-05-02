# Main index

## Reference

```js
db.reference.createIndex(
   { entry: 1 },
   { unique: true, partialFilterExpression: { docType: "entry" } }
)
```

```js
db.reference.createIndex(
   { entry: 1, docType: -1, kreyol: 1 },
   { sparse: true, name: 'search' }
)
```

```js
db.reference.createIndex(
   { variations: 1 },
   { name: 'suggest', partialFilterExpression: { docType: "entry" } }
)
```

```js
db.reference.createIndex(
   { definition_id: 1 },
   { sparse: true, name: 'definition' }
)
```

## Validated

```js
db.validated.createIndex(
   { entry: 1 },
   { unique: true, partialFilterExpression: { docType: "entry" } }
)
```

```js
db.validated.createIndex(
   { entry: 1, docType: -1, kreyol: 1 },
   { sparse: true, name: 'search' }
)
```

```js
db.validated.createIndex(
   { variations: 1 },
   { name: 'suggest', partialFilterExpression: { docType: "entry" } }
)
```

```js
db.validated.createIndex(
   { definition_id: 1 },
   { sparse: true, name: 'definition' }
)
```

## Lexicon

### Lexicons index

```js
db.lexicons.createIndex(
   { entry: 1  },
   { unique: true}
)
```

```js
db.lexicons.createIndex(
   { entry: 1, lexicons: 1 },
   { sparse: true, name: 'search' }
)
```

```js
db.lexicons.createIndex(
   { variations: 1, lexicons: 1 },
   { sparse: true, name: 'suggest'}
)
```
## Proposals

```js
db.proposals.createIndex(
   { entry: 1 },
   { unique: true, partialFilterExpression: { docType: "entry" } }
)
```

```js
db.proposals.createIndex(
   { entry: 1, docType: -1, kreyol: 1 },
   { sparse: true, name: 'search' }
)
```

```js
db.proposals.createIndex(
   { definition_id: 1 },
   { sparse: true, name: 'definition' }
)
```