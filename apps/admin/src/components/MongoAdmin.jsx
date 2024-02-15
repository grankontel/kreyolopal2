import { Admin, EditGuesser, ListGuesser, Resource, fetchUtils } from "react-admin";
import { dataProvider } from "ra-data-simple-prisma";
import {WordList} from '@/components/mongo/WordList'

const MongoAdmin = () => {
	return (
		<Admin dataProvider={dataProvider("/api/prisma")}>
			<Resource name="words" list={WordList}
				edit={EditGuesser}
				recordRepresentation="entry"
			/>

		</Admin>
	);
};

export default MongoAdmin;