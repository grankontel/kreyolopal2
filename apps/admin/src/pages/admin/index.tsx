import { NextPage } from 'next'
import dynamic from 'next/dynamic'
const AdminApp = dynamic(
  () => import('@kreyolopal/web-admin').then((obj) => obj.AdminApp),
  { ssr: false }
)

const Admin: NextPage = () => {
  return <AdminApp />
}

export default Admin
