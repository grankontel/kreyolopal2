import React from 'react'
import PropTypes from 'prop-types'

import { FlagGp } from './FlagGp'
import { FlagMq } from './FlagMq'
import { FlagHt } from './FlagHt'

export const KreyolFlag = ({ kreyol, ...props }) => {
  switch (kreyol) {
    case 'gp':
      return <FlagGp {...props} />

    case 'mq':
      return <FlagMq {...props} />

    case 'ht':
      return <FlagHt {...props} />

    default:
      return <FlagGp {...props} />
  }
}

KreyolFlag.propTypes = {
  kreyol: PropTypes.string.isRequired,
}
