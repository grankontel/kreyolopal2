import FeatherIcon from '@/components/FeatherIcon'

import {
  Button,
  Container,
  Form,
  Heading,
  Icon,
} from 'react-bulma-components'
import HeroSearchBox from '@/components/HeroSearchBox'

export default function Home() {
  return (
    <Container className="search_hero">
    <div className="w-100">
      <Heading
        textColor="primary"
        colorVariant="light"
        textAlign="center"
      >
        Diksyonnè{' '}
      </Heading>

      <Form.Field className="inner_field" kind="addons">
        <Form.Control fullwidth>
          <HeroSearchBox />
        </Form.Control>
        <Form.Control>
          <Button color="primary" size="medium">
            <Icon>
              <FeatherIcon iconName="search" />
            </Icon>
          </Button>
        </Form.Control>
      </Form.Field>
    </div>
  </Container>
)
}
