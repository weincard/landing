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
import type { IUserProfile } from "@/data/interfaces/interfaces.interface";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
  Loader2,
  Search,
  User,
} from "lucide-react";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
const allies: IUserProfile[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    role: "user",
    verified: true,
    createdAt: new Date("2023-01-15"),
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1987654321",
    role: "admin",
    verified: true,
    createdAt: new Date("2023-02-20"),
  },
  {
    id: 3,
    name: "Bob Wilson",
    email: "bob@example.com",
    phone: "+1122334455",
    role: "user",
    verified: false,
    createdAt: new Date("2023-03-25"),
  },
];

interface UsersViewProps {}

export default function UsersView({}: UsersViewProps) {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
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
        <h1 className="text-xl font-semibold">Redenciones</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            // onClick={handleAddRaza}
          >
            <Plus className="h-4 w-4" />
            Exportar
          </Button>

          <Button
          // onClick={handleAddRaza}
          >
            <Link href="/dashboard/users/create">
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Agregar
              </div>
            </Link>
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mt-4">
        <div className="flex-1 relative bg-card">
          <Input
            placeholder="Buscar usuarios.."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-8 w-full"
          />
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        </div>
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buscar"}
        </Button>
      </div>
      <Card className="mt-4">
        <CardContent className="p-6 space-y-4">
          {/* Tabla */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Verificado</TableHead>
                  <TableHead>Fecha Registro</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-gray-500"
                    >
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        Cargando usuarios...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : allies.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-gray-500"
                    >
                      No se encontraron usuarios
                    </TableCell>
                  </TableRow>
                ) : (
                  allies.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="h-8 w-8 relative rounded-full overflow-hidden bg-muted">
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt={user.name}
                              className="object-cover"
                              fill
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full w-full bg-muted text-muted-foreground text-sm font-medium">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {user.name}
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone || "N/A"}</TableCell>
                      <TableCell>
                        <div className="border px-2 py-1 rounded-md w-max">
                          <span className="text-muted-foreground ">
                            {user.role}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium ${
                            user.verified
                              ? "bg-green-50 text-green-700"
                              : "bg-destructive text-destructive-foreground"
                          }`}
                        >
                          {user.verified ? "Verificado" : "No verificado"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {user.createdAt.toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Link href={`/dashboard/users/${user.id}/edit`}>
                              <div>
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Editar</span>
                              </div>
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Eliminar</span>
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
              de {allies.length} usuarios
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
