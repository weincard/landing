"use client";

import { useState, useCallback, useEffect } from "react";
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
import { Star, Upload, MapPin, X, Loader2, Plus } from "lucide-react";
import Image from "next/image";
import { useBranches } from "@/modules/branches/domain/hooks/use-branches";
import { useMerchants } from "@/modules/merchants/domain/hooks/use-merchants";
import { useCategories } from "@/modules/categories/domain/hooks/use-categories";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { IBranch } from "@/data/interfaces/merchant.interface";
import type { ICategoria } from "@/data/interfaces/interfaces.interface";
import { CreateOrEditCategoryModal } from "./CreateOrEditCategoryModal";

interface CreateOrEditBranchProps {
  token: string;
  branchId?: string;
}

export function CreateOrEditBranch({
  token,
  branchId,
}: CreateOrEditBranchProps) {
  const router = useRouter();
  const {
    createBranch,
    getOneBranch,
    updateBranch,
    loading: branchLoading,
  } = useBranches();
  const { getAllMerchants, loading: merchantsLoading } = useMerchants();
  const { getAllCategories } = useCategories();

  // Form fields - Required
  const [merchantId, setMerchantId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Form fields - Optional
  const [description, setDescription] = useState("");
  const [howItWorks, setHowItWorks] = useState("");
  const [website, setWebsite] = useState("");
  const [note, setNote] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Files and images
  const [logo, setLogo] = useState<string>("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);

  // UI state
  const [rating, setRating] = useState(4.5);
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

  // Merchants list
  const [merchants, setMerchants] = useState<any[]>([]);
  const [categories, setCategories] = useState<ICategoria[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Category modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<
    number | undefined
  >(undefined);

  // Load merchants for dropdown
  useEffect(() => {
    const fetchMerchants = async () => {
      const response = await getAllMerchants(token, { skip: 0, limit: 100 });
      if (response && response.merchants) {
        setMerchants(response.merchants);
      }
    };

    fetchMerchants();
  }, [token, getAllMerchants]);

  // Load categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const categoriesList = await getAllCategories();
        setCategories(categoriesList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [getAllCategories]);

  const handleOpenCategoryModal = (categoryId?: number) => {
    setEditingCategoryId(categoryId);
    setIsCategoryModalOpen(true);
  };

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setEditingCategoryId(undefined);
  };

  const handleCategorySuccess = async () => {
    // Reload categories after creating/editing
    try {
      const categoriesList = await getAllCategories();
      setCategories(categoriesList);
    } catch (error) {
      console.error("Error reloading categories:", error);
    }
  };

  // Load branch data if editing
  useEffect(() => {
    if (branchId) {
      const loadBranch = async () => {
        const response = await getOneBranch(Number(branchId), token);
        if (response && response.branch) {
          const branch = response.branch;
          setMerchantId(branch.merchantId?.toString() || "");
          setCategoryId(branch.category?.categoryId?.toString() || "");
          setName(branch.name || "");
          setAddress(branch.address || "");
          setCity(branch.city || "");
          setCountry(branch.country || "");
          setPhone(branch.phone || "");
          setEmail(branch.email || "");
          setDescription(branch.description || "");
          setHowItWorks(branch.howItWorks || "");
          setWebsite(branch.website || "");
          setNote(branch.note || "");
          setIsActive(branch.isActive ?? true);
          if (branch.logoUrl) setLogo(branch.logoUrl);
        }
      };

      loadBranch();
    }
  }, [branchId, token, getOneBranch]);

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
        setLogoFile(file);
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

  const handleSave = async () => {
    // Validación de campos requeridos
    if (!merchantId) {
      toast.error("Por favor selecciona un aliado");
      return;
    }
    if (!categoryId) {
      toast.error("Por favor selecciona una categoría");
      return;
    }
    if (!name) {
      toast.error("El nombre es requerido");
      return;
    }
    if (!address) {
      toast.error("La dirección es requerida");
      return;
    }
    if (!city) {
      toast.error("La ciudad es requerida");
      return;
    }
    if (!country) {
      toast.error("El país es requerido");
      return;
    }
    if (!phone) {
      toast.error("El teléfono es requerido");
      return;
    }
    if (!email) {
      toast.error("El correo electrónico es requerido");
      return;
    }

    const branchData: Partial<IBranch> = {
      merchantId: Number(merchantId),
      categoryId: Number(categoryId),
      name,
      address,
      city,
      country,
      phone,
      email,
      description,
      howItWorks,
      website,
      note,
      isActive,
    };

    try {
      let response;
      if (branchId) {
        // Update existing branch
        response = await updateBranch(
          Number(branchId),
          branchData,
          logoFile || undefined,
          token
        );
      } else {
        // Create new branch
        response = await createBranch(branchData, logoFile || undefined, token);
      }

      if (response) {
        toast.success(
          response.message || branchId
            ? "Sucursal actualizada exitosamente"
            : "Sucursal creada exitosamente"
        );
        router.push("/dashboard/branches");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error al guardar la sucursal");
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/branches");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {branchId ? "Editar sucursal" : "Agregar sucursal"}
        </h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={branchLoading}
          >
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={branchLoading}>
            {branchLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar"
            )}
          </Button>
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
                    Nombre de la sucursal *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Kielo Sushi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    onChange={(e) => setPhone(e.target.value)}
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
                    onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground" htmlFor="howItWorks">
                  ¿Cómo funciona la redención?
                </Label>
                <Textarea
                  id="howItWorks"
                  placeholder="Como funciona la redención en esta sucursal"
                  rows={3}
                  value={howItWorks}
                  onChange={(e) => setHowItWorks(e.target.value)}
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
              <h2 className="text-lg font-semibold">Categoría *</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={categoryId}
                onValueChange={setCategoryId}
                disabled={loadingCategories}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.idCategoria}
                      value={category.idCategoria.toString()}
                    >
                      {category.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenCategoryModal()}
                disabled={loadingCategories}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear nueva categoría
              </Button>
            </CardContent>
          </Card>

          {/* Address Card */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Dirección *</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground" htmlFor="address">
                  Dirección
                </Label>
                <Input
                  id="address"
                  placeholder="Cra. 35 #58-35"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground" htmlFor="city">
                    Ciudad
                  </Label>
                  <Input
                    id="city"
                    placeholder="Medellín"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground" htmlFor="country">
                    País
                  </Label>
                  <Input
                    id="country"
                    placeholder="Colombia"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground" htmlFor="website">
                  Sitio Web (opcional)
                </Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://ejemplo.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notes Card */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Nota</h2>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Nota"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
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
              <h2 className="text-lg font-semibold">Aliado *</h2>
            </CardHeader>
            <CardContent>
              <Select
                value={merchantId}
                onValueChange={setMerchantId}
                disabled={merchantsLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un aliado" />
                </SelectTrigger>
                <SelectContent>
                  {merchants.map((merchant) => (
                    <SelectItem
                      key={merchant.merchantId}
                      value={merchant.merchantId?.toString() || ""}
                    >
                      {merchant.name}
                    </SelectItem>
                  ))}
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

      {/* Category Modal */}
      <CreateOrEditCategoryModal
        token={token}
        isOpen={isCategoryModalOpen}
        onClose={handleCloseCategoryModal}
        onSuccess={handleCategorySuccess}
        categoryId={editingCategoryId}
        allCategories={categories}
      />
    </div>
  );
}
