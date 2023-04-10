import { Heading } from 'react-bulma-components'
import AlsoList from './dictionnary/AlsoList'
import SynonymList from './dictionnary/SynonymList'
import Tranlations from './dictionnary/Translations'
import VariationList from './dictionnary/VariationList'
import UsageList from './dictionnary/UsageList'

const DicoEntry = ({ item, kreyol, ...rest }) => {
    const nb_definitions = item.definitions.length

    return (
        <article className="dico_word" {...rest}>
            <Heading size={3} renderAs="h2">
                {item.entry}
            </Heading>
            {item.variations.length > 1 ? (
                <VariationList variations={item.variations} />
            ) : null}
            {item.definitions.map((def, index) => {
                const nature = def.nature.join(', ')
                return (
                    <div key={index} className="definition">
                        <div className="nature">
                            {nb_definitions > 1 ? (`${index + 1}. `) : null}
                            {def.subnature?.length ? def.subnature.join(', ') : nature}
                        </div>
                        <Tranlations meanings={def.meaning} />
                        {def.usage.length > 0 ? (
                            <UsageList usages={def.usage} />
                        ) : null}

                        {def.synonyms.length > 0 ? (
                            <SynonymList synonyms={def.synonyms} />
                        ) : null}

                        {def.confer.length > 0 ? (
                            <AlsoList also={def.confer} />
                        ) : null}

                    </div>
                )
            })}
        </article>

    )
}

export default DicoEntry