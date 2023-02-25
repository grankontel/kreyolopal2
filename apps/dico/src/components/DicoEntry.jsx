import { Heading } from 'react-bulma-components'

const DicoEntry = ({ item, ...rest }) => {
    return (
        <article className="dico_word" {...rest}>
            <Heading size={4} renderAs="h2">
                {item.entry}
            </Heading>
            {item.definitions.map((def, index) => {
                const nature = def.nature.join(', ')
                return (
                    <div key={index} className="definition">
                        <div className="nature">{nature}</div>
                        <div className="translations">
                            <div className="translation translation_gp">
                                {def.meaning['gp']}
                            </div>
                            <div className="translation translation_fr">
                                {def.meaning['fr']}
                            </div>
                        </div>
                        {def.usage.length > 0 ? (
                            <div className="usage">
                                {def.usage.map((example, ex_index) =>
                                    example !== null ? (
                                        <div className="example " key={ex_index}>
                                            {example}
                                        </div>
                                    ) : null
                                )}
                            </div>
                        ) : null}

                        {def.synonyms.length > 0 ? (
                            <div className="synonyms">
                                <Heading size={6} renderAs="h3">
                                    Voir aussi
                                </Heading>
                                {def.synonyms.map((example, ex_index) => (
                                    <div className="synonym" key={ex_index}>
                                        {example}
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>
                )
            })}
        </article>

    )
}

export default DicoEntry