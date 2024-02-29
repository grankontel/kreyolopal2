import { Container } from 'react-bulma-components'
import { FeatureList } from '@kreyolopal/web-ui'
import FrontHero from '@/components/FrontHero'
import HomeSection from '@/components/HomeSection'

export default function Home() {
  return (
    <>
      <FrontHero />
      <Container max breakpoint="fullhd">
        <HomeSection
          title="Le dictionnaire"
          illustration={{
            src: 'images/kreyolopal-dico.png',
            alt: 'Dictionnaire mockup',
          }}
          destination={{
            url: process.env.NEXT_PUBLIC_DICO_URL,
            text: 'Essayer',
          }}
        >
          <p>
            La nouvelle édition du dictionnaire Créole-Français revue et
            corrigée par Hector Poullet.
          </p>
          <p>
            Il est particulièrement utile pour ceux qui écrivent le créole de
            façon occasionnelle et veulent éviter les erreurs de graphie
            grossières.
          </p>
          <FeatureList>
            <FeatureList.Item icon="edit-3">
              Entièrement revu !
            </FeatureList.Item>
            <FeatureList.Item icon="trending-up">
              Définitions, synonymes, phrases d&apos;usage...
            </FeatureList.Item>
            <FeatureList.Item icon="thumbs-up">
              Près de 10 000 entrées.
            </FeatureList.Item>
          </FeatureList>
        </HomeSection>
        <HomeSection
          title="Le correcteur orthographique"
          illustration={{
            src: 'images/kreol_app2.png',
            alt: 'Application mockup',
          }}
          destination={{
            url: `${process.env.NEXT_PUBLIC_DICO_URL}/spellcheck`,
            text: 'Essayer',
          }}
        >
          <p>
            Le correcteur orthographique en ligne repere les erreurs dans la
            graphie du créole.
          </p>
          <p>
            Il est particulièrement utile pour ceux qui écrivent le créole de
            façon occasionnelle et veulent éviter les erreurs de graphie
            grossières.
          </p>
          <FeatureList>
            <FeatureList.Item icon="thumbs-up">
              Déjà près de 5000 mots de vocabulaire !
            </FeatureList.Item>
          </FeatureList>
        </HomeSection>
      </Container>
    </>
  )
}
