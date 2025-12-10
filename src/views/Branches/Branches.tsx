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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { IBranch } from "@/data/interfaces/merchant.interface";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
  Loader2,
  Search,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useBranches } from "@/modules/branches/domain/hooks/use-branches";
import { useMerchants } from "@/modules/merchants/domain/hooks/use-merchants";
import type { IMerchant } from "@/data/interfaces/merchant.interface";
import { toast } from "sonner";

interface BranchesViewProps {
  token: string;
}

export function BranchesView({ token }: BranchesViewProps) {
  const { getAllBranches, deleteBranch } = useBranches();
  const { getAllMerchants } = useMerchants();
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [merchants, setMerchants] = useState<IMerchant[]>([]);
  const [loadingMerchants, setLoadingMerchants] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>("all");
  const [selectedBranches, setSelectedBranches] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Delete confirmation modal state
  const [branchToDelete, setBranchToDelete] = useState<IBranch | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const totalPages = Math.ceil(totalItems / pageSize);

  // Fetch all merchants for filter
  useEffect(() => {
    const fetchMerchants = async () => {
      setLoadingMerchants(true);
      try {
        // Cargar TODOS los sucursales sin límite
        const response = await getAllMerchants(token, { skip: 0, limit: 1000 });
        const merchantsList = response?.merchants || [];
        setMerchants(merchantsList);
      } catch (error) {
        console.error("Error fetching merchants:", error);
      } finally {
        setLoadingMerchants(false);
      }
    };

    fetchMerchants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAllMerchants, token]);

  const fetchBranches = useCallback(async () => {
    setLoading(true);

    try {
      const skip = (currentPage - 1) * pageSize;

      // If "all" is selected, pass undefined for merchantId to get all branches
      // Otherwise, pass the specific merchantId
      const merchantIdFilter =
        selectedMerchantId === "all" ? undefined : Number(selectedMerchantId);

      const response = await getAllBranches(
        merchantIdFilter,
        token,
        {
          skip,
          limit: pageSize,
        },
        searchTerm ? { name: searchTerm } : undefined
      );

      if (response) {
        setBranches(response.branches);
        setTotalItems(response.count);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
      setBranches([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [
    getAllBranches,
    token,
    currentPage,
    pageSize,
    searchTerm,
    selectedMerchantId,
  ]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

  const handleSearch = useCallback(() => {
    setCurrentPage(1);
    fetchBranches();
  }, [fetchBranches]);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  }, []);

  const handleDeleteClick = (branch: IBranch) => {
    setBranchToDelete(branch);
  };

  const handleConfirmDelete = async () => {
    if (!branchToDelete) return;

    setIsDeleting(true);
    try {
      const response = await deleteBranch(branchToDelete.branchId || 0, token);
      if (response) {
        toast.success(response.message || "Sucursal eliminada exitosamente");
        setBranchToDelete(null);
        // Recargar la lista de sucursales
        fetchBranches();
      }
    } catch (error: any) {
      toast.error(error?.message || "Error al eliminar la sucursal");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setBranchToDelete(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Sucursales</h1>
        <Button>
          <Link href="/dashboard/branches/create">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Agregar
            </div>
          </Link>
        </Button>
      </div>

      {/* Loading merchants */}
      {loadingMerchants ? (
        <Card className="mt-4">
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Cargando sucursales...</p>
            </div>
          </CardContent>
        </Card>
      ) : merchants.length === 0 ? (
        /* No merchants available */
        <Card className="mt-4">
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <div className="rounded-full bg-muted p-3">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">
                  No hay sucursales disponibles
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Para crear sucursales, primero debes crear al menos un aliado.
                </p>
              </div>
              <Button asChild>
                <Link href="/dashboard/allies/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear aliado
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Normal view with filters and table */
        <Card className="mt-4">
          <CardContent className="p-6 space-y-4">
            {/* Filtros */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="w-full md:w-64">
                <Select
                  value={selectedMerchantId}
                  onValueChange={(value) => {
                    setSelectedMerchantId(value);
                    setCurrentPage(1);
                  }}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un aliado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los Aliados</SelectItem>
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
                          selectedBranches.length === branches.length &&
                          branches.length > 0
                        }
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedBranches(
                              branches.map((branch) => branch.branchId || 0)
                            );
                          } else {
                            setSelectedBranches([]);
                          }
                        }}
                        disabled={loading || branches.length === 0}
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
                  ) : branches.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="text-center py-8 text-gray-500"
                      >
                        No se encontraron sucursales
                      </TableCell>
                    </TableRow>
                  ) : (
                    branches.map((branch) => (
                      <TableRow key={branch.branchId}>
                        <TableCell>
                          <Checkbox
                            checked={selectedBranches.includes(
                              branch.branchId || 0
                            )}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedBranches([
                                  ...selectedBranches,
                                  branch.branchId || 0,
                                ]);
                              } else {
                                setSelectedBranches(
                                  selectedBranches.filter(
                                    (id) => id !== branch.branchId
                                  )
                                );
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 relative rounded-md overflow-hidden bg-muted flex items-center justify-center">
                              {branch.logoUrl ? (
                                <Image
                                  src={branch.logoUrl}
                                  alt={branch.name || ""}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <span className="text-xs font-bold text-muted-foreground">
                                  {branch.name?.substring(0, 2).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium">{branch.name}</span>
                              <span className="font-light text-sm text-muted-foreground">
                                {branch.slug}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{branch.city || "N/A"}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
                            {branch.category?.name || "Sin categoría"}
                          </span>
                        </TableCell>
                        <TableCell>{branch.redemptionsCount ?? 0}</TableCell>
                        <TableCell>
                          {branch.offers && branch.offers.length > 0
                            ? (() => {
                                switch (branch.offers[0].offerType) {
                                  case "percentage":
                                    return "% Descuento";
                                  case "fixed_amount":
                                    return "$ Descuento";
                                  case "promo":
                                    return "Promoción";
                                  case "menu_weincard":
                                    return "Menú weincard";
                                  default:
                                    return branch.offers[0].offerType;
                                }
                              })()
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                              branch.isActive
                                ? "bg-purple-600 text-white"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {branch.isActive ? "Sí" : "No"}
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
                                href={`/dashboard/branches/${branch.branchId}/edit`}
                              >
                                <Pencil className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteClick(branch)}
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
                {branches.length === 0 ? " 0 " : ` ${1} - ${branches.length} `}
                de {totalItems} sucursales
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
      )}

      {/* Delete Confirmation Modal */}
      <AlertDialog
        open={!!branchToDelete}
        onOpenChange={(open) => !open && handleCancelDelete()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente
              la sucursal{" "}
              <span className="font-semibold">{branchToDelete?.name}</span> de
              nuestros servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleCancelDelete}
              disabled={isDeleting}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
