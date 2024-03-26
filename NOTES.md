
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
