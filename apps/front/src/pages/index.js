import {
    Button,
    Columns,
    Container,
    Content,
    Heading,
    Hero,
    Section,
  } from 'react-bulma-components';
  import { ImageSet, FeatureList } from '@kreyolopal/web-ui';

export default function Home() {
  return (
    <>
      <Hero color="magnolia" className="index_hero" size="medium">
        <Columns>
          <Columns.Column size="half">
            <Hero.Body>
              <Heading size={1} renderAs="h1">
                Kreyolopal
              </Heading>
              <Heading subtitle renderAs="div">
                Kreyolopal est né de l'envie d'utiliser les technologies
                d'aujourd'hui pour encourager, améliorer et diffuser l'écriture
                du créole.
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
      <Container max breakpoint="desktop">
        <Section>
          <Heading renderAs="h2" size={3}>
            Le correcteur orthographique
          </Heading>
          <Columns>
            <Columns.Column size={4}>
              <ImageSet
                className="app_mockup mx-auto"
                src="images/kreol_app2.png"
                alt="Application mockup"
              />
            </Columns.Column>
            <Columns.Column size={8}>
              <Columns>
                <Columns.Column size="three-quarters">
                  <Content textSize={5} textFamily="secondary">
                    <p>
                      Le correcteur orthographique en ligne repere les erreurs
                      dans la graphie du créole.
                    </p>
                    <p>
                      Il est particulièrement utile pour ceux qui écrivent le
                      créole de façon occasionnelle et veulent éviter les
                      erreurs de graphie grossières.
                    </p>
                    <FeatureList>
                      <FeatureList.Item icon="thumbs-up">
                        Déjà près de 5000 mots de vocabulaire !
                      </FeatureList.Item>
                    </FeatureList>
                  </Content>
                  <Button.Group align="right">
                    <Button
                      mt={4}
                      size="large"
                      color="primary"
                      onClick={() => {
                        navigate('/spellcheck')
                      }}
                    >
                      Essayer
                    </Button>
                  </Button.Group>
                </Columns.Column>
              </Columns>
            </Columns.Column>
          </Columns>
        </Section>
      </Container>
    </>
  )
}
