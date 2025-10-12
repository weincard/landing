"use client";

import { useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  X,
  Trash2,
  Save,
  Camera,
  Image as ImageIcon,
  Search,
} from "lucide-react";
import Image from "next/image";

interface Office {
  id: string;
  name: string;
  address: string;
  city: string;
  redemptions: number;
  total: number;
}

interface CreateOrEditAllyProps {
  allyId?: string;
}

export function CreateOrEditAlly({ allyId }: CreateOrEditAllyProps) {
  const [files, setFiles] = useState<string[]>([]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock de sucursales disponibles (en producción vendría de la API)
  const availableBranches: Office[] = [
    {
      id: "1",
      name: "El cielo sede Medellín",
      address: "Cra. 35 #66-35",
      city: "Medellín Antioquia",
      redemptions: 24,
      total: 35,
    },
    {
      id: "2",
      name: "Kielo sushi Poblado",
      address: "Cra. 43 #1 Sur-25",
      city: "Medellín Antioquia",
      redemptions: 145,
      total: 200,
    },
    {
      id: "3",
      name: "Barbaro Laureles",
      address: "Cra. 70 #44-35",
      city: "Bogotá Colombia",
      redemptions: 34,
      total: 50,
    },
    {
      id: "4",
      name: "Restaurante sede n",
      address: "Calle 10 #5-60",
      city: "Cali Valle",
      redemptions: 23,
      total: 40,
    },
  ];

  const filteredBranches = availableBranches.filter(
    (branch) =>
      !offices.some((office) => office.id === branch.id) &&
      (branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddBranch = (branch: Office) => {
    setOffices([...offices, branch]);
    setSearchTerm("");
  };

  const handleRemoveBranch = (branchId: string) => {
    setOffices(offices.filter((office) => office.id !== branchId));
  };

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64 = reader.result as string;
          setFiles([base64]); // Solo mantenemos una imagen
        };

        reader.readAsDataURL(file);
      }
    },
    []
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Aliado</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Guardar
          </Button>
        </div>
      </div>

      {/* Ally Information Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-6">
            <div className="relative group">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-border">
                {files[0] ? (
                  <Image
                    src={files[0]}
                    alt="Ally avatar"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 cursor-pointer rounded-full transition-opacity"
                >
                  <Camera className="h-8 w-8 text-white" />
                </label>
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm text-muted-foreground"
                  >
                    Nombre
                  </label>
                  <Input id="name" placeholder="Nombre del aliado" />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="description"
                    className="text-sm text-muted-foreground"
                  >
                    Descripción
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Descripción del aliado"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="owner"
                    className="text-sm text-muted-foreground"
                  >
                    Propietario
                  </label>
                  <Input id="owner" placeholder="Nombre del propietario" />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="address"
                    className="text-sm text-muted-foreground"
                  >
                    Dirección Principal
                  </label>
                  <Input id="address" placeholder="Dirección principal" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Offices Card */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Sucursales</h2>
            <Button onClick={() => setIsDrawerOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Sucursal
            </Button>
          </div>

          {/* Offices Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Ciudad</TableHead>
                  <TableHead>Redenciones</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offices.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-gray-500"
                    >
                      No hay sucursales agregadas
                    </TableCell>
                  </TableRow>
                ) : (
                  offices.map((office) => (
                    <TableRow key={office.id}>
                      <TableCell className="font-medium">
                        {office.name}
                      </TableCell>
                      <TableCell>{office.address}</TableCell>
                      <TableCell>{office.city}</TableCell>
                      <TableCell>{office.redemptions}</TableCell>
                      <TableCell>{office.total}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveBranch(office.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Drawer para buscar y agregar sucursales */}
      <Dialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Buscar Sucursales</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, dirección o ciudad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Results List */}
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {filteredBranches.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm
                    ? "No se encontraron sucursales"
                    : "Todas las sucursales ya fueron agregadas"}
                </div>
              ) : (
                filteredBranches.map((branch) => (
                  <div
                    key={branch.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{branch.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {branch.address} - {branch.city}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Redenciones: {branch.redemptions} / Total:{" "}
                        {branch.total}
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        handleAddBranch(branch);
                      }}
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Agregar
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
