import DicoEntry from '@/components/DicoEntry'
import { Content, Heading, Section } from 'react-bulma-components'

export const revalidate = 3600;

const DicoPage = ({ kreyol, error, entries }) => {

  return (
    <Section>
      <Heading size={2} renderAs="h1">
        Dictionnaire
      </Heading>
      {error?.length > 0 ? (<Content>{error}</Content>) : (
        <div>
          {entries.map((item, index) => {
            return (
              <DicoEntry item={item} kreyol={kreyol} key={item.id} />
            )
          })}
        </div>)}
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
    'public, s-maxage=3600, stale-while-revalidate=59'
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
