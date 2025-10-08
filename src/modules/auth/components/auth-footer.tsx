import { routes } from '@/config';
import clsx from 'clsx'
import Link from 'next/link'


export const AuthFooter = () => {
    return (
        <footer className="container">
            <div className={
                clsx(
                    "py-8 mx-auto flex justify-center items-center gap-2 mb-2",
                    "text-primary font-sans",
                )
            }>
                <Link
                    href={routes.useTerms}
                    className="hover:underline"
                >
                    Términos de uso
                </Link>
                {" | "}
                <Link
                    href={routes.privacyPolicy}
                    className="hover:underline"
                >
                    Política de privacidad
                </Link>
            </div>
        </footer>
    )
}

