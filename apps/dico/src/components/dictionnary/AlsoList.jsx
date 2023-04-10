import Link from 'next/link'
import { Heading } from 'react-bulma-components'
import { simpleHash } from '@kreyolopal/web-ui'

const AlsoList = ({also}) => {
    return (<div className="see_also">
        <Heading size={6} renderAs="h3">
            Voir aussi
        </Heading>
        {also.map((example) => (
            <span key={simpleHash(example)}>
                <Link href={`/dictionary/gp/${encodeURI(example)}`}>{example}</Link>
                {ex_index < also.length - 1 ? ', ' : null}

            </span>
        ))}

    </div>
    )
}

export default AlsoList