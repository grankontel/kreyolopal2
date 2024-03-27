
## Entries example

```json
[
  {
    "entry": "chat",
		"docType": "entry",
    "variations": [
      "chat"
    ]
	},
	{
    "entry": "chat",
		"docType": "definition",
		"definition_id": "chat_0",
		"kreyol": "gp",
		"rank": 0,
		"nature": [
			"nom"
		],
		"meaning": {
			"gp": "",
			"fr": "chat, chatte."
		},
		"usage": [
			"makou-chat a vwazin an-mwen toujou ochan dèyè fimèl-chat an-mwen la,"
		],
		"synonyms": [],
		"confer": [],
		"quotes": []
	},
	{
    "entry": "chat",
		"docType": "definition",
		"definition_id": "chat_1",
		"kreyol": "gp",
		"rank": 1,
		"nature": [
			"nom"
		],
		"meaning": {
			"gp": "",
			"fr": "sexe de la petit fille."
		},
		"usage": [
			"pa lésé tifi-la toutouni èvè chat a-y dèwò konsa."
		],
		"synonyms": [],
		"confer": [],
		"quotes": []
	},
	{
    "entry": "chat",
		"docType": "definition",
		"definition_id": "chat_2",
		"kreyol": "mq",
		"rank": 2,
		"nature": [
			"nom"
		],
		"meaning": {
			"gp": "",
			"fr": "biceps."
		},
		"usage": [
			"fè chat a-w monté pou fè vwè si ou ni fòs."
		],
		"synonyms": [],
		"confer": [],
		"quotes": []
	},
	{
    "entry": "kilé",
		"docType": "entry",
    "variations": [
      "kilé",
      "kyilé",
      "kyoulé"
    ]
	},
	{
    "entry": "kilé",
		"docType": "definition",
		"definition_id": "kilé_0",
		"kreyol": "gp",
		"rank": 0,
		"nature": [
			"verbe"
		],
		"meaning": {
			"gp": "",
			"fr": "reculer (s.p., s.f.)."
		},
		"usage": [],
		"synonyms": [],
		"confer": [],
		"quotes": []
	}
]
```

### Main index

```js
db.reference.createIndex(
   { entry: 1 },
   { unique: true, partialFilterExpression: { docType: "entry" } }
)
```

### Search

```
{$and: [{ entry: 'chat', kreyol: 'mq'}]}
```

One documents

```
{$and: [{ entry: 'chat', kreyol: 'mq'}]}
```

Suggestions 

```
filter : {$and: [{ variations: /^kyou/, docType: 'entry'}]}

```

https://v0.dev/t/p4iTLoz5zql


## Table

```
                <TableRow>
                  <TableCell className="font-semibold">Glimmer Lamps</TableCell>
                  <TableCell>Lighting</TableCell>
                  <TableCell>$49.99</TableCell>
                  <TableCell>500 in stock</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Aqua Filters</TableCell>
                  <TableCell>Home Appliances</TableCell>
                  <TableCell>$29.99</TableCell>
                  <TableCell>750 in stock</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Eco Planters</TableCell>
                  <TableCell>Gardening</TableCell>
                  <TableCell>$19.99</TableCell>
                  <TableCell>300 in stock</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Zest Juicers</TableCell>
                  <TableCell>Kitchenware</TableCell>
                  <TableCell>$39.99</TableCell>
                  <TableCell>1000 in stock</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Flexi Wearables</TableCell>
                  <TableCell>Fitness & Health</TableCell>
                  <TableCell>$59.99</TableCell>
                  <TableCell>200 in stock</TableCell>
                </TableRow>
```