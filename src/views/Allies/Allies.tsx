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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  IAlly,
  IEspecie,
  IRaza,
} from "@/data/interfaces/interfaces.interface";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
  Loader2,
  Search,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/router";
import Link from "next/link";

const allies: IAlly[] = [
  {
    idAlly: 1,
    name: "Aliado 1",
    description: "Descripción del aliado 1",
    image: "/ally1.jpg",
    address: "Dirección del aliado 1",
    isActive: true,
    office: "Sucursal 1",
    redemptions: 10,
  },
];

interface AlliesViewProps {}

export function AlliesView({}: AlliesViewProps) {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAllies, setSelectedAllies] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(allies.length / pageSize);

  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Lógica para cargar los datos de la página correspondiente
  }, []);

  const handleSearch = useCallback(() => {
    // Lógica de búsqueda aquí
    console.log("Buscar:", searchTerm);
  }, [searchTerm]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Aliados</h1>
        <Button
        // onClick={handleAddRaza}
        >
          <Link href="/dashboard/allies/create">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-white hover:bg-primary/90"></div>
              <Plus className="h-4 w-4" />
              Agregar
            </div>
          </Link>
        </Button>
      </div>

      <Card className="mt-4">
        <CardContent className="p-6 space-y-4">
          {/* Filtros */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-full md:w-64">
              <Select
              // value={selectedSpecieId}
              // onValueChange={handleSpeciesChange}
              // disabled={loading || species.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtro" />
                </SelectTrigger>
                <SelectContent>{/*  */}</SelectContent>
              </Select>
            </div>

            <div className="flex-1 relative max-w-xs">
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-8 w-full"
              />
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Buscar"
              )}
            </Button>
            <div className="flex gap-2 ml-auto">
              <Button
                disabled={selectedAllies.length === 0}
                variant="outline"
                className="text-primary"
                size="icon"
              >
                <Link href={`/dashboard/allies/${selectedAllies[0]}/edit`}>
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Editar</span>
                </Link>
              </Button>
              <Button
                disabled={selectedAllies.length === 0}
                variant="outline"
                className="text-primary"
                size="icon"
                // onClick={() => handleDeleteClick(raza)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Eliminar</span>
              </Button>
            </div>
          </div>

          {/* Tabla */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={
                        selectedAllies.length === allies.length &&
                        allies.length > 0
                      }
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedAllies(allies.map((ally) => ally.idAlly));
                        } else {
                          setSelectedAllies([]);
                        }
                      }}
                      disabled={loading || allies.length === 0}
                    />
                  </TableHead>
                  {/* <TableHead>ID</TableHead> */}
                  <TableHead>Nombre</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Sucursales</TableHead>
                  <TableHead>Activo</TableHead>
                  <TableHead>Redenciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-gray-500"
                    >
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        Cargando Allies...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : allies.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-gray-500"
                    >
                      No se encontraron Allies para esta especie
                    </TableCell>
                  </TableRow>
                ) : (
                  allies.map((ally) => (
                    <TableRow key={ally.idAlly}>
                      <TableCell>
                        <Checkbox
                          checked={selectedAllies.includes(ally.idAlly)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedAllies([
                                ...selectedAllies,
                                ally.idAlly,
                              ]);
                            } else {
                              setSelectedAllies(
                                selectedAllies.filter(
                                  (id) => id !== ally.idAlly
                                )
                              );
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-10 w-10 relative rounded-md overflow-hidden">
                            <Image
                              src={
                                ally.image ||
                                "/placeholder.svg?height=40&width=40"
                              }
                              alt={ally.name?.toString() || ""}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span>{ally.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {ally.address}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {ally.description}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {ally.office}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {ally.isActive ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {ally.redemptions}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginación */}
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">
              Mostrando
              {allies.length === 0 ? " 0 " : ` ${1} - ${allies.length} `}
              de {allies.length} aliados
            </div>
            <div className="flex items-center gap-2">
              <Select
              // value={pageSize.toString()}
              // onValueChange={(value) => handlePageSizeChange(Number(value))}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="10 por página" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 por página</SelectItem>
                  <SelectItem value="10">10 por página</SelectItem>
                  <SelectItem value="20">20 por página</SelectItem>
                  <SelectItem value="50">50 por página</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                disabled={currentPage <= 1 || loading}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>

              {totalPages <= 5 ? (
                // Show all pages if 5 or fewer
                Array.from({ length: totalPages }, (_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <Button
                      key={pageNumber}
                      variant={
                        pageNumber === currentPage ? "default" : "outline"
                      }
                      onClick={() => handlePageChange(pageNumber)}
                      className="w-10 h-10 p-0"
                      disabled={loading}
                    >
                      {pageNumber}
                    </Button>
                  );
                })
              ) : (
                // Show pagination with ellipsis for many pages
                <>
                  {currentPage > 2 && (
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(1)}
                      className="w-10 h-10 p-0"
                      disabled={loading}
                    >
                      1
                    </Button>
                  )}

                  {currentPage > 3 && <span className="mx-1">...</span>}

                  {currentPage > 1 && (
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="w-10 h-10 p-0"
                      disabled={loading}
                    >
                      {currentPage - 1}
                    </Button>
                  )}

                  <Button
                    variant="default"
                    className="w-10 h-10 p-0"
                    disabled={loading}
                  >
                    {currentPage}
                  </Button>

                  {currentPage < totalPages && (
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="w-10 h-10 p-0"
                      disabled={loading}
                    >
                      {currentPage + 1}
                    </Button>
                  )}

                  {currentPage < totalPages - 2 && (
                    <span className="mx-1">...</span>
                  )}

                  {currentPage < totalPages - 1 && (
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(totalPages)}
                      className="w-10 h-10 p-0"
                      disabled={loading}
                    >
                      {totalPages}
                    </Button>
                  )}
                </>
              )}

              <Button
                variant="outline"
                // disabled={currentPage >= totalPages || loading}
                // onClick={() => handlePageChange(currentPage + 1)}
              >
                Siguiente
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
