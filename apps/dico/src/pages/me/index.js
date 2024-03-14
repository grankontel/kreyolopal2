import { Icon, Section, Table } from 'react-bulma-components'
import { FlagGp } from '@kreyolopal/web-ui'
import TableCell from '@/components/dictionary/table/TableCell'

/*
{
"user_id": "user_2a81lkpE2baBqFSNEKPfTv8yZyW",
"birth_date" : 

"words": [
{  "entry": "braké",
  "variations": [
    "braké",
    "bwaké"
  ],
  "definitions": {
    "gp": [
      {
        "nature": [
          "verbe"
        ],
        "meaning": {
          "gp": "",
          "fr": "braquer."
        },
        "usage": [
          "zépòl a Jennvyèv ka fè-y mal, i pa néta braké gidon a loto-la."
        ],
        "synonyms": [],
        "confer": [],
        "quotes": []
      },
      {
        "nature": [
          "nom"
        ],
        "meaning": {
          "gp": "",
          "fr": "maniére de frapper en cadence avec deux baguettes sur le bord d'un tambour."
        },
        "usage": [
          "ni moun ka ba-w on bèl koul boula, ni osi  lésèz yo ka ba-w on bèl braké."
        ],
        "synonyms": [],
        "confer": [],
        "quotes": []
      }
    ]
  }
}  
]
}

entry
variations
definition_no
nature
definition_fr
usage
synonyme
confere

  {
    "entry": "débraké",
    "variations": [
      "débraké",
      "débwaké"
    ],
    "definitions": {
      "gp": [
        {
          "nature": [
            "verbe"
          ],
          "meaning": {
            "gp": "",
            "fr": "contrebraquer."
          },
          "usage": [
            "ou braké twòp, débraké tibwen avan  ou kyoulé."
          ],
          "synonyms": [],
          "confer": [],
          "quotes": []
        }
      ]
    }
  },
*/

export default function MePage() {
  return (
    <Section>
      Me Page
      <Table size="fullwidth">
        <thead>
          <tr>
            <th>Entr&eacute;e</th>
            <th>Kr&eacute;y&ograve;l</th>
            <th>Variations</th>
            <th>Nature</th>
            <th>D&eacute;finition</th>
            <th>D&eacute;finition (FR)</th>
            <th>Usage</th>
            <th>Synonyme</th>
            <th>Voir aussi</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>d&eacute;brak&eacute;</td>
            <td>
              <Icon>
                <FlagGp />
              </Icon>
            </td>
            <td>
              <div>d&eacute;brak&eacute;</div>
              <div>d&eacute;bwak&eacute;</div>
            </td>
            <td>Vèwb</td>
            <td></td>
            <td>contrebraquer.</td>
            <TableCell
              entry={'débraké'}
              name="usage"
              value={<div>ou braké twòp, débraké tibwen avan ou kyoulé.</div>}
              onAdd={(id) => console.log(id)}
            />
            <TableCell
              entry={'débraké'}
              name="synonyms"
              value={<div></div>}
              onAdd={(id) => console.log(id)}
            />
          </tr>
        </tbody>
      </Table>
    </Section>
  )
}
