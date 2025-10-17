/**
 * Configuración del Interceptor de Axios
 *
 * Este archivo contiene la configuración para el comportamiento de los interceptores
 * de axios que manejan los mensajes toast automáticamente.
 */

export const axiosInterceptorConfig = {
  /**
   * Habilitar/deshabilitar toast de éxito automático
   */
  enableSuccessToast: true,

  /**
   * Habilitar/deshabilitar toast de error automático
   */
  enableErrorToast: true,

  /**
   * Métodos HTTP que disparan toast de éxito
   */
  successMethods: ["POST", "PUT", "PATCH", "DELETE"],

  /**
   * Códigos de estado que se consideran exitosos para mostrar toast
   */
  successStatusCodes: [200, 201],

  /**
   * Rutas que NO deben mostrar toast automático (útil para login, etc)
   * Puedes agregar rutas específicas aquí
   */
  excludedRoutes: ["/auth/login", "/auth/register", "/auth/refresh-token"],

  /**
   * Verificar si una URL debe ser excluida de los toasts automáticos
   */
  isExcludedRoute: (url: string): boolean => {
    return axiosInterceptorConfig.excludedRoutes.some((route) =>
      url.includes(route)
    );
  },
};
