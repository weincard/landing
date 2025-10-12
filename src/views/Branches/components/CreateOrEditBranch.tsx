"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Star, Upload, MapPin, X } from "lucide-react";
import Image from "next/image";

interface CreateOrEditBranchProps {
  branchId?: string;
}

export function CreateOrEditBranch({ branchId }: CreateOrEditBranchProps) {
  const [logo, setLogo] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [rating, setRating] = useState(4.5);
  const [isActive, setIsActive] = useState(true);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [addressSearch, setAddressSearch] = useState("");
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<{
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  } | null>(null);
  const [managerSearch, setManagerSearch] = useState("");
  const [showManagerSuggestions, setShowManagerSuggestions] = useState(false);
  const [selectedManagers, setSelectedManagers] = useState<
    Array<{ id: string; name: string }>
  >([]);

  // Mock de managers disponibles (en producción vendría de la API)
  const availableManagers = [
    { id: "1", name: "Juan Felipe" },
    { id: "2", name: "Jeff E" },
    { id: "3", name: "Emerson Benavides" },
    { id: "4", name: "María García" },
    { id: "5", name: "Carlos Rodríguez" },
  ];

  const filteredManagers = availableManagers.filter(
    (manager) =>
      manager.name.toLowerCase().includes(managerSearch.toLowerCase()) &&
      !selectedManagers.some((selected) => selected.id === manager.id)
  );

  // Mock de direcciones sugeridas (en producción vendría de una API de geocoding)
  const addressSuggestions = [
    {
      street: "Cra. 35 #66-35",
      city: "Medellín",
      state: "Antioquia",
      country: "Colombia",
      postalCode: "05001",
      fullAddress: "Cra. 35 #66-35, Villa Flora, Medellín, Antioquia",
    },
    {
      street: "Cra. 152 #44-35",
      city: "Medellín",
      state: "Antioquia",
      country: "Colombia",
      postalCode: "05001",
      fullAddress: "Cra. 152 #44-35, Robledo, Medellín, Antioquia",
    },
    {
      street: "Cra. 43 #1 Sur-25",
      city: "Medellín",
      state: "Antioquia",
      country: "Colombia",
      postalCode: "05001",
      fullAddress: "Cra. 43 #1 Sur-25, El Poblado, Medellín, Antioquia",
    },
    {
      street: "Cra. 80C #44-35",
      city: "Medellín",
      state: "Antioquia",
      country: "Colombia",
      postalCode: "05001",
      fullAddress: "Cra. 80C #44-35, Santa Monica, Medellín, Antioquia",
    },
  ];

  const filteredSuggestions = addressSuggestions.filter((suggestion) =>
    suggestion.fullAddress.toLowerCase().includes(addressSearch.toLowerCase())
  );

  const handleSelectAddress = (suggestion: (typeof addressSuggestions)[0]) => {
    setSelectedAddress({
      street: suggestion.street,
      city: suggestion.city,
      state: suggestion.state,
      country: suggestion.country,
      postalCode: suggestion.postalCode,
    });
    setAddressSearch(suggestion.fullAddress);
    setShowAddressSuggestions(false);
  };

  const handleSelectManager = (manager: { id: string; name: string }) => {
    setSelectedManagers([...selectedManagers, manager]);
    setManagerSearch("");
    setShowManagerSuggestions(false);
  };

  const handleRemoveManager = (managerId: string) => {
    setSelectedManagers(
      selectedManagers.filter((manager) => manager.id !== managerId)
    );
  };

  // Función para manejar el click en las estrellas (permite medias estrellas)
  const handleStarClick = (
    starPosition: number,
    event: React.MouseEvent<SVGSVGElement>
  ) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const starWidth = rect.width;

    // Si el click fue en la primera mitad, asignar .5, si fue en la segunda mitad, asignar entero
    const isFirstHalf = clickX < starWidth / 2;
    const newRating = isFirstHalf ? starPosition - 0.5 : starPosition;

    setRating(newRating);
  };

  // Función para determinar cómo mostrar cada estrella
  const getStarFill = (starPosition: number) => {
    if (rating >= starPosition) {
      return "full"; // Estrella completamente llena
    } else if (rating >= starPosition - 0.5) {
      return "half"; // Media estrella
    } else {
      return "empty"; // Estrella vacía
    }
  };

  const handleLogoUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogo(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const handleImagesUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const filesArray = Array.from(e.target.files);
        filesArray.forEach((file) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImages((prev) => [...prev, reader.result as string]);
          };
          reader.readAsDataURL(file);
        });
      }
    },
    []
  );

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleTime = (time: string) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Agregar sucursal</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Main Information */}
        <div className="col-span-2 space-y-6">
          {/* Information Card */}
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
                          // Media estrella - usa un SVG con gradient
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
                          // Estrella completa o vacía
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
                    Nombre de la sucursal
                  </Label>
                  <Input id="name" placeholder="Kielo Sushi" />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground" htmlFor="contact">
                    Contacto
                  </Label>
                  <Input id="contact" placeholder="+57237176267" />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground" htmlFor="code">
                    Correo
                  </Label>
                  <Input id="code" placeholder="+547237176267" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground" htmlFor="description">
                  Descripción
                </Label>
                <Textarea
                  id="description"
                  placeholder="Descripción del aliado"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground" htmlFor="redemption">
                  ¿Cómo funciona la redención?
                </Label>
                <Textarea
                  id="redemption"
                  placeholder="Como funciona la redención en esta sucursal"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Logo Card */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Logo</h2>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                {logo ? (
                  <div className="relative w-32 h-32 mx-auto">
                    <Image
                      src={logo}
                      alt="Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <div className="text-sm text-muted-foreground">
                      Arrastra una imagen aquí
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  id="logo-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
                <Button
                  variant="link"
                  className="mt-2"
                  onClick={() =>
                    document.getElementById("logo-upload")?.click()
                  }
                >
                  Agregar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Images Card */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Imágenes</h2>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                {images.length > 0 ? (
                  <div className="grid grid-cols-4 gap-4">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square">
                        <Image
                          src={img}
                          alt={`Image ${idx + 1}`}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <div className="text-sm text-muted-foreground">
                      Arrastra varias imágenes aquí
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  id="images-upload"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImagesUpload}
                />
                <Button
                  variant="link"
                  className="mt-2"
                  onClick={() =>
                    document.getElementById("images-upload")?.click()
                  }
                >
                  Agregar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Offer Card */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Oferta</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">
                    Tipo de oferta
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Cantidad de comensales" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comensales">
                        Cantidad de comensales
                      </SelectItem>
                      <SelectItem value="porcentaje">Porcentaje</SelectItem>
                      <SelectItem value="monto">Monto fijo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">
                    Tipo de membresía
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Wein card premium" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="premium">Wein card premium</SelectItem>
                      <SelectItem value="basic">Wein card basic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">
                  Establece la cantidad de comensales
                </Label>
                <Input placeholder="2×1" />
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">
                  Detalles de la promoción
                </Label>
                <Input placeholder="Qué productos" />
              </div>

              <Button variant="link" className="p-0 h-auto text-blue-600">
                Agregar otra oferta
              </Button>
            </CardContent>
          </Card>

          {/* Availability Card */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Disponibilidad</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Tipo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Días" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dias">Días</SelectItem>
                    <SelectItem value="horas">Horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Tipo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Hora" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hora">Hora</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Valores</Label>
                <div className="flex flex-wrap gap-2">
                  {["Sábado", "Domingo"].map((day) => (
                    <Button
                      key={day}
                      variant={
                        selectedDays.includes(day) ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => toggleDay(day)}
                    >
                      {day}
                      {selectedDays.includes(day) && (
                        <X className="h-3 w-3 ml-1" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Valores</Label>
                <div className="flex flex-wrap gap-2">
                  {["14h", "15h", "16h"].map((time) => (
                    <Button
                      key={time}
                      variant={
                        selectedTimes.includes(time) ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => toggleTime(time)}
                    >
                      {time}
                      {selectedTimes.includes(time) && (
                        <X className="h-3 w-3 ml-1" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-start">
                <Button variant="link" className="p-0 h-auto text-blue-600">
                  Agregar otra disponibilidad
                </Button>
                <Button
                  variant="link"
                  className="p-0 h-auto text-blue-600 mt-4"
                >
                  Agregar nuevo beneficio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Categories, Address, Manager, Ally, Active */}
        <div className="space-y-6">
          {/* Categories Card */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Categorías</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  "Restaurante",
                  "Étnico",
                  "De autor",
                  "Alimento natural",
                  "Café",
                  "Cinema",
                  "Pizza",
                  "Retail",
                ].map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <input type="checkbox" id={category} />
                    <Label
                      className="text-muted-foreground cursor-pointer"
                      htmlFor={category}
                    >
                      {category}
                    </Label>
                  </div>
                ))}
                <Button variant="link" className="p-0 h-auto text-blue-600">
                  Crear nueva
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Address Card */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Dirección</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Input
                  placeholder="Cra. 35 #58-35, Villa Flora, Medellín..."
                  value={addressSearch}
                  onChange={(e) => {
                    setAddressSearch(e.target.value);
                    setShowAddressSuggestions(true);
                  }}
                  onFocus={() => setShowAddressSuggestions(true)}
                />

                {/* Autocomplete Suggestions */}
                {showAddressSuggestions &&
                  addressSearch &&
                  filteredSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredSuggestions.map((suggestion, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                          onClick={() => handleSelectAddress(suggestion)}
                        >
                          <MapPin className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                          <div className="text-sm">
                            <div className="font-medium">
                              {suggestion.street}
                            </div>
                            <div className="text-muted-foreground">
                              {suggestion.city}, {suggestion.state}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>

              {selectedAddress && (
                <>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">
                      Dirección escogida:
                    </Label>
                    <div className="text-sm flex gap-1">
                      <span className="font-medium">País:</span>
                      <span className="text-muted-foreground">
                        {selectedAddress.country}
                      </span>
                    </div>
                    <div className="text-sm flex gap-1">
                      <span className="font-medium">Estado:</span>
                      <span className="text-muted-foreground">
                        {selectedAddress.state}
                      </span>
                    </div>
                    <div className="text-sm flex gap-1">
                      <span className="font-medium">Ciudad:</span>
                      <span className="text-muted-foreground">
                        {selectedAddress.city}
                      </span>
                    </div>
                    <div className="text-sm flex gap-1">
                      <span className="font-medium">Código postal:</span>
                      <span className="text-muted-foreground">
                        {selectedAddress.postalCode}
                      </span>
                    </div>
                    <div className="text-sm flex gap-1">
                      <span className="font-medium">Dirección:</span>
                      <span className="text-muted-foreground">
                        {selectedAddress.street}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Notes Card */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Nota</h2>
            </CardHeader>
            <CardContent>
              <Textarea placeholder="Nota" rows={3} />
            </CardContent>
          </Card>

          {/* Manager Card */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold flex items-center justify-between">
                <span>Manager</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {selectedManagers.length > 0 ? "SÍ" : "NO"}
                </span>
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Input
                  placeholder="Buscar manager ó staff"
                  value={managerSearch}
                  onChange={(e) => {
                    setManagerSearch(e.target.value);
                    setShowManagerSuggestions(true);
                  }}
                  onFocus={() => setShowManagerSuggestions(true)}
                />

                {/* Autocomplete Suggestions */}
                {showManagerSuggestions &&
                  managerSearch &&
                  filteredManagers.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredManagers.map((manager) => (
                        <div
                          key={manager.id}
                          className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                          onClick={() => handleSelectManager(manager)}
                        >
                          <span className="text-sm">{manager.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
              </div>

              {/* Selected Managers Badges */}
              {selectedManagers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedManagers.map((manager) => (
                    <div
                      key={manager.id}
                      className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{manager.name}</span>
                      <button
                        onClick={() => handleRemoveManager(manager.id)}
                        className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ally Card */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Aliado</h2>
            </CardHeader>
            <CardContent>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Aliado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="friday">Friday Antioquia</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Active Card */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Activo</h2>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label className="text-muted-foreground" htmlFor="active">
                  Sí
                </Label>
                <Switch
                  id="active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
