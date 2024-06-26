'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLogin } from '@/queries/use-login'
import { useToast } from '@/components/ui/use-toast'

export function LoginForm() {
  const { toast } = useToast()
  const notifyer = (err: { error?: string; toString: () => string }) => {
    toast({
      title: 'Erreur',
      variant: 'destructive',
      description: err?.error || err.toString(),
    })
  }
  const signInMutation = useLogin(notifyer)

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const username = e.target.elements.username.value
    const password = e.target.elements.password.value
    signInMutation({ username, password })
  }

  return (
    <Card className="m-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              autoComplete="username"
              type="text"
              placeholder="username"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              autoComplete="current-password"
              type="password"
              placeholder='enter your password'
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit" variant="logo">
            Sign in
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
