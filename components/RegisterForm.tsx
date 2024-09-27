'use client'
import axios from 'axios'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const schema = z
  .object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.'),
    email: z.string().email('Debe ser un email válido.'),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres.')
      .regex(/[A-Z]/, 'Debe tener al menos una letra mayúscula.')
      .regex(/[a-z]/, 'Debe tener al menos una letra minúscula.')
      .regex(/\d/, 'Debe tener al menos un número.'),
    confirmPassword: z.string(),
    country: z.string().min(1, 'Debe seleccionar un país.'),
    terms: z
      .boolean()
      .refine(
        (value) => value === true,
        'Debe aceptar los términos y condiciones.',
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Las contraseñas no coinciden.',
  })

type FormData = z.infer<typeof schema>

export default function RegisterForm() {
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm({
  //   resolver: zodResolver(schema),
  // })

  const [countries, setCountries] = useState([])
  useEffect(() => {
    axios
      .get('/api/countries')
      .then(function (response) {
        // handle success
        setCountries(response.data)

        console.log(response)
      })
      .catch(function (error) {
        // handle error
        console.log(error)
      })
      .finally(function () {
        // always executed
      })
  }, [])

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  function onSubmit(data: FormData) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Introduzca su nombre" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Introduzca su email"
                  {...field}
                />
              </FormControl>
              <FormDescription>Este es su email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Introduzca su contraseña"
                  {...field}
                />
              </FormControl>
              <FormDescription>Esta es su contraseña.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input placeholder="Repita la contraseña" {...field} />
              </FormControl>
              <FormDescription>
                Vuelva a introducir su contraseña.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Language</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'w-[200px] justify-between',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value
                        ? countries.find((country) => country === field.value)
                            ?.label
                        : 'Select language'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search language..." />
                    <CommandList>
                      <CommandEmpty>No language found.</CommandEmpty>
                      <CommandGroup>
                        {countries.map((country) => (
                          <CommandItem
                            value={language.label}
                            key={language.value}
                            onSelect={() => {
                              form.setValue('language', country.value)
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                country.value === field.value
                                  ? 'opacity-100'
                                  : 'opacity-0',
                              )}
                            />
                            {country.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the language that will be used in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>

    // <form onSubmit={handleSubmit(onSubmit)}>
    //   <Input {...register('name')} placeholder="Nombre" />
    //   {errors.name && <span>{errors.name.message}</span>}

    //   <Input {...register('email')} placeholder="Email" />
    //   {errors.email && <span>{errors.email.message}</span>}

    //   <Input
    //     {...register('password')}
    //     type="password"
    //     placeholder="Contraseña"
    //   />
    //   {errors.password && <span>{errors.password.message}</span>}

    //   <Input
    //     {...register('confirmPassword')}
    //     type="password"
    //     placeholder="Confirmar Contraseña"
    //   />
    //   {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}

    //   <select {...register('country')}>{/* Opciones de países */}</select>
    //   {errors.country && <span>{errors.country.message}</span>}

    //   <Checkbox {...register('terms')} />
    //   <label>Acepto los términos y condiciones</label>
    //   {errors.terms && <span>{errors.terms.message}</span>}

    //   <Button type="submit">Registrar</Button>
    // </form>
  )
}
