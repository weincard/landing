import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface NotesCardProps {
  note: string;
  onNoteChange: (value: string) => void;
}

export function NotesCard({ note, onNoteChange }: NotesCardProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Nota</h2>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Nota"
          rows={3}
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
        />
      </CardContent>
    </Card>
  );
}
