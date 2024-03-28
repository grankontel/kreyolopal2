import * as React from 'react'
import * as PropTypes from 'prop-types'
import styled from '@emotion/styled'

interface onRatedFunc {
  (value: number): void
}
type StarRatingProps = { disabled?: boolean, hidden: boolean, value?: number, onRated?: onRatedFunc }

const SRDiv = styled.div`
.on {
color: #ffc107;
}
.off {
color: #ccc;
}
`

const SRButton = styled.button`
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 1px 2px;
  &:disabled {
    cursor: not-allowed;
  }
`

export const StarRating = ({ disabled = false, hidden, value = 0, onRated }: StarRatingProps) => {
  const initialValue = Math.min(Math.max(value || 0, 0), 5)
  const [rating, setRating] = React.useState(initialValue)
  const [hover, setHover] = React.useState(0)

  const ratingIsSet = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
    e.preventDefault()
    setRating(index)
    if (onRated !== undefined) {
      onRated(index)
    }
  }

  return (
    <SRDiv className="star-rating" hidden={hidden}>
      {[...Array(5)].map((star, index) => {
        index += 1
        return (
          <SRButton
            type="button"
            key={index}
            className={index <= (hover || rating) ? 'on' : 'off'}
            onClick={(e) => ratingIsSet(e, index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
            disabled={disabled}
          >
            <span className="star">&#9733;</span>
          </SRButton>
        )
      })}
    </SRDiv>
  )
}

StarRating.propTypes = {
  disabled: PropTypes.bool,
  hidden: PropTypes.bool,
  value: PropTypes.number,
  onRated: PropTypes.func,
}

export default StarRating
