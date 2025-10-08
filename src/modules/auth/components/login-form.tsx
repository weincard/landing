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

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircle, EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { routes } from "@/config";
import { toast } from "sonner";
import { useRouter } from "next-nprogress-bar";
import container from "@/lib/di/container";
import { AuthRepository } from "../data/repositories";
import { setCookie } from "cookies-next";
import { CookiesKeysEnum } from "@/utilities/enums";
import { Alert, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  email: z.string().email({
    message: "Por favor ingrese un correo electrónico válido.",
  }),
  password: z.string().min(8, {
    message: "La contraseña debe tener al menos 8 caracteres.",
  }),
  keepSignedIn: z.boolean().optional(),
});

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogging, setIsLogging] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      keepSignedIn: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLogging(true);

      const authRepository = container.get(AuthRepository);
      const resp = await authRepository.login({
        email: values.email,
        password: values.password,
        // rol: values.role
      });

      console.log("AccesTocken:", resp.accessToken);
      setCookie(CookiesKeysEnum.token, resp.accessToken);
      // setUserCookies(resp);
      if (resp.role === "superadmin") {
        router.replace(routes.dashboard);
      }
      toast.success("Login exitoso", {
        position: "top-right",
        closeButton: true,
      });

      setErrorMessage("");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
        toast.error(error.message, {
          position: "top-right",
          closeButton: true,
        });
      }
    } finally {
      setIsLogging(false);
    }
    router.refresh();
  }

  return (
    <Card className="w-full max-w-[380px] rounded-2xl py-4 ">
      <div className="flex flex-col justify-center place-items-center">
        <div className="text-black font-sans text-3xl font-semibold pt-4">
          Acceder
        </div>
        <div className="flex flex-row items-center justify-center py-4">
          {/* <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{"   "}
              <Link
                href={routes.auth.register}
                className="text-blue-600 hover:underline"
              >
                Crear Cuenta
              </Link>
            </p>
          </CardFooter> */}
        </div>
      </div>
      {/* <h1 className='p-4 text-4xl'>Coberturas</h1> */}
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            {errorMessage && (
              <Alert
                variant="destructive"
                className="flex items-center bg-destructive/5"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="mt-1">{errorMessage}</AlertTitle>
              </Alert>
            )}
            <FormField
              control={form.control}
              name="keepSignedIn"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      id="keepSignedIn"
                      className="w-4 h-4"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor="keepSignedIn"
                    className="text-sm text-gray-600"
                  >
                    Keep me signed in
                  </FormLabel>
                </FormItem>
              )}
            />

            <div className="flex justify-center">
              <Button className="w-full" disabled={isLogging} type="submit">
                {isLogging ? (
                  <div className="flex flex-row justify-center items-center space-x-2">
                    <>Iniciando...</>
                    <Loader2 className="animate-spin h-10 w-10 text-white" />
                  </div>
                ) : (
                  "Iniciar sesión"
                )}
              </Button>
            </div>

            {/* <div className="flex flex-col w-full place-items-center">
              <Link
                href={routes.auth.forgotPassword}
                className="text-sm text-blue-600 hover:underline"
              >
                ¿Olvidaste tu clave?
              </Link>
              <div className="w-full border-b mt-8"></div>
            </div> */}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
