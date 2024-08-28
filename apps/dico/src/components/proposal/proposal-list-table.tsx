'use client'

import { ProposalListItem } from '@kreyolopal/domain'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'

const defaultData: ProposalListItem[] = [
  {
    upvoters: 2,
    downvoters: 0,
    kreyol: [
      "gp"
    ],
    entry: "pisin"
  }
]

const columnHelper = createColumnHelper<ProposalListItem>()
const columns = [
  columnHelper.accessor('entry', {
    cell: info => <b>{info.getValue()}</b>,
    header: 'Entrée',
  }),
  columnHelper.accessor('kreyol', {
    cell: info => info.getValue().join(', '),
    header: 'kreyol(s)',
  }),
  columnHelper.accessor('upvoters', {
    cell: info => info.getValue(),
    header: 'Pour',
  }),
  columnHelper.accessor('downvoters', {
    cell: info => info.getValue(),
    header: 'Contre',
  })
]

export default function ProposalListTable() {
  const [data, setData] = useState<ProposalListItem[]>([...defaultData])
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

	return (
		<div className="rounded-md border">
		<Table>
			<TableHeader>
				{table.getHeaderGroups().map((headerGroup) => (
					<TableRow key={headerGroup.id}>
						{headerGroup.headers.map((header) => {
							return (
								<TableHead key={header.id}>
									{header.isPlaceholder
										? null
										: flexRender(
											header.column.columnDef.header,
											header.getContext()
										)}
								</TableHead>
							)
						})}
					</TableRow>
				))}
			</TableHeader>
			<TableBody>
				{table.getRowModel().rows?.length ? (
					table.getRowModel().rows.map((row) => (
						<TableRow
							key={row.id}
							data-state={row.getIsSelected() && "selected"}
						>
							{row.getVisibleCells().map((cell) => (
								<TableCell key={cell.id}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</TableCell>
							))}
						</TableRow>
					))
				) : (
					<TableRow>
						<TableCell colSpan={columns.length} className="h-24 text-center">
							No results.
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	</div>

	)
}