export const formatDate = (dataISO: string): string => {
  const mesesPortugues = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const data = new Date(dataISO);

  const dia = data.getDate();
  const mes = mesesPortugues[data.getMonth()];
  const ano = data.getFullYear();

  let horas = data.getHours();
  const minutos = data.getMinutes().toString().padStart(2, "0");
  const ampm = horas >= 12 ? "PM" : "AM";

  horas = horas % 12;
  horas = horas ? horas : 12; // convierte 0 en 12

  return `${dia} de ${mes}, ${ano}, ${horas}:${minutos} ${ampm}`;
};

export const formatDate2 = (dataISO: string): string => {
  // Si la fecha viene como YYYY-MM-DD, extraer directamente sin Date()
  // para evitar problemas de zona horaria
  if (dataISO.includes("T")) {
    // Es una fecha completa con hora, extraer solo la parte de fecha
    const fechaParte = dataISO.split("T")[0];
    const [ano, mes, dia] = fechaParte.split("-");
    return `${dia}/${mes}/${ano}`;
  } else {
    // Es solo una fecha YYYY-MM-DD
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
  }
};

// Función para formatear fechas sin problemas de timezone
export const formatDateSafe = (dataISO: string): string => {
  try {
    // Intentar extraer directamente de la cadena para evitar timezone issues
    let fechaParte: string;

    if (dataISO.includes("T")) {
      // Es una fecha completa con hora
      fechaParte = dataISO.split("T")[0];
    } else if (dataISO.includes(" ")) {
      // Formato con espacio
      fechaParte = dataISO.split(" ")[0];
    } else {
      // Solo fecha
      fechaParte = dataISO;
    }

    const [ano, mes, dia] = fechaParte.split("-");

    if (ano && mes && dia) {
      return `${dia.padStart(2, "0")}/${mes.padStart(2, "0")}/${ano}`;
    }

    // Fallback si no se puede parsear
    return formatDate2(dataISO);
  } catch (error) {
    console.warn("Error formatting date:", error);
    return dataISO; // Devolver la fecha original si hay error
  }
};

// utils/formatDate.ts
export function formatDateDB(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Mes comienza desde 0, así que se suma 1
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}
