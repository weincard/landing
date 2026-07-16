export const DAY_ES: Record<string, string> = {
  Monday: "Lunes",
  Tuesday: "Martes",
  Wednesday: "Miércoles",
  Thursday: "Jueves",
  Friday: "Viernes",
  Saturday: "Sábado",
  Sunday: "Domingo",
};

export const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const DAY_LETTER: Record<string, string> = {
  Monday: "L",
  Tuesday: "M",
  Wednesday: "X",
  Thursday: "J",
  Friday: "V",
  Saturday: "S",
  Sunday: "D",
};

interface DayBadgesProps {
  /** null/undefined/empty all mean "valid every day" — validDays is optional on offers. */
  validDays: string[] | null | undefined;
}

export function DayBadges({ validDays }: DayBadgesProps) {
  const activeSet = new Set(!validDays || validDays.length === 0 ? DAY_ORDER : validDays);
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {DAY_ORDER.map((day) => (
        <span
          key={day}
          title={DAY_ES[day]}
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "4px",
            fontSize: "9px",
            fontFamily: '"Clash Grotesk", sans-serif',
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: activeSet.has(day) ? "#000" : "#e5e7eb",
            color: activeSet.has(day) ? "#fff" : "#9ca3af",
          }}
        >
          {DAY_LETTER[day]}
        </span>
      ))}
    </div>
  );
}
