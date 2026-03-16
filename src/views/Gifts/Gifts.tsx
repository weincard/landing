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
import type { IGift } from "@/data/interfaces/gift.interface";
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
import { useGifts } from "@/modules/gifts/domain/hooks/use-gifts";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface GiftsViewProps {
  token: string;
}

export function GiftsView({ token }: GiftsViewProps) {
  const { getAllGifts, deleteGift, updateGift } = useGifts();
  const [gifts, setGifts] = useState<IGift[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedGifts, setSelectedGifts] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [giftToDelete, setGiftToDelete] = useState<IGift | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const totalPages = Math.ceil(totalItems / pageSize);

  const fetchGifts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllGifts(
        token,
        { limit: pageSize, skip: (currentPage - 1) * pageSize },
        {
          search: searchTerm,
          isActive: filterStatus === "active" ? true : filterStatus === "inactive" ? false : undefined
        }
      );

      if (response) {
        setGifts(response.gifts || []);
        setTotalItems(response.count || 0);
      }
    } catch (error) {
      console.error("Error fetching gifts:", error);
      toast.error("Error al cargar los regalos");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchTerm, filterStatus, getAllGifts, token]);

  useEffect(() => {
    fetchGifts();
  }, [fetchGifts]);

  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

  const handleSearch = useCallback(() => {
    setCurrentPage(1);
    fetchGifts();
  }, [fetchGifts]);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  }, []);

  const handleDeleteClick = (gift: IGift) => {
    setGiftToDelete(gift);
  };

  const handleConfirmDelete = async () => {
    const idToDelete = giftToDelete?.id || giftToDelete?.giftId;
    if (!idToDelete) return;

    setIsDeleting(true);
    try {
      const response = await deleteGift(idToDelete, token);
      if (response) {
        toast.success(response.message || "Regalo eliminado exitosamente");
        setGiftToDelete(null);
        fetchGifts();
      }
    } catch (error: any) {
      toast.error(error?.message || "Error al eliminar el regalo");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (gift: IGift, isActive: boolean) => {
    const idToUpdate = gift.id || gift.giftId;
    if (!idToUpdate) return;

    try {
      const response = await updateGift(idToUpdate, { isActive }, token);
      if (response) {
        toast.success("Estado actualizado correctamente");
        fetchGifts();
      }
    } catch (error: any) {
      toast.error(error?.message || "Error al actualizar el estado");
    }
  };

  const handleCancelDelete = () => {
    setGiftToDelete(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Regalos</h1>
        <Button>
          <Link href="/dashboard/gifts/create">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Crear nuevo regalo
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
                        selectedGifts.length === gifts.length &&
                        gifts.length > 0
                      }
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedGifts(
                            gifts.map((gift) => gift.giftId || 0)
                          );
                        } else {
                          setSelectedGifts([]);
                        }
                      }}
                      disabled={loading || gifts.length === 0}
                    />
                  </TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Cantidad</TableHead>
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
                        Cargando regalos...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : gifts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-gray-500"
                    >
                      No se encontraron regalos
                    </TableCell>
                  </TableRow>
                ) : (
                  gifts.map((gift) => {
                    const id = gift.id || gift.giftId;
                    return (
                      <TableRow key={id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedGifts.includes(id || 0)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedGifts([...selectedGifts, id || 0]);
                              } else {
                                setSelectedGifts(
                                  selectedGifts.filter((sid) => sid !== id)
                                );
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {gift.name}
                        </TableCell>
                        <TableCell className="text-gray-600 max-w-xs truncate">
                          {gift.description}
                        </TableCell>
                        <TableCell>{gift.totalQuantity || gift.quantity || 0}</TableCell>
                        <TableCell>
                          <Select
                            value={gift.isActive ? "si" : "no"}
                            onValueChange={(value) => handleStatusChange(gift, value === "si")}
                          >
                            <SelectTrigger
                              className={`w-[90px] h-8 px-3 py-1 text-sm font-medium ${gift.isActive
                                ? "bg-purple-600 text-white border-purple-600 hover:bg-purple-700 [&>svg]:text-white"
                                : "bg-red-500 text-white border-red-500 hover:bg-red-600 [&>svg]:text-white"
                                }`}
                            >
                              <SelectValue className="text-white" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="si">Sí</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>{gift.totalRedemptions || gift.redemptionsCount || 0}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Link
                                href={`/dashboard/gifts/${id}/edit`}
                              >
                                <Pencil className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteClick(gift)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">
              Mostrando
              {gifts.length === 0
                ? " 0 "
                : ` ${1} - ${gifts.length} `}de {totalItems} regalos
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
        open={!!giftToDelete}
        onOpenChange={(open) => !open && handleCancelDelete()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente
              el regalo{" "}
              <span className="font-semibold">{giftToDelete?.name}</span> de
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
