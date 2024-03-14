import { useState } from "react"
import { Icon} from "react-bulma-components";
import FeatherIcon from "@/components/FeatherIcon";
import classNames from "classnames";

export default function TableCell({ entry, name, value, onAdd }) {
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
