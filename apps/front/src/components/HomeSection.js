import { useRouter } from 'next/navigation'
import {
  Button,
  Columns,
  Content,
  Heading,
  Section,
} from 'react-bulma-components'
import { ImageSet } from '@kreyolopal/web-ui'
import PropTypes from 'prop-types'

const ImageColumn = ({ illustration }) => {
  return (
    <Columns.Column size={4}>
      <ImageSet
        className="app_mockup mx-auto"
        src={illustration.src}
        alt={illustration.alt}
      />
    </Columns.Column>
  )
}

const TextColumn = ({ body, destination }) => {
  const router = useRouter()

  return (
    <Columns.Column size={8}>
      <Columns>
        <Columns.Column size="three-quarters">
          <Content textSize={5} textFamily="secondary">
            {body}
          </Content>
          <Button.Group align="right">
            <Button
              mt={4}
              size="large"
              color="primary"
              onClick={() => {
                router.push(destination.url)
              }}
            >
              {destination.text}
            </Button>
          </Button.Group>
        </Columns.Column>
      </Columns>
    </Columns.Column>
  )
}
export const HomeSection = ({
  title,
  illustration,
  destination,
  orientation,
  children,
}) => {

  return (
    <Section>
      <Heading renderAs="h2" size={3}>
        {title}
      </Heading>
      <Columns>
        {orientation === 'left' ? (
          <>
            <ImageColumn illustration={illustration} />
            <TextColumn body={children} destination={destination} />
          </>
        ) : (
          <>
            <TextColumn body={children} destination={destination} />
            <ImageColumn illustration={illustration} />
          </>
        )}
      </Columns>
    </Section>
  )
}

HomeSection.propTypes = {
  title: PropTypes.string.isRequired,
  illustration: PropTypes.shape({
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
  }).isRequired,
  destination: PropTypes.shape({
    url: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }),
  orientation: PropTypes.oneOf(['right', 'left']),
}

HomeSection.defaultProps = {
  orientation: 'left',
}

export default HomeSection
