import React from 'react'
import * as feather from 'feather-icons'
import { findAllByType } from './FindByType'
import { Icon } from 'react-bulma-components'
import PropTypes from 'prop-types'

const _Item = ({ icon, children }) => {
  return (
    <div className="feature_item">
      <Icon
        size={24}
        color="success"
        dangerouslySetInnerHTML={{
          __html: feather.icons[icon].toSvg({
            height: '1em',
            width: '1em',
          }),
        }}
      />
      {children}
    </div>
  )
}
_Item.componentName = 'FeatureItem'

_Item.propTypes = {
  icon: PropTypes.string.isRequired,
}

export const FeatureList = ({ children }) => {
  const items = findAllByType(children, _Item)

  return (
    <div className="ml-3 is-size-6 has-text-weight-semibold is-family-primary">
      {items.map((item) => item)}
    </div>
  )
}
FeatureList.Item = _Item
