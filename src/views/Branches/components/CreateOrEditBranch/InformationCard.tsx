import { Star } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface InformationCardProps {
  name: string;
  phone: string;
  email: string;
  description: string;
  rating: number;
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onRatingChange: (rating: number) => void;
}

export function InformationCard({
  name,
  phone,
  email,
  description,
  rating,
  onNameChange,
  onPhoneChange,
  onEmailChange,
  onDescriptionChange,
  onRatingChange,
}: InformationCardProps) {
  const handleStarClick = (
    starPosition: number,
    event: React.MouseEvent<SVGSVGElement>
  ) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const starWidth = rect.width;
    const isFirstHalf = clickX < starWidth / 2;
    const newRating = isFirstHalf ? starPosition - 0.5 : starPosition;
    onRatingChange(newRating);
  };

  const getStarFill = (starPosition: number) => {
    if (rating >= starPosition) return "full";
    if (rating >= starPosition - 0.5) return "half";
    return "empty";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex">
          <h2 className="text-lg font-semibold">Información</h2>
          <div className="flex items-center gap-1 ml-auto">
            {[1, 2, 3, 4, 5].map((star) => {
              const fillType = getStarFill(star);
              return (
                <div key={star} className="relative cursor-pointer">
                  {fillType === "half" ? (
                    <svg
                      onClick={(e) => handleStarClick(star, e)}
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <linearGradient id={`half-${star}`}>
                          <stop offset="50%" stopColor="#facc15" />
                          <stop offset="50%" stopColor="#e5e7eb" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                        fill={`url(#half-${star})`}
                        stroke="#facc15"
                        strokeWidth="1"
                      />
                    </svg>
                  ) : (
                    <Star
                      onClick={(e) => handleStarClick(star, e)}
                      className={`h-5 w-5 ${
                        fillType === "full"
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground" htmlFor="name">
              Nombre del establecimiento *
            </Label>
            <Input
              id="name"
              placeholder="Kielo Sushi"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground" htmlFor="phone">
              Contacto *
            </Label>
            <Input
              id="phone"
              placeholder="+57237176267"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground" htmlFor="email">
              Correo *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="sucursal@ejemplo.com"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground" htmlFor="description">
            Descripción
          </Label>
          <Textarea
            id="description"
            placeholder="Descripción de la sucursal"
            rows={3}
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
