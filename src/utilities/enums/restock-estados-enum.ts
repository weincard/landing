/**
 * Enum para los estados de pago de las solicitudes de restock
 */
export enum RestockPaymentStatusEnum {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED", 
  REJECTED = "REJECTED"
}

/**
 * Enum para los estados de entrega de las solicitudes de restock
 */
export enum RestockDeliveryStatusEnum {
  PENDING = "PENDING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED"
}

/**
 * Enum para los tipos de pago de las solicitudes de restock
 */
export enum RestockPaymentTypeEnum {
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD", 
  BANK_TRANSFER = "BANK_TRANSFER",
  ACCOUNT_BALANCE = "ACCOUNT_BALANCE"
}

/**
 * Enum para los estados generales de las solicitudes de restock
 */
export enum RestockStatusEnum {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

/**
 * Tipos para los valores de los enums
 */
export type RestockPaymentStatusType = `${RestockPaymentStatusEnum}`
export type RestockDeliveryStatusType = `${RestockDeliveryStatusEnum}`
export type RestockPaymentTypeType = `${RestockPaymentTypeEnum}`
export type RestockStatusType = `${RestockStatusEnum}`

/**
 * Mapeo de estados de pago a colores para badges
 */
export const restockPaymentStatusColorMap: Record<RestockPaymentStatusType, string> = {
  [RestockPaymentStatusEnum.PENDING]: "bg-yellow-100 text-yellow-800",
  [RestockPaymentStatusEnum.COMPLETED]: "bg-green-100 text-green-800", 
  [RestockPaymentStatusEnum.REJECTED]: "bg-red-100 text-red-800",
}

/**
 * Mapeo de estados de entrega a colores para badges
 */
export const restockDeliveryStatusColorMap: Record<RestockDeliveryStatusType, string> = {
  [RestockDeliveryStatusEnum.PENDING]: "bg-yellow-100 text-yellow-800",
  [RestockDeliveryStatusEnum.SHIPPED]: "bg-blue-100 text-blue-800",
  [RestockDeliveryStatusEnum.DELIVERED]: "bg-green-100 text-green-800",
}

/**
 * Mapeo de estados generales a colores para badges
 */
export const restockStatusColorMap: Record<RestockStatusType, string> = {
  [RestockStatusEnum.PENDING]: "bg-yellow-100 text-yellow-800",
  [RestockStatusEnum.APPROVED]: "bg-green-100 text-green-800",
  [RestockStatusEnum.REJECTED]: "bg-red-100 text-red-800",
}

/**
 * Etiquetas en español para estados de pago
 */
export const restockPaymentStatusLabels: Record<RestockPaymentStatusType, string> = {
  [RestockPaymentStatusEnum.PENDING]: "Pendiente",
  [RestockPaymentStatusEnum.COMPLETED]: "Completado",
  [RestockPaymentStatusEnum.REJECTED]: "Rechazado",
}

/**
 * Etiquetas en español para estados de entrega
 */
export const restockDeliveryStatusLabels: Record<RestockDeliveryStatusType, string> = {
  [RestockDeliveryStatusEnum.PENDING]: "Pendiente",
  [RestockDeliveryStatusEnum.SHIPPED]: "Enviado",
  [RestockDeliveryStatusEnum.DELIVERED]: "Entregado",
}

/**
 * Etiquetas en español para estados generales
 */
export const restockStatusLabels: Record<RestockStatusType, string> = {
  [RestockStatusEnum.PENDING]: "Pendiente",
  [RestockStatusEnum.APPROVED]: "Aprobado",
  [RestockStatusEnum.REJECTED]: "Rechazado",
}

/**
 * Etiquetas en español para tipos de pago
 */
export const restockPaymentTypeLabels: Record<RestockPaymentTypeType, string> = {
  [RestockPaymentTypeEnum.CREDIT_CARD]: "Tarjeta de Crédito",
  [RestockPaymentTypeEnum.DEBIT_CARD]: "Tarjeta de Débito",
  [RestockPaymentTypeEnum.BANK_TRANSFER]: "Transferencia Bancaria",
  [RestockPaymentTypeEnum.ACCOUNT_BALANCE]: "Saldo de Cuenta",
} 