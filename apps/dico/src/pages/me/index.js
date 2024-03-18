import { Icon, Section, Table } from 'react-bulma-components'
import { KreyolFlag } from '@kreyolopal/web-ui'
import TableCell from '@/components/dictionary/table/TableCell'
import Standard from '@/layouts/Standard'

const words = [
  {
    entry: 'rat',
    definitions: {
      gp: [
        {
          nature: ['nom'],
          meaning: {
            gp: '',
            fr: 'rat.',
          },
          usage: [
            'lèwvwè chat pa la, rat ka bay bal',
            'sé pisa a rat ka ba moun on maladi non a-y sé lèptospiwòz',
          ],
          synonyms: [],
          confer: [],
          quotes: [],
        },
        {
          nature: ['nom'],
          meaning: {
            gp: '',
            fr: 'prostituée.',
          },
          usage: ['anmafwèz,manawa'],
          synonyms: [],
          confer: [],
          quotes: [],
        },
        {
          nature: ['nom'],
          meaning: {
            gp: '',
            fr: 'pensée obsessionnelle.',
          },
          usage: ['ou mété on rat an tèt an-mwen'],
          synonyms: [],
          confer: [],
          quotes: [],
        },
      ],
    },
    variations: ['rat'],
  },
  {
    _id: {
      $oid: '65d12cc39c20b5542990c3e3',
    },
    entry: 'débraké',
    variations: ['débraké', 'débwaké'],
    definitions: {
      gp: [
        {
          nature: ['verbe'],
          meaning: {
            gp: '',
            fr: 'contrebraquer.',
          },
          usage: ['ou braké twòp, débraké tibwen avan  ou kyoulé.'],
          synonyms: [],
          confer: [],
          quotes: [],
        },
      ],

      mq: [
        {
          nature: ['verbe'],
          meaning: {
            gp: '',
            fr: 'contrebraquer.',
          },
          usage: ['ou braké twòp, débraké tibwen avan  ou kyoulé.'],
          synonyms: [],
          confer: [],
          quotes: [],
        },
      ],
    },
  },
]

var funhash = function (s) {
  for (var i = 0, h = 0xdeadbeef; i < s.length; i++)
    h = Math.imul(h ^ s.charCodeAt(i), 2654435761)
  return (h ^ (h >>> 16)) >>> 0
}

const makeId = (entry, langue, index) => {
  const str = [entry, langue, index].join(':')
  return btoa(funhash(str))
}

export default function MePage() {
  const lignes = []
  words.forEach((word) => {
    const defs = Object.entries(word.definitions).map((item) => {
      return { langue: item[0], definitions: item[1] }
    })
    const totalDefs = defs.reduce((nbdefs, item) => nbdefs + item.definitions.length, 0)
    defs.forEach(({ langue, definitions }, langue_index) => {
      definitions.forEach((definition, def_index) => {
        const line_index = langue_index + def_index
        const entry_rowspan = totalDefs === 1 ? 1 : line_index === 0 ? totalDefs : 0
        lignes.push({
          id: makeId(word.entry, langue, line_index),
          entry: word.entry,
          entry_rowspan,
          variations: word.variations,
          langue,
          Flag: <KreyolFlag kreyol={langue} />,
          flag_rowspan:
            definitions.length === 1 ? 1 : def_index === 0 ? definitions.length : 0,
          nature: definition.nature,
          definition_cpf: definition.meaning[langue],
          definition_fr: definition.meaning['fr'],
          usage: definition.usage,
          synonyms: definition.synonyms,
          confer: definition.confer,
        })
      })
    })
  })

  return (
    <Section>
      Me Page
      <Table.Container>
        <Table striped size="fullwidth">
          <thead>
            <tr>
              <th>Entr&eacute;e</th>
              <th>Variations</th>
              <th>Kr&eacute;y&ograve;l</th>
              <th>Nature</th>
              <th>D&eacute;finition</th>
              <th>D&eacute;finition (FR)</th>
              <th>Usage</th>
              <th>Synonyme</th>
              <th>Voir aussi</th>
            </tr>
          </thead>
          <tbody>
            {lignes.map((ligne) => {
              return (
                <tr key={ligne.id}>
                  {ligne.entry_rowspan === 0 ? null : (
                    <td rowSpan={ligne.entry_rowspan}>{ligne.entry}</td>
                  )}
                  {ligne.entry_rowspan === 0 ? null : (
                    <td rowSpan={ligne.entry_rowspan}>
                      {ligne.variations.map((variation) => {
                        return <div key={btoa(funhash(variation))}>{variation}</div>
                      })}
                    </td>
                  )}
                  {ligne.flag_rowspan === 0 ? null : (
                    <td rowSpan={ligne.flag_rowspan}>
                      <Icon alt={ligne.langue}>{ligne.Flag} </Icon>
                    </td>
                  )}
                  <td>{ligne.nature}</td>
                  <td>{ligne.definition_cpf}</td>
                  <td>{ligne.definition_fr}</td>
                  <TableCell
                    entry={ligne.entry}
                    name="usage"
                    value={ligne.usage.map((txt) => (
                      <div key={btoa(funhash(txt))}>{txt}</div>
                    ))}
                    onAdd={(id) => console.log(id)}
                  />
                  <TableCell
                    entry={ligne.entry}
                    name="synonyms"
                    value={ligne.synonyms.map((txt) => (
                      <div  key={btoa(funhash(txt))}>{txt}</div>
                    ))}
                    onAdd={(id) => console.log(id)}
                  />
                  <TableCell
                    entry={ligne.entry}
                    name="confer"
                    value={ligne.confer.map((txt) => (
                      <div>{txt}</div>
                    ))}
                    onAdd={(id) => console.log(id)}
                  />
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <th>Entr&eacute;e</th>
              <th>Variations</th>
              <th>Kr&eacute;y&ograve;l</th>
              <th>Nature</th>
              <th>D&eacute;finition</th>
              <th>D&eacute;finition (FR)</th>
              <th>Usage</th>
              <th>Synonyme</th>
              <th>Voir aussi</th>
            </tr>
          </tfoot>
        </Table>
      </Table.Container>
    </Section>
  )
}

MePage.getLayout = function getLayout(page) {
  return <Standard>{page}</Standard>
}
