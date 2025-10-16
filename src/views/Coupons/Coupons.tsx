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
import type { ICoupon } from "@/data/interfaces/coupon.interface";
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
import { useCoupons } from "@/modules/coupons/domain/hooks/use-coupons";
import { toast } from "sonner";

interface CouponsViewProps {
  token: string;
}

export function CouponsView({ token }: CouponsViewProps) {
  const { getAllCoupons, deleteCoupon } = useCoupons();
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedCoupons, setSelectedCoupons] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [couponToDelete, setCouponToDelete] = useState<ICoupon | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const totalPages = Math.ceil(totalItems / pageSize);

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const skip = (currentPage - 1) * pageSize;
      const filters: { name?: string; isActive?: boolean } = {};

      if (searchTerm) {
        filters.name = searchTerm;
      }

      if (filterStatus === "active") {
        filters.isActive = true;
      } else if (filterStatus === "inactive") {
        filters.isActive = false;
      }

      const response = await getAllCoupons(
        token,
        { skip, limit: pageSize },
        filters
      );

      if (response) {
        setCoupons(response.coupons);
        setTotalItems(response.count);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  }, [getAllCoupons, token, currentPage, pageSize, searchTerm, filterStatus]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

  const handleSearch = useCallback(() => {
    setCurrentPage(1);
    fetchCoupons();
  }, [fetchCoupons]);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  }, []);

  const handleDeleteClick = (coupon: ICoupon) => {
    setCouponToDelete(coupon);
  };

  const handleConfirmDelete = async () => {
    if (!couponToDelete) return;

    setIsDeleting(true);
    try {
      const response = await deleteCoupon(couponToDelete.couponId || 0, token);
      if (response) {
        toast.success(response.message || "Cupón eliminado exitosamente");
        setCouponToDelete(null);
        fetchCoupons();
      }
    } catch (error: any) {
      toast.error(error?.message || "Error al eliminar el cupón");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setCouponToDelete(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Cupones</h1>
        <Button>
          <Link href="/dashboard/coupons/create">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Agregar
            </div>
          </Link>
        </Button>
      </div>

      <Card className="mt-4">
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-full md:w-48">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
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

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={
                        selectedCoupons.length === coupons.length &&
                        coupons.length > 0
                      }
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCoupons(
                            coupons.map((coupon) => coupon.couponId || 0)
                          );
                        } else {
                          setSelectedCoupons([]);
                        }
                      }}
                      disabled={loading || coupons.length === 0}
                    />
                  </TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Sucursales</TableHead>
                  <TableHead>Activo</TableHead>
                  <TableHead>Redenciones</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-gray-500"
                    >
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        Cargando cupones...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : coupons.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-gray-500"
                    >
                      No se encontraron cupones
                    </TableCell>
                  </TableRow>
                ) : (
                  coupons.map((coupon) => (
                    <TableRow key={coupon.couponId}>
                      <TableCell>
                        <Checkbox
                          checked={selectedCoupons.includes(
                            coupon.couponId || 0
                          )}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCoupons([
                                ...selectedCoupons,
                                coupon.couponId || 0,
                              ]);
                            } else {
                              setSelectedCoupons(
                                selectedCoupons.filter(
                                  (id) => id !== coupon.couponId
                                )
                              );
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {coupon.name}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {coupon.description}
                      </TableCell>
                      <TableCell>{coupon.branches?.length || 0}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                            coupon.isActive
                              ? "bg-purple-600 text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {coupon.isActive ? "Sí" : "No"}
                        </span>
                      </TableCell>
                      <TableCell>{coupon.redemptionsCount || 0}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Link
                              href={`/dashboard/coupons/${coupon.couponId}/edit`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteClick(coupon)}
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

          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">
              Mostrando
              {coupons.length === 0 ? " 0 " : ` ${1} - ${coupons.length} `}de{" "}
              {totalItems} cupones
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

      <AlertDialog
        open={!!couponToDelete}
        onOpenChange={(open) => !open && handleCancelDelete()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente
              el cupón{" "}
              <span className="font-semibold">{couponToDelete?.name}</span> de
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
