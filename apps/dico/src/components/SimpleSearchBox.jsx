import { useEffect, useMemo, useState } from 'react'
import { Form } from 'react-bulma-components'
import Downshift from 'downshift'
import debounce from 'lodash/debounce'
import { useLocation, useNavigate } from 'react-router-dom'

const getEntries = (w) => {
  const word = w.trim()
  if (word.length === 0) return Promise.resolve([])

  return fetch(`/api/dictionary/suggest/${encodeURIComponent(word)}`, {
    method: 'GET',
    credentials: 'same-origin',
  })
    .then(
      async (result) => {
        if (!result.ok) {
          return []
        }

        return result.json()
      },
      (reason) => {
        console.log(reason)
        return []
      }
    )
    .catch((er) => {
      console.log(er)
      return []
    })
}

export function SimpleSearchBox(props) {
  const [items, setItems] = useState([])
  const location = useLocation()
  const navigate = useNavigate()

  const renderItems = (getItemProps, highlightedIndex, selectedItem) => {
    return items.map((item, index) => (
      <li
        className="search__option"
        {...getItemProps({
          key: item._id,
          index,
          item,
          style: {
            backgroundColor: highlightedIndex === index ? 'lightgray' : 'white',
            fontWeight: selectedItem === item ? 'bold' : 'normal',
          },
        })}
      >
        {item.variations.join('/')}
      </li>
    ))
  }

  const loadOptions = async (inputValue) => {
    const rep = await getEntries(inputValue)

    setItems(rep)
  }

  const debounceLoadOptions = useMemo(() => debounce(loadOptions, 300), [])

  useEffect(() => {
    return () => {
      debounceLoadOptions.cancel()
    }
  })

  return (
    <Form.Control>
      <Downshift
        onChange={(selection) => {
          if (selection) {
            const next = `/dictionary/gp/${selection.entry}`
            if (location.pathname !== next) navigate(next)
          }
        }}
        itemToString={(item) => (item ? item.entry : '')}
        onInputValueChange={(inputValue) => debounceLoadOptions(inputValue)}
      >
        {({
          getInputProps,
          getItemProps,
          getLabelProps,
          getMenuProps,
          isOpen,
          inputValue,
          highlightedIndex,
          selectedItem,
          getRootProps,
        }) => (
          <div className="wabap_searchbox">
            <div
              style={{ display: 'inline-block' }}
              {...getRootProps({}, { suppressRefError: true })}
            >
              <input className="search__value-input" {...getInputProps()} />
            </div>
            <ul
              className="search__value-list"
              {...getMenuProps()}
              style={{
                position: 'absolute',
                zIndex: 90,
              }}
            >
              {isOpen
                ? renderItems(getItemProps, highlightedIndex, selectedItem)
                : null}
            </ul>
          </div>
        )}
      </Downshift>
      {/*       <Downshift
        onChange={(selection) =>
          alert(
            selection ? `You selected ${selection.entry}` : 'Selection Cleared'
          )
        }
        itemToString={(item) => (item ? item.entry : '')}
      >
        {({
          getInputProps,
          getItemProps,
          getLabelProps,
          getMenuProps,
          isOpen,
          inputValue,
          highlightedIndex,
          selectedItem,
          getRootProps,
        }) => (
          <div className="wabap_searchbox">
            <div
              style={{ display: 'inline-block' }}
              {...getRootProps({}, { suppressRefError: true })}
            >
              <input className="search__value-input" {...getInputProps()} />
            </div>
            <ul
              className="search__value-list"
              {...getMenuProps()}
              style={{
                position: 'absolute',
                zIndex: 90,
              }}
            >
              {isOpen
                ? renderItems(getItemProps, highlightedIndex, selectedItem)
                : null}
            </ul>
          </div>
        )}        
      </Downshift>
 */}{' '}
    </Form.Control>
  )
}
export default SimpleSearchBox
