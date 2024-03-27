import MainPanel from '@/components/dashboard/main-panel'
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from '@/components/ui/card'
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from '@/components/ui/table'
import { DictionaryFullEntry } from '@/lib/types'
import { makeId } from '@/lib/utils'
import { KreyolFlag, KreyolLanguage } from '@kreyolopal/react-ui'
import { JSX, useState } from 'react'


const TableHeaders = () => (
  <TableHeader>
    <TableHead className="w-[150px]">Entr&eacute;e</TableHead>
    <TableHead className="w-[150px]">Variations</TableHead>
    <TableHead className="w-[150px]">Kr&eacute;y&ograve;l</TableHead>
    <TableHead className="w-[150px]">Nature</TableHead>
    <TableHead className="w-[150px]">D&eacute;finition</TableHead>
    <TableHead className="w-[150px]">D&eacute;finition (FR)</TableHead>
    <TableHead className="w-[150px]">Usage</TableHead>
    <TableHead className="w-[150px]">Synonyme</TableHead>
    <TableHead className="w-[150px]">Voir&nbsp;aussi</TableHead>
  </TableHeader>
)

const data = [
  {
    "id": "65fae48184a6e7c923251f8d",
    "entry": "abominasyon",
    "variations": [
      "abominasyon"
    ],
    "definitions": {
      "gp": [
        {
          "nature": [
            "nom"
          ],
          "meaning": {
            "gp": "",
            "fr": "chose abominable."
          },
          "usage": [
            "apré siklòn-la, fo ou té vwè sa, sa té on abominasyon."
          ],
          "synonyms": [],
          "confer": [],
          "quotes": []
        }
      ]
    }
  },
  {
    "id": "65fbeadcd766865cdea535ba",
    "entry": "kabanné",
    "variations": [
      "kabanné"
    ],
    "definitions": {
      "gp": [
        {
          "nature": [
            "verbe"
          ],
          "meaning": {
            "gp": "",
            "fr": "faséyer, ne plus prendre le vent."
          },
          "usage": [],
          "synonyms": [],
          "confer": [],
          "quotes": []
        },
        {
          "nature": [
            "adjectif"
          ],
          "meaning": {
            "gp": "",
            "fr": "état d'une mangue qui a murit dans un chiffon pour qu'elle devienne plus veloutée, plus moelleuses."
          },
          "usage": [],
          "synonyms": [],
          "confer": [],
          "quotes": []
        }
      ]
    }
  }
]

type WordRow = {
  id: string;
  definition_key: {
    entry: string;
    kreyol: KreyolLanguage;
    definition_rank: number
  };
  entry: string;
  entry_rowspan: number;
  variations: string[];
  langue: KreyolLanguage;
  Flag: JSX.Element;
  flag_rowspan: number;
  nature: string[];
  definition_cpf: string | undefined;
  definition_fr: string | undefined;
  usage: string[];
  synonyms: string[];
  confer: string[]
}


function wordsToRow(words: DictionaryFullEntry[]): WordRow[] {
  const lignes: WordRow[] = []
  words.forEach((word) => {
    const defs = Object.entries(word.definitions).map((item) => {
      return { langue: item[0] as KreyolLanguage, definitions: item[1] }
    })
    const totalDefs = defs.reduce((nbdefs, item) => nbdefs + item.definitions.length, 0)
    defs.forEach(({ langue, definitions }, langue_index) => {
      definitions.forEach((definition, def_index) => {
        const line_index = langue_index + def_index
        const entry_rowspan = totalDefs === 1 ? 1 : line_index === 0 ? totalDefs : 0
        lignes.push({
          id: makeId(word.entry, langue, line_index),
          definition_key: {
            entry: word.entry,
            kreyol: langue,
            definition_rank: def_index,
          },
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
  return lignes
}
export default function Home() {
  const [words, setWords] = useState(data)

  return (
    <MainPanel title="Produits">
      <Card>
        <CardHeader>
          <CardTitle>Product Overview</CardTitle>
          <CardDescription>
            View and manage all your products from a single place
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-auto w-full">
            <Table>
              <TableHeaders />
              <TableBody>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </MainPanel>
  )
}
