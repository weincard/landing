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
import type { IBranch } from "@/data/interfaces/interfaces.interface";
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
import Link from "next/link";

const allies: IBranch[] = [
  {
    branchId: 1,
    name: "Sucursal 1",
    slug: "sucursal-1",
    address: "Dirección 1",
    city: "Ciudad 1",
    country: "País 1",
    logoUrl: "/logo.png",
    isActive: true,
    createdAt: new Date(),
  },
  {
    branchId: 2,
    name: "Sucursal 2",
    slug: "sucursal-2",
    address: "Dirección 2",
    city: "Ciudad 2",
    country: "País 2",
    isActive: false,
    createdAt: new Date(),
  },
  {
    branchId: 3,
    name: "Sucursal 3",
    slug: "sucursal-3",
    address: "Dirección 3",
    city: "Ciudad 3",
    country: "País 3",
    logoUrl: "/logo.png",
    isActive: true,
    createdAt: new Date(),
  },
];

interface BranchesViewProps {}

export function BranchesView({}: BranchesViewProps) {
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
        <h1 className="text-xl font-semibold">Sucursales</h1>
        <Button
        // onClick={handleAddRaza}
        >
          <Link href="/dashboard/branches/create">
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
                          setSelectedAllies(
                            allies.map((ally) => ally.branchId)
                          );
                        } else {
                          setSelectedAllies([]);
                        }
                      }}
                      disabled={loading || allies.length === 0}
                    />
                  </TableHead>
                  <TableHead>Sucursal</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Redenciones</TableHead>
                  <TableHead>Oferta</TableHead>
                  <TableHead>Activo</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-8 text-gray-500"
                    >
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        Cargando sucursales...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : allies.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-8 text-gray-500"
                    >
                      No se encontraron sucursales
                    </TableCell>
                  </TableRow>
                ) : (
                  allies.map((ally) => (
                    <TableRow key={ally.branchId}>
                      <TableCell>
                        <Checkbox
                          checked={selectedAllies.includes(ally.branchId)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedAllies([
                                ...selectedAllies,
                                ally.branchId,
                              ]);
                            } else {
                              setSelectedAllies(
                                selectedAllies.filter(
                                  (id) => id !== ally.branchId
                                )
                              );
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 relative rounded-md overflow-hidden bg-muted flex items-center justify-center">
                            {ally.logoUrl ? (
                              <Image
                                src={ally.logoUrl}
                                alt={ally.name || ""}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-xs font-bold text-muted-foreground">
                                {ally.name?.substring(0, 2).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium">{ally.name}</span>
                            <span className="font-light text-sm text-muted-foreground">
                              {ally.slug}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{ally.city || "N/A"}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
                          Temático
                        </span>
                      </TableCell>
                      <TableCell>24</TableCell>
                      <TableCell>2x1</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-purple-600 px-3 py-1 text-xs font-medium text-white">
                          Sí
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Link
                              href={`/dashboard/branches/${ally.branchId}/edit`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
