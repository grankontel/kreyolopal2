import { useState } from "react"
import { Icon, Section, Table } from "react-bulma-components";
import { FlagGp } from '@kreyolopal/web-ui'
import FeatherIcon from "@/components/FeatherIcon";
import classNames from "classnames";

/*
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

function TableCell({ entry, name, value, onAdd }) {
  const [isCellHover, setCellHover] = useState(false)
  const cellClassName = `dico-${name}-add-button`
  const cellClass = classNames({
    [cellClassName]: true,
    'dico-add-button': true,
    'line-hidden': !isCellHover
  })

  return (
    <td onMouseEnter={() => setCellHover(true)} onMouseLeave={() => setCellHover(false)}>
      {value}
      <Icon className={cellClass} onClick={() => onAdd(entry)}>
        <FeatherIcon iconName="plus-square" />
      </Icon>
    </td>
  )
}

export default function MePage() {
  const [isUsageHover, setUsageHover] = useState(false)
  const usageClass = classNames({
    'entry-add-button': true,
    'line-hidden': !isUsageHover
  })

  return (
    <Section>
      Me Page

      <Table size="fullwidth">
        <thead>
          <tr>
            <th>
              Entr&eacute;e
            </th>
            <th>
              Kr&eacute;y&ograve;l
            </th>
            <th>
              Variations
            </th>
            <th>
              Nature
            </th>
            <th>
              D&eacute;finition
            </th>
            <th>
              D&eacute;finition (FR)
            </th>
            <th>
              Usage
            </th>
            <th>
              Synonyme
            </th>
            <th>
              Voir aussi
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              d&eacute;brak&eacute;
            </td>
            <td>
              <Icon>
                <FlagGp />
              </Icon>
            </td>
            <td>
              <div>
                d&eacute;brak&eacute;
              </div>
              <div>
                d&eacute;bwak&eacute;
              </div>
            </td>
            <td>
              Vèwb
            </td>
            <td>

            </td>
            <td>
              contrebraquer.
            </td>
            <TableCell entry={"débraké"} 
              name="usage" 
              value={<div>ou braké twòp, débraké tibwen avan  ou kyoulé.</div>} 
              onAdd={(id) => console.log(id)} />
            <TableCell entry={"débraké"} 
              name="synonyms" 
              value={<div></div>} 
              onAdd={(id) => console.log(id)} />
          </tr>
        </tbody>
      </Table>
    </Section>
  )
}