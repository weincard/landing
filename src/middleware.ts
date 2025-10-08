import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { apiUrls } from './config/protocols/http/api_urls';
import { userAdapter } from './data/adapters/user.adpater';
import { routes } from './config';

type UserRole = 'Administrador';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const res = NextResponse.next();
    const pathName = request.nextUrl.pathname;

    // Si navega al login, elimina las cookies automáticamente
    if (pathName === '/login') {
        res.cookies.delete('user'); // Eliminar la cookie 'user'
        res.cookies.delete('token')
        return res;
    }

    // Si no hay token, redirigir al login
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}${apiUrls.auth.me}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // console.log("POPOP:",response);

        const user = userAdapter(response.data); // Adaptar la respuesta al modelo de usuario
        const { role } = user as { role: UserRole };
        // console.log('XXXXX:',user)

        const userEncoded = Buffer.from(JSON.stringify(user)).toString('base64'); // Convertir a Base64
        await res.cookies.set('user', userEncoded, { httpOnly: true, path: '/' }); // Guardar como cookie

        if (pathName === '/') {
            const redirects: Record<UserRole, string> = {
                'Administrador': routes.dashboard
            };
            return NextResponse.redirect(new URL(redirects["Administrador"] || '/login', request.url));
        }

        const roleBasedRoutes: { [key: string]: UserRole[] } = {
            '/dashboard': ['Administrador'],
            '/dashboard/pedidos': [ 'Administrador'],
            '/dashboard/productos': [ 'Administrador'],
            '/dashboard/productos/crear_productos': [ 'Administrador'],
            '/dashboard/productos/editar_productos': [ 'Administrador'],
            '/dashboard/categorias': [ 'Administrador'],
        };

        for (const [route, roles] of Object.entries(roleBasedRoutes)) {
            if (pathName.startsWith(route) && !roles.includes(role as UserRole)) {
                return NextResponse.redirect(new URL('/no-autorizado', request.url));
            }
        }

        return res;
    } catch (error) {
        console.error('Error en el middleware:', error);
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

// Exporta el matcher para definir las rutas en las que aplicar el middleware
export const config = {
    matcher: [
        '/',
        '/login',
        '/dashboard/:path*',
    ],
};
