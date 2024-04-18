import * as React from "react"
import * as PropTypes from 'prop-types'

import { FlagGp } from './FlagGp'
import { FlagMq } from './FlagMq'
import { FlagHt } from './FlagHt'
import { FlagDm } from "./FlagDm"
import { MeaningLanguage } from "@kreyolopal/domain"
import { FlagFr } from "./FlagFr"

interface LangFlagProps extends React.SVGAttributes<SVGSVGElement> {
  langue: MeaningLanguage
}

export const LangFlag = (props: LangFlagProps) => {
  const { langue } = props

  switch (langue) {
    case 'gp':
      return <FlagGp {...props} />

    case 'mq':
      return <FlagMq {...props} />

    case 'ht':
      return <FlagHt {...props} />

    case 'dm':
      return <FlagDm {...props} />

    case 'fr':
      return <FlagFr {...props} />

    default:
      return <FlagGp {...props} />
  }
}

LangFlag.propTypes = {
  langue: PropTypes.string.isRequired,
}
