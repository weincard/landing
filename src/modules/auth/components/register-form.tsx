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
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { AlertCircle, EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { routes } from "@/config";
import { toast } from "sonner";
import { useRouter } from "next-nprogress-bar";
import container from "@/lib/di/container";
import { AuthRepository } from "../data/repositories";
import { Alert, AlertTitle } from "@/components/ui/alert";

// 1. Ajusta el esquema de validación para Registro (si necesitas más campos, agrégalos)
const formSchema = z.object({
  email: z.string().email({
    message: "Por favor ingrese un correo electrónico válido.",
  }),
  password: z.string().min(8, {
    message: "La contraseña debe tener al menos 8 caracteres.",
  }),
  keepSignedIn: z.boolean().optional(),
});

export const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const router = useRouter();

  // 2. Configurar React Hook Form con Zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 3. Lógica de onSubmit (registrar)
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsRegistering(true);

      const authRepository = container.get(AuthRepository);
      // Ajusta aquí tu método de registro
      // const resp = await authRepository.register({
      //   email: values.email,
      //   password: values.password,
      //   username: "defaultUsername", // Replace with actual username value
      //   name: "defaultName", // Replace with actual name value
      //   lastname: "defaultLastname", // Replace with actual lastname value
      // });

      // Guardar token si es necesario
      // setCookie(CookiesKeysEnum.token, resp.accessToken);

      toast.success("Registro exitoso", {
        position: "top-right",
        closeButton: true,
      });

      setErrorMessage("");
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
        toast.error(error.message, {
          position: "top-right",
          closeButton: true,
        });
      }
    } finally {
      setIsRegistering(false);
    }
  }

  return (
    <Card className="w-full max-w-[380px] rounded-2xl py-4">
      {/* Encabezado */}
      <div className="flex flex-col justify-center place-items-center">
        <div className="text-black font-sans text-3xl font-semibold pt-4">
          Crear una cuenta
        </div>
        <div className="flex flex-row items-center justify-center py-4">
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link
                href={routes.auth.login}
                className="text-blue-600 hover:underline"
              >
                Inicia sesión
              </Link>
            </p>
          </CardFooter>
        </div>
      </div>

      {/* Contenido del formulario */}
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Campo Email */}
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

            {/* Campo Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Error de Registro */}
            {errorMessage && (
              <Alert
                variant="destructive"
                className="flex items-center bg-destructive/5"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="mt-1">{errorMessage}</AlertTitle>
              </Alert>
            )}

            {/* Botón de Registrar */}
            <div className="flex justify-center">
              <Button className="w-full" disabled={isRegistering} type="submit">
                {isRegistering ? (
                  <div className="flex flex-row justify-center items-center space-x-2">
                    <>Creando...</>
                    <Loader2 className="animate-spin h-10 w-10 text-white" />
                  </div>
                ) : (
                  "Crear Cuenta"
                )}
              </Button>
            </div>

            <div className="flex flex-row items-center justify-center">
              <p className="text-sm text-gray-600 flex flex-col items-center">
                Al crear una cuenta, acepta nuestros {"   "}
                <Link
                  // href={routes.auth.register}
                  href={""}
                  className="text-blue-600 hover:underline"
                >
                  Términos de servicio
                </Link>
              </p>
            </div>
            <div className="w-full border-b"></div>
            <p className="text-sm text-gray-600 flex flex-col items-center">
              O crea una cuenta usando:
            </p>
            {/* Botones de Redes Sociales */}
            <div className="flex flex-col items-center w-full space-y-2 mt-4">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center"
              >
                <Image
                  src="/google_icon.png"
                  alt="Google"
                  width={20}
                  height={20}
                  className="mr-1"
                />
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center"
              >
                <Image
                  src="/facebook_icon.png"
                  alt="Facebook"
                  width={20}
                  height={20}
                  className="mr-1"
                />
                Continue with Facebook
              </Button>
            </div>

            {/* Si deseas mantener el enlace de "¿Olvidaste tu clave?" (generalmente no va en registro) */}
            {/*
            <div className="flex flex-col w-full place-items-center mt-4">
              <Link
                href={routes.auth.forgotPassword}
                className="text-sm text-blue-600 hover:underline"
              >
                ¿Olvidaste tu clave?
              </Link>
              <div className="w-full border-b mt-8"></div>
            </div>
            */}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
