import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ContactForm } from '@/components/forms/contact-form'
import { LayoutFooter } from '@/components/layout-footer'

export default async function ContactPage() {
  return (
    <div className=" flex h-screen w-full flex-col ">
      <main className="m-auto flex">
        <Card className="m-auto w-full max-w-md">
          <CardHeader>
            <CardTitle>Nous contacter</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <ContactForm />
          </CardContent>
        </Card>
      </main>
      <LayoutFooter />
    </div>
  )
}
