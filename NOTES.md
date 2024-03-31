## TODO

https://v0.dev/t/RpImR1PAsTR

How to add a word in my personal dictionary

Bookmark copy entry + definitions to personal (from reference or validate)

Specific env for proposals

use mongo transactions 
https://www.mongodb.com/docs/manual/core/transactions/

check for existing entry update if necessary
add definition

Validate 
A new post, based on prior information
owner and backers are kept

entry is then removed from proposal
users are notified ?
rabbitmq ?


## Lexicon entry

```json
{
    "name": "Woulo",
    "description": "Lexique créole des mots du sport",
    "slug": "lexique-1",
    "owner":  "0h5lft4cjknfei3",
    "is_private": false
}
```

## Proposal entry

```json
{
    "entry": "pit",
    "creator":  "0h5lft4cjknfei3",
    "docType": "definition",
    "definition_id": "pit_0",
    "kreyol": "gp",
    "rank": 0,
    "nature": [
      "adjectif"
    ],
    "meaning": {
      "gp": "",
      "fr": "nul, mauvais"
    },
    "usage": [
      "yenki blag pit i sa rakonté",
      "an ay adan on swaré, sa té pit !"
    ],
    "synonyms": [],
    "confer": [],
    "quotes": [],
    "backers": [
      {
        "user_id": "0h5lft4cjknfei3",
        "birthdate": ""
      }
    ]
}
```


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

### Search

```
{$and: [{ entry: 'chat', kreyol: 'mq'}]}
```

One documents

```
{$and: [{entry: 'poul'},{$or: [{docType: 'entry'}, {docType: 'definition', kreyol: 'gp'}]}]}
{$and: [{ entry: 'chat', kreyol: 'mq'}]}
```

Suggestions 

```
filter : {$and: [{ variations: /^kyou/, docType: 'entry'}]}

```

https://v0.dev/t/p4iTLoz5zql

