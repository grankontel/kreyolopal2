import { NextPage } from 'next'
import dynamic from 'next/dynamic'
const MongoAdmin = dynamic(() => import('@/components/MongoAdmin'), {
  ssr: false,
})

const MongoPage: NextPage = () => {
  return <MongoAdmin />
}

export default MongoPage
