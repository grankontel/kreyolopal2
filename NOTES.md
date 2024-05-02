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

### Proposals

- [X] finish add definition form in proposal
- [X] handle proposal creation
- [X] improve proposal page verifications
- [X] updtate WordRepository class
- [X] upvote definition
- [X] downvote definition
- [X] validate proposal
- [X] validate proposal button

### Profile

- [ ] change password

### Stack

- [ ] switch logger to pino (https://github.com/pinojs/pino)
- [ ] migrate to Drizzle (https://drizzle.dev/docs/getting-started/installation)
- [ ] install drizzle eslint
- [ ] migrate to Neon (https://neon.tech/pricing)
- [ ] migrate to Cloud Atlas
- [ ] migrate to Hono/Cloudflare

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

### Entry

```json
    {
      "_id": {
        "$oid": "660ec7442d20dcfa8e764859"
      },
      "entry": "chat",
      "docType": "definition",
      "variations": [
        "chat"
      ],
      "def_ids": [
        "chat_0"
      ],
      "lexicons": [
        "82da1d84-be7e-4c68-a7cb-cadb47c34eba"
      ]
    }
```

### Aggregate

```js
import { MongoClient } from 'mongodb';

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
  {
    '$match': {
      'entry': 'chat', 
      'lexicons': '82da1d84-be7e-4c68-a7cb-cadb47c34eba'
    }
  }, {
    '$lookup': {
      'from': 'reference', 
      'let': {
        'defi': '$def_ids'
      }, 
      'pipeline': [
        {
          '$match': {
            'docType': 'definition', 
						'kreyol': 'gp',
            '$expr': {
              '$in': [
                '$definition_id', '$$defi'
              ]
            }
          }
        }
      ], 
      'as': 'ref_definitions'
    }
  }, {
    '$lookup': {
      'from': 'validated', 
      'let': {
        'defi': '$def_ids'
      }, 
      'pipeline': [
        {
          '$match': {
            'docType': 'definition', 
						'kreyol': 'gp',
            '$expr': {
              '$in': [
                '$definition_id', '$$defi'
              ]
            }
          }
        }
      ], 
      'as': 'val_definitions'
    }
  }, {
    '$project': {
      'entry': 1, 
      'variations': 1, 
      'definitions': {
        '$concatArrays': [
          '$ref_definitions', '$val_definitions'
        ]
      }
    }
  }
];

const client = await MongoClient.connect(
  'mongodb://zakari:Chuq3m9%26hatlD8O%40@localhost:27017/zakari?authMechanism=DEFAULT',
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const coll = client.db('zakari').collection('lexicons');
const cursor = coll.aggregate(agg);
const result = await cursor.toArray();
await client.close();
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

