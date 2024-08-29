'use client'

import { MeaningLanguage, ProposalListItem } from '@kreyolopal/domain'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getPaginationRowModel,
} from '@tanstack/react-table'
import { useState, useMemo } from 'react'
import { useQuery } from "@tanstack/react-query";
import { useDashboard } from '@/components/dashboard/dashboard-provider'
import { listProposals } from '@/queries/proposals/list-proposal'
import { ResponseError } from '@/lib/types'
import { LangFlag } from '@kreyolopal/react-ui'

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
		cell: info => info.getValue().map(langue => <LangFlag key={langue} langue={langue as MeaningLanguage} width="24" height="12" />),
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
	//  const [data, setData] = useState<ProposalListItem[]>([...defaultData])
	const dash = useDashboard()
	const { data: serverData } = useQuery<
		unknown,
		ResponseError,
		ProposalListItem[],
		string[]
	>({
		queryKey: ["proposals"],
		queryFn: async () => {
			const token: string = dash?.session_id || ''
			return await listProposals(token)
		},
	});

	const data = useMemo<ProposalListItem[]>(() => serverData ?? [], [serverData]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	})

	return (
		<div className='px-4'>
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
			<div className="flex items-center justify-end space-x-2 py-4">
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Next
				</Button>
			</div>
		</div>
	)
}