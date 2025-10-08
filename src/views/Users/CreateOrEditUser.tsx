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
import { Plus, X, Save, Camera, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface Office {
  name: string;
  address: string;
  redemptions: number;
  total: number;
}

interface CreateOrEditUserProps {
  allyId?: string;
}

export function CreateOrEditUser({ allyId }: CreateOrEditUserProps) {
  const [files, setFiles] = useState<string[]>([]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [newOffice, setNewOffice] = useState<Office>({
    name: "",
    address: "",
    redemptions: 0,
    total: 0,
  });

  const handleAddOffice = () => {
    if (newOffice.name && newOffice.address) {
      setOffices([...offices, newOffice]);
      setNewOffice({
        name: "",
        address: "",
        redemptions: 0,
        total: 0,
      });
    }
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
            <Button onClick={handleAddOffice}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Sucursal
            </Button>
          </div>

          {/* Add Office Form */}
          <div className="grid grid-cols-4 gap-4">
            <Input
              placeholder="Nombre de la sucursal"
              value={newOffice.name}
              onChange={(e) =>
                setNewOffice({ ...newOffice, name: e.target.value })
              }
            />
            <Input
              placeholder="Dirección"
              value={newOffice.address}
              onChange={(e) =>
                setNewOffice({ ...newOffice, address: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Redenciones"
              value={newOffice.redemptions || ""}
              onChange={(e) =>
                setNewOffice({
                  ...newOffice,
                  redemptions: parseInt(e.target.value) || 0,
                })
              }
            />
            <Input
              type="number"
              placeholder="Total"
              value={newOffice.total || ""}
              onChange={(e) =>
                setNewOffice({
                  ...newOffice,
                  total: parseInt(e.target.value) || 0,
                })
              }
            />
          </div>

          {/* Offices Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Redenciones</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offices.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-gray-500"
                    >
                      No hay sucursales agregadas
                    </TableCell>
                  </TableRow>
                ) : (
                  offices.map((office, index) => (
                    <TableRow key={index}>
                      <TableCell>{office.name}</TableCell>
                      <TableCell>{office.address}</TableCell>
                      <TableCell>{office.redemptions}</TableCell>
                      <TableCell>{office.total}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
