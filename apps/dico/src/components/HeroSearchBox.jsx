
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import Downshift from 'downshift'
import debounce from 'lodash.debounce'

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

const HeroSearchBox = () => {
    const [items, setItems] = useState([])
    const router = useRouter()

    const renderItems = (getItemProps, highlightedIndex, selectedItem) => {
        return items.map((item, index) => (
            <li
                className="search__option"
                {...getItemProps({
                    key: item._id,
                    index,
                    item,
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

    return (<Downshift
        onChange={(selection) => {
            if (selection) {
                const next = `/dictionary/gp/${selection.entry}`
                if (location.pathname !== next) router.push(next)
            }
        }}
        itemToString={(item) => (item ? item.entry : '')}
        onInputValueChange={(inputValue) =>
            debounceLoadOptions(inputValue)
        }
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
                    style={{ display: 'inline-block', width: '100%' }}
                    {...getRootProps({}, { suppressRefError: true })}
                >
                    <input
                        className="search__value-input"
                        {...getInputProps()}
                    />
                </div>
                <ul
                    className="search__value-list"
                    {...getMenuProps()}
                    style={{
                        position: 'absolute',
                        zIndex: 90,
                        width: '100%',
                    }}
                >

                    {isOpen
                        ? renderItems(
                            getItemProps,
                            highlightedIndex,
                            selectedItem
                        )
                        : null}
                </ul>
            </div>
        )}
    </Downshift>
    )
}

export default HeroSearchBox