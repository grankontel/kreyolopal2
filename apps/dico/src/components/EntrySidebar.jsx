import Link from 'next/link'
import { Heading } from 'react-bulma-components'
import { simpleHash } from '@kreyolopal/web-ui'

const EntrySidebar = ({ words }) => {
    return (
        <sidebar className='entry-sidebar'>
            <Heading size={4} renderAs="h3" color="secondary">
                Voir aussi
            </Heading>
            <ul className='also-list'>
                {words.map((rel) => {
                    return (<li key={simpleHash(rel)} className='also-listitem'>
                        <Link href={`/dictionary/gp/${encodeURI(rel)}`}>{rel}</Link>
                    </li>)

                })}
            </ul>
        </sidebar>

    )
}

export default EntrySidebar