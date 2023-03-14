import TopNavbar from '@/components/TopNavbar'
import Head from 'next/head'

import {
    Container,
    Content,
} from 'react-bulma-components'

const webSite = {
    "@context": "http://schema.org",
    "@type": "WebSite",
    "name": "Kreyolopal",
    "url": "https://kreyolopal.com/"

}

const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "url": "https://kreyolopal.com/",
    "logo": "/images/logo_name.png"
}


export default function StandardPage({ children }) {
    return (
        <>
            <Head>
                <title>Kreyolopal</title>
                <meta name="description"
                    content="Utiliser les technologies d'aujourd'hui pour encourager, améliorer et diffuser l'écriture du créole." />

                <link rel="icon" href="/favicons/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="theme-color" content="#000000" />
                <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
                <link rel="manifest" href="/favicons/site.webmanifest" />
                <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#5bbad5" />
                <link rel="shortcut icon" href="/favicons/favicon.ico" />
                <meta name="msapplication-TileColor" content="#ffc40d" />
                <meta name="msapplication-config" content="/favicons/browserconfig.xml" />
                <meta name="theme-color" content="#ffffff" />

                <meta property="og:type" content="website" />
                <meta property="og:image" content="/images/kreyolopal_social.png" />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:width" content="940" />
                <meta property="og:image:height" content="788" />
                <meta property="og:image:alt" content="Kreyolopal : les technologies au service du créole" />

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(webSite) }}
                />

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
                />


                <link rel="manifest" href="/favicons/site.webmanifest" />


            </Head>
            <TopNavbar />
            <Container className="main" renderAs="main">
                {children}
            </Container>
            <footer className="page-footer has-text-centered">
                <Content>&copy; TiMalo — 2022</Content>
            </footer>
        </>
    )
}
