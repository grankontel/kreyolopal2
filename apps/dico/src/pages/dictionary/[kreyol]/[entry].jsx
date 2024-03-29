import { useRouter } from 'next/navigation'
import DicoEntry from '@/components/DicoEntry'
import { Container, Content, Form, Heading, Section, Columns } from 'react-bulma-components'
import { HeroSearchBox } from '@kreyolopal/web-ui'
import EntrySidebar from '@/components/EntrySidebar'
import { parseCookie } from '@/lib/auth'
import Standard from '@/layouts/Standard'

export const revalidate = 3600;
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index
}


const DicoPage = ({ kreyol, error, is_bookmarked, entry, bookmark }) => {
  const router = useRouter()
  const relatedList = [entry].map(entry => {
    const syns = entry.definitions.map(def => {
      return def.synonyms
    }).flat()
    const confer = entry.definitions.map(def => {
      return def.confer
    }).flat()
    return syns.concat(confer)
  }).flat().filter(onlyUnique)

  const hasRelated = relatedList.length > 0

  const source = is_bookmarked ? bookmark : entry
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
                <DicoEntry is_bookmarked={is_bookmarked} item={source} kreyol={kreyol} key={source.id} />
              </div>)}
          </Columns.Column>
        </Columns>
      </Container>
    </Section>
  )
}

DicoPage.getLayout = function getLayout(page) {
  return (
    <Standard>
      {page}
    </Standard>
  )
}

export const config = {
  runtime: 'experimental-edge',
}

export const getServerSideProps = async (ctx) => {
  const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME || 'wabap'
  const apiServer = process.env.API_SERVER || 'https://api.kreyolopal.com'
  const auth = parseCookie(ctx.req.cookies?.[cookieName])
  const allowedKreyol = ['gp']

  const kreyol = ctx.params?.kreyol.toLowerCase()
  const entry = ctx.params?.entry.toLowerCase()
  const { res, req } = ctx
  const { user_id, session_id } = auth || {user_id: null, session_id: null} ;

  const cacheMode = !user_id ? 'public' : 'private'
  res.setHeader(
    'Cache-Control',
    `${cacheMode}, maxage=3600, stale-while-revalidate=59`
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
    `${apiServer}/api/dictionary/${kreyol}/${entry}`,
    {
      method: 'GET',
//      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 },
    }
  ).catch(function (error) {
    console.log('Il y a eu un problème avec l\'opération fetch : ' + error.message);
  });

  if (result.status === 404) {
    return {
      notFound: true, //redirects to 404 page
    }
  }
  if (!result?.ok) {
    console.log('Mauvaise réponse du réseau');
    return {
      props: {
        error: 'Mauvaise réponse du réseau',
      },
    }
  }

  const data = await result.json()
  const response = {
    is_bookmarked: false,
    entry: data[0],
    kreyol,
  }


  if (user_id) {
    const token = session_id
    const result2 = await fetch(
      `${apiServer}/api/me/dictionary/${entry}`,
      {
        method: 'GET',

        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        next: { revalidate: 3600 },
      }
    ).catch(function (error) {
      console.log('Il y a eu un problème avec l\'opération fetch : ' + error.message);
    });

    if (result2?.ok) {
      const data2 = await result2.json()

      const bookmarks = data2.map((item) => {
        return {
          id: item.id,
          entry: item.entry,
          variations: item.variations,
          definitions: item.definitions[kreyol],
        }
      })
      response.is_bookmarked = bookmarks.length > 0;
      response.bookmark = bookmarks[0]
    }
  }

  return {
    props: response,
  }

}
export default DicoPage
