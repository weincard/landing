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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IMerchant } from "@/data/interfaces/merchant.interface";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Plus, Loader2, Pencil } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useMerchants } from "@/modules/merchants/domain/hooks/use-merchants";

interface AlliesViewProps {
  token: string;
}

export function AlliesView({ token }: AlliesViewProps) {
  const { getAllMerchants } = useMerchants();
  const [merchants, setMerchants] = useState<IMerchant[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAllies, setSelectedAllies] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const totalPages = Math.ceil(totalItems / pageSize);

  const fetchMerchants = useCallback(async () => {
    setLoading(true);
    try {
      const skip = (currentPage - 1) * pageSize;
      const response = await getAllMerchants(
        token,
        {
          skip,
          limit: pageSize,
        },
        searchTerm ? { name: searchTerm } : undefined
      );

      if (response) {
        setMerchants(response.merchants);
        setTotalItems(response.count);
      }
    } catch (error) {
      console.error("Error fetching merchants:", error);
    } finally {
      setLoading(false);
    }
  }, [getAllMerchants, token, currentPage, pageSize, searchTerm]);

  useEffect(() => {
    fetchMerchants();
  }, [fetchMerchants]);

  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

  const handleSearch = useCallback(() => {
    setCurrentPage(1);
    fetchMerchants();
  }, [fetchMerchants]);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Aliados</h1>
        <Button>
          <Link href="/dashboard/allies/create">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Agregar
            </div>
          </Link>
        </Button>
      </div>

      <Card className="mt-4">
        <CardContent className="p-6 space-y-4">
          {/* Tabla */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={
                        selectedAllies.length === merchants.length &&
                        merchants.length > 0
                      }
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedAllies(
                            merchants.map((m) => m.merchantId!)
                          );
                        } else {
                          setSelectedAllies([]);
                        }
                      }}
                      disabled={loading || merchants.length === 0}
                    />
                  </TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Dirección</TableHead>
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
                      colSpan={8}
                      className="text-center py-8 text-gray-500"
                    >
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        Cargando aliados...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : merchants.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-gray-500"
                    >
                      No se encontraron Aliados
                    </TableCell>
                  </TableRow>
                ) : (
                  merchants.map((merchant) => (
                    <TableRow key={merchant.merchantId}>
                      <TableCell>
                        <Checkbox
                          checked={selectedAllies.includes(
                            merchant.merchantId!
                          )}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedAllies([
                                ...selectedAllies,
                                merchant.merchantId!,
                              ]);
                            } else {
                              setSelectedAllies(
                                selectedAllies.filter(
                                  (id) => id !== merchant.merchantId
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
                                merchant.logoUrl ||
                                "/placeholder.svg?height=40&width=40"
                              }
                              alt={merchant.name || ""}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span>{merchant.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {merchant.state}, {merchant.country}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {merchant.description || "-"}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {merchant.merchantUsers?.length || 0}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {merchant.founder ? "Sí" : "No"}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">0</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            asChild
                          >
                            <Link
                              href={`/dashboard/allies/${merchant.merchantId}/edit`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>
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
              {merchants.length === 0
                ? " 0 "
                : ` ${(currentPage - 1) * pageSize + 1} - ${Math.min(
                    currentPage * pageSize,
                    totalItems
                  )} `}
              de {totalItems} aliados
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
    </div>
  );
}
