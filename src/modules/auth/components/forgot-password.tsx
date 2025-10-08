'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'

const formSchema = z.object({
    email: z.string().email({
        message: 'Por favor ingrese un correo electrónico válido.',
    }),
})

export function ForgotPasswordForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }

    return (
        <Card className="w-full max-w-[380px] rounded-2xl py-4">
            <CardHeader>
                <CardTitle>Recuperar contraseña</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Correo electrónico</FormLabel>
                                    <FormControl>
                                        <Input placeholder="correo@ejemplo.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-center">
                            <Button type="submit">Recuperar contraseña</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}