import { deleteCookie } from "cookies-next";
import { CookiesKeysEnum } from "@/utilities";
import { useRouter } from "next-nprogress-bar";
import { routes } from "@/config";


export const useLogout = () => {

    const router = useRouter();


    const logout = () => {
        deleteCookie(CookiesKeysEnum.token);
        // window.location.reload();
        // router.refresh();
        router.replace(routes.auth.login);

    };

    return { logout };
}