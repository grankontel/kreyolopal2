import * as React from 'react'
import './StarRating.sass'
import * as PropTypes from 'prop-types'

interface onRatedFunc {
  (value: number): void
}
type StarRatingProps = { disabled: boolean, hidden: boolean, value: number, onRated: onRatedFunc }

export const StarRating = ({ disabled, hidden, value, onRated }: StarRatingProps) => {
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
    <div className="star-rating" hidden={hidden}>
      {[...Array(5)].map((star, index) => {
        index += 1
        return (
          <button
            type="button"
            key={index}
            className={index <= (hover || rating) ? 'on' : 'off'}
            onClick={(e) => ratingIsSet(e, index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
            disabled={disabled}
          >
            <span className="star">&#9733;</span>
          </button>
        )
      })}
    </div>
  )
}

StarRating.propTypes = {
  disabled: PropTypes.bool,
  hidden: PropTypes.bool,
  value: PropTypes.number,
  onRated: PropTypes.func,
}

StarRating.defaultProps = {
  value: 0,
}

export default StarRating
