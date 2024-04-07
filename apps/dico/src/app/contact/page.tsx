import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ContactForm } from '@/components/forms/contact-form'
import { LayoutFooter } from '@/components/layout-footer'

export default async function ContactPage() {
  return (
    <div className=" flex flex-col h-screen w-full ">
      <main className="flex m-auto">
        <Card className="w-full max-w-md m-auto">
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
