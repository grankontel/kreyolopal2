import { Heading } from 'react-bulma-components'
import { simpleHash } from '@kreyolopal/web-ui'

const SynonymList = ({ synonyms }) => {
    return (<div className="synonyms">
        <Heading size={6} renderAs="h3">
            Synonymes
        </Heading>
        {synonyms.map((example) => (
            <div className="synonym" key={simpleHash(example)}>
                {example}
            </div>
        ))}
    </div>
    )
}

export default SynonymList