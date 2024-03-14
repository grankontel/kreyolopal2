import { useState } from 'react'
import { Heading, Icon } from 'react-bulma-components'
import AlsoList from './dictionary/AlsoList'
import SynonymList from './dictionary/SynonymList'
import Tranlations from './dictionary/Translations'
import VariationList from './dictionary/VariationList'
import UsageList from './dictionary/UsageList'
import FeatherIcon from './FeatherIcon'
import { useAuth } from '@kreyolopal/web-ui'
import classNames from 'classnames'

const DicoEntry = ({ item, kreyol, is_bookmarked, ...rest }) => {
  const [isBookmarked, setBookmarked] = useState(is_bookmarked)
  const auth = useAuth()?.session

  const nb_definitions = item.definitions.length
  const btnBookmarkClasses = classNames({
    'dico-add-button': true,
    'is-disabled': (auth === null)
  })

  const addBookmark = async (e) => {
    e.preventDefault()
    if (!auth) return false;

    const token = auth?.session_id

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
        {(!isBookmarked) ? (<Icon className={btnBookmarkClasses} onClick={addBookmark}>
          <FeatherIcon iconName="plus-square" data-tooltip={(auth ? `Ajouté mo-la adan lèksik a-w` : `Konekté-w pou pé ajouté mo-lasa an lèksik a-w.`)}
          />
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