
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
<Table>
    <DicoTableHeaders />
    <TableBody>
      {lignes.map((ligne) => {
        return (
          <TableRow key={ligne.id}>
            {ligne.entry_rowspan === 0 ? null : (
              <TableCell rowSpan={ligne.entry_rowspan} className='align-top mt-2'>
                {ligne.entry}

              </TableCell>
            )}
            {ligne.entry_rowspan === 0 ? null : (
              <TableCell rowSpan={ligne.entry_rowspan} className='align-top mt-2'>
                {ligne.variations.map((variation) => {
                  return <div key={hashKey('var_', variation)}>{variation}</div>
                })}
              </TableCell>
            )}
            {ligne.flag_rowspan === 0 ? null : (
              <TableCell rowSpan={ligne.flag_rowspan} className='align-top mt-2'>
                <Link href={ligne.url}>
                  {ligne.Flag}
                </Link>
              </TableCell>
            )}
            <TableCell className='align-top mt-2'>{ligne.nature}</TableCell>
            <TableCell>{ligne.definition_cpf}</TableCell>
            <TableCell>{ligne.definition_fr}</TableCell>
            <DicoTableCell
              entry={ligne.definition_key}
              name="usage"
              value={ligne.usage.map((txt) => (
                <div key={hashKey('usage_', txt)}>{txt}</div>
              ))}
              onAdd={(id) => console.log(id)}
            />
            <DicoTableCell
              entry={ligne.definition_key}
              name="synonyms"
              value={ligne.synonyms.map((txt) => (
                <div key={hashKey('syn_', txt)}>{txt}</div>
              ))}
              onAdd={(id) => console.log(id)}
            />
            <DicoTableCell
              entry={ligne.definition_key}
              name="confer"
              value={ligne.confer.map((txt) => (
                <div key={hashKey('confer_', txt)}>{txt}</div>
              ))}
              onAdd={(id) => console.log(id)}
            />
          </TableRow>
        )
      })}
    </TableBody>
  </Table>

```