import { useRouter } from 'next/router'
import DicoEntry from '@/components/DicoEntry'
import { Container, Content, Form, Heading, Section, Columns } from 'react-bulma-components'
import { HeroSearchBox } from '@kreyolopal/web-ui'
import EntrySidebar from '@/components/EntrySidebar'

export const revalidate = 3600;
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index
}


const DicoPage = ({ kreyol, error, entries }) => {
  const router = useRouter()
  const relatedList = entries.map(entry => {
    const syns = entry.definitions.map(def => {
      return def.synonyms
    }).flat()
    const confer = entry.definitions.map(def => {
      return def.confer
    }).flat()
    return syns.concat(confer)
  }).flat().filter(onlyUnique)

  const hasRelated = relatedList.length > 0

  return (
    <Section>
      <Heading size={2} renderAs="h1">
        Dictionnaire
      </Heading>
      <Container>
        <Columns>
          <Columns.Column size={8} offset={3} backgroundColor='primary-light'>
            <Form.Field className="inner_field">
              <Form.Control fullwidth>
                <HeroSearchBox
                  navigate={(destination) => router.push(destination)}
                />
              </Form.Control>
            </Form.Field>
          </Columns.Column>

          {hasRelated ? (
            <Columns.Column size={3}>
              <EntrySidebar words={relatedList} />
            </Columns.Column>) : null}
          <Columns.Column size={7} offset={hasRelated ? 0 : 3}>
            {error?.length > 0 ? (<Content>{error}</Content>) : (
              <div>
                {entries.map((item, index) => {
                  return (
                    <DicoEntry item={item} kreyol={kreyol} key={item.id} />
                  )
                })}
              </div>)}
          </Columns.Column>
        </Columns>
      </Container>
    </Section>
  )
}

export const getServerSideProps = async (ctx) => {
  const allowedKreyol = ['gp']

  const kreyol = ctx.params?.kreyol.toLowerCase()
  const entry = ctx.params?.entry.toLowerCase()
  const { res } = ctx
  res.setHeader(
    'Cache-Control',
    'public, maxage=3600, stale-while-revalidate=59'
  )
  if (
    kreyol.length == 0 ||
    entry.length == 0 ||
    !allowedKreyol.includes(kreyol)
  ) {
    return {
      notFound: true, //redirects to 404 page
    }
  }

  // Fetch data from external API
  const result = await fetch(
    `${process.env.API_SERVER}/api/dictionary/${kreyol}/${entry}`,
    { next: { revalidate: 3600 } }
  ).catch(function (error) {
    console.log('Il y a eu un problème avec l\'opération fetch : ' + error.message);
  });

  if (result?.ok) {
    const data = await result.json()

    return {
      props: {
        entries: data,
        kreyol,
      },
    }

  }

  if (result.status === 404) {
    return {
      notFound: true, //redirects to 404 page
    }
  }

  console.log('Mauvaise réponse du réseau');
  return {
    props: {
      error: 'Mauvaise réponse du réseau',
    },
  }
}
export default DicoPage
