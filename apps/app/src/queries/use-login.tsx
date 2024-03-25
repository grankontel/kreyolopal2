import { ResponseError } from '@/lib/types'
import { useDicoStore } from '@/store/dico-store';
import { useQueryClient, useMutation } from '@tanstack/react-query'

interface IUserCredentials {
	username: string,
	password: string
}

const fetchLogin = (formData: FormData):Promise<Response> => {
	return fetch('/api/auth/login', {
		method: 'POST',
		body: JSON.stringify({
			username: formData.get('username'),
			password: formData.get('password'),
		}),
		headers: {
			'Content-Type': 'application/json',
		},
	})
}

export function useLogin() {
	const queryClient = useQueryClient()
	const {user, setUser } = useDicoStore((state) => ({user: state.user, setUser: state.setUser}))

	return useMutation({
    mutationFn: fetchLogin,
    onSuccess: (data) => {
      // ✅ refetch the comments list for our blog post
			setUser(data)
    },
  })
}
