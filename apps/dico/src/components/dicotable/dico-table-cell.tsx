import { useState } from 'react'
import FeatherIcon from '@/components/FeatherIcon'
import classNames from 'classnames'

interface DicoTableCellProps<T> {
  entry: T
  name: string
  value: React.ReactNode
  className?: string
  onAdd: (item: T) => void
}

export default function DicoTableCell<T>({
  entry,
  name,
  value,
  onAdd,
  className = '',
}: DicoTableCellProps<T>) {
  const [isCellHover, setCellHover] = useState(false)
  const cellClassName = `dico-${name}-add-button`
  const cellClass = classNames({
    [cellClassName]: true,
    'cursor-pointer': true,
    invisible: !isCellHover,
  })

  return (
    <td className={className} onMouseEnter={() => setCellHover(true)} onMouseLeave={() => setCellHover(false)}>
      {value}
      <span className={cellClass} onClick={() => onAdd(entry)}>
        <FeatherIcon iconName="plus-square" />
      </span>
    </td>
  )
}
