import { z } from 'zod'

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(100),
})

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const clientSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().optional(),
  phone: z.string().optional(),
})

export const eventSchema = z.object({
  title: z.string().min(1).max(300),
  date: z.string().datetime(),
  clientId: z.string().uuid().optional(),
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']),
})

export const invoiceSchema = z.object({
  clientId: z.string().uuid(),
  amount: z.number().positive(),
  dueDate: z.string().datetime(),
  items: z.array(z.object({
    description: z.string(),
    quantity: z.number().positive(),
    unitPrice: z.number().nonnegative(),
  })).min(1),
})
