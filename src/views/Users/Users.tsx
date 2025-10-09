"use client";

import { useState, useCallback, useEffect } from "react";
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
import type { IUser, UserRole } from "@/data/interfaces/user.interface";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Loader2,
  Search,
  User,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useUsers } from "@/modules/users/domain/hooks/use-users";

interface UsersViewProps {
  token: string;
}

export default function UsersView({ token }: UsersViewProps) {
  const { getAllUsers, loading, error } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("client");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [users, setUsers] = useState<IUser[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const fetchUsers = useCallback(async () => {
    if (!token) return;

    const skip = (currentPage - 1) * pageSize;
    const paginationParams = { limit: pageSize, skip };

    const response = await getAllUsers(token, paginationParams, selectedRole);
    if (response) {
      setUsers(response.users || []);
      setTotalCount(response.count || 0);
    }
  }, [currentPage, pageSize, token, selectedRole, getAllUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Lógica para cargar los datos de la página correspondiente
  }, []);

  const handleSearch = useCallback(() => {
    // Resetear a la primera página cuando se hace una búsqueda
    setCurrentPage(1);
    // La búsqueda se manejará automáticamente con el useEffect
    console.log("Buscar:", searchTerm);
  }, [searchTerm]);

  const handleRoleChange = useCallback((role: UserRole) => {
    setSelectedRole(role);
    setCurrentPage(1); // Reset to first page when role changes
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when page size changes
  }, []);

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.phone?.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Usuarios</h1>
        <Button>
          <Link href="/dashboard/users/create">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Agregar
            </div>
          </Link>
        </Button>
      </div>

      <Card className="mt-4">
        <CardContent className="p-6 space-y-4">
          {/* Filtros */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mt-4">
            <div className="max-w-[300px] relative bg-card">
              <Input
                placeholder="Buscar usuarios.."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-8 w-full"
              />
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            </div>

            <Select value={selectedRole} onValueChange={handleRoleChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value="superadmin">Super Admin</SelectItem>
                <SelectItem value="owner">Propietario</SelectItem>
                <SelectItem value="manager">Gerente</SelectItem>
                <SelectItem value="staff">Personal</SelectItem>
                <SelectItem value="client">Cliente</SelectItem>
              </SelectContent>
            </Select>

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
                  <TableHead></TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Verificado</TableHead>
                  <TableHead>Fecha Registro</TableHead>
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
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-red-500"
                    >
                      {error}
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-gray-500"
                    >
                      No se encontraron usuarios
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.idUsuario}>
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(user.idUsuario!)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedUsers([
                                ...selectedUsers,
                                user.idUsuario!,
                              ]);
                            } else {
                              setSelectedUsers(
                                selectedUsers.filter(
                                  (id) => id !== user.idUsuario
                                )
                              );
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 relative rounded-full overflow-hidden bg-muted">
                            {/* Avatar placeholder, you can add user.image if available */}
                            <User className="h-6 w-6 text-muted-foreground" />
                          </div>
                          {user.name || user.email}
                        </div>
                      </TableCell>
                      <TableCell>{user.email || "N/A"}</TableCell>
                      <TableCell>{user.phone || "N/A"}</TableCell>
                      <TableCell>
                        <span
                          className={`capitalize ${
                            user.role === "superadmin"
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        >
                          {user.role || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            user.isVerified
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {user.isVerified ? "Sí" : "No"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "N/A"}
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
              Mostrando{" "}
              {filteredUsers.length === 0
                ? "0"
                : `${(currentPage - 1) * pageSize + 1} - ${Math.min(
                    currentPage * pageSize,
                    totalCount
                  )} `}{" "}
              de {totalCount} usuarios
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => handlePageSizeChange(Number(value))}
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
                disabled={currentPage >= totalPages || loading}
                onClick={() => handlePageChange(currentPage + 1)}
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
