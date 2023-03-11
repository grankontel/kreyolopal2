import { Heading } from 'react-bulma-components'

const SynonymList = ({ synonyms }) => {
    return (<div className="synonyms">
        <Heading size={6} renderAs="h3">
            Synonymes
        </Heading>
        {synonyms.map((example, ex_index) => (
            <div className="synonym" key={ex_index}>
                {example}
            </div>
        ))}
    </div>
    )
}

export default SynonymList