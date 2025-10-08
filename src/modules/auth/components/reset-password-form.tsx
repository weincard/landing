"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";

// 1. Cambiamos el esquema para que solo valide un Email
const formSchema = z.object({
  email: z.string().email("Por favor ingresa un correo electrónico válido."),
});

export function ResetPasswordForm() {
  // 2. Configuramos React Hook Form con Zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // 3. Lógica al enviar el formulario
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Aquí iría la lógica para enviar la solicitud de restablecimiento de contraseña
    console.log("Email ingresado:", values.email);
  }

  return (
    <Card className="w-full max-w-[380px] rounded-2xl py-6">
      {/* Encabezado */}
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          Restablecer Contraseña
        </CardTitle>
        <p className="text-sm text-gray-500 mt-2">
          Le ayudaremos a restablecer su contraseña
        </p>
      </CardHeader>

      {/* Contenido */}
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Campo de Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electónico</FormLabel>
                  <FormControl>
                    <Input placeholder="Correo Electónico" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botón principal */}
            <Button type="submit" className="w-full">
              Restablecer Contraseña
            </Button>
          </form>
        </Form>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex flex-col items-center">
        <div className="w-full border-b my-5" />
        <p className="text-sm text-gray-600 mb-4">Remembered your Password?</p>
        <Link href="/login" className="w-full">
          {/* Botón con fondo blanco */}
          <Button
            variant="outline"
            className="bg-white text-blue-600 w-full hover:bg-gray-50"
          >
            Back to Sign In
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
