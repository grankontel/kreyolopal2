import { ArrayField, ChipField, Datagrid, List, SingleFieldList, TextField, useRecordContext } from 'react-admin';

const VariationsField = () => {
	const record = useRecordContext();

	return (
		<ul>
			{record.variations.map(item => (
				<li key={item}>{item}</li>
			))}
		</ul>
	)
};

export const WordList = () => (
	<List>
		<Datagrid rowClick="edit">
			<TextField source="id" />
			<TextField source="entry" />
			<VariationsField />

			<ArrayField source="definitions.gp"><SingleFieldList><ChipField source="confer" /></SingleFieldList></ArrayField>
			<TextField source="publishedAt" />
			<TextField source="variations" />
		</Datagrid>
	</List>
);