import { Columns, Heading, Hero } from 'react-bulma-components'
import { ImageSet } from '@kreyolopal/web-ui'

export const FrontHero = () => {
  return (
    <Hero color="magnolia" className="index_hero" size="medium">
      <Columns>
        <Columns.Column size="half">
          <Hero.Body>
            <Heading size={1} renderAs="h1">
              Kreyolopal
            </Heading>
            <Heading subtitle renderAs="div">
              Kreyolopal est né de l&apos;envie d&apos;utiliser les technologies
              d&apos;aujourd&apos;hui pour encourager, améliorer et diffuser l&apos;écriture du
              créole.
            </Heading>
          </Hero.Body>
        </Columns.Column>
        <Columns.Column size="half">
          <ImageSet
            className="app_mockup"
            src="/images/black_peoples.jpeg"
            alt="People using the app"
          />
        </Columns.Column>
      </Columns>
    </Hero>
  )
}

export default FrontHero
