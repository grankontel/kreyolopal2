import { z } from 'zod'

export const changePasswordSchema = z.object({
  old_password: z.string().min(3),
  new_password: z.string().min(10).regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{10,}$/),
	verification: z.string().min(10)  
}).refine((data) => data.new_password === data.verification, {
	message: 'Password confirmation does not match password',
	path: ['verification'], // path of error
})
