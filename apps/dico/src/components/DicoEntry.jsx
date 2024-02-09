import { useState } from 'react'
import { Heading, Icon } from 'react-bulma-components'
import AlsoList from './dictionnary/AlsoList'
import SynonymList from './dictionnary/SynonymList'
import Tranlations from './dictionnary/Translations'
import VariationList from './dictionnary/VariationList'
import UsageList from './dictionnary/UsageList'
import FeatherIcon from './FeatherIcon'

const DicoEntry = ({ item, kreyol, is_bookmarked, ...rest }) => {
    const [isBookmarked, setBookmarked] = useState(is_bookmarked)
    const auth = useAuth()

    const nb_definitions = item.definitions.length
    // const { getToken } = useAuth()

    const addBookmark = async (e) => {
        e.preventDefault()
        const token = await getToken()

        const myHeaders = {
            'Content-Type': 'application/json',
        }
        if (token) myHeaders['Authorization'] = `Bearer ${token}`
        return fetch(`/api/me/dictionary/${encodeURIComponent(item.entry)}`, {
            method: 'PUT',
            headers: myHeaders,
        }).then(
            async (result) => {
                if (result.ok) {
                    setBookmarked(true)
                    return true
                }

                return false
            },
            (reason) => {
                console.log(reason)
                return false
            }
        )
            .catch((er) => {
                console.log(er)
                return false
            })
    }
    return (
        <article className="dico_word" {...rest}>
            <div className='is-flex button-addword'>
                {(auth && !isBookmarked) ? (<Icon className='dico-add-button' onClick={addBookmark}>
                    <FeatherIcon iconName="plus-square" />
                </Icon>
                ) : null}
                <Heading size={3} renderAs="h2" className='inline-flex' >
                    {item.entry}
                </Heading>

            </div>
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