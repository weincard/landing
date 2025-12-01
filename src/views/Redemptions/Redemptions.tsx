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
import type { IRedemption } from "@/modules/redemptions/data/interfaces/redemptions.response.interface";
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
import { useRedemptions } from "@/modules/redemptions/domain/hooks/use-redemptions";

interface RedemptionsViewProps {
  token: string;
}

export default function RedemptionsView({ token }: RedemptionsViewProps) {
  const { getAllRedemptions, loading } = useRedemptions();

  const [redemptions, setRedemptions] = useState<IRedemption[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedRedemptions, setSelectedRedemptions] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [branchIdFilter, setBranchIdFilter] = useState<string>("");
  const [userIdFilter, setUserIdFilter] = useState<string>("");

  const totalPages = Math.ceil(totalCount / pageSize);

  const fetchRedemptions = useCallback(async () => {
    const skip = (currentPage - 1) * pageSize;

    const filters: { branchId?: number | null; userId?: number | null } = {};

    if (branchIdFilter) {
      filters.branchId = parseInt(branchIdFilter) || null;
    }

    if (userIdFilter) {
      filters.userId = parseInt(userIdFilter) || null;
    }

    const response = await getAllRedemptions(
      token,
      { limit: pageSize, skip },
      filters
    );

    if (response) {
      setRedemptions(response.redemptions);
      setTotalCount(response.count);
    }
  }, [
    getAllRedemptions,
    token,
    currentPage,
    pageSize,
    branchIdFilter,
    userIdFilter,
  ]);

  useEffect(() => {
    fetchRedemptions();
  }, [fetchRedemptions]);

  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

  const handlePageSizeChange = useCallback((value: number) => {
    setPageSize(value);
    setCurrentPage(1);
  }, []);

  const handleSearch = useCallback(() => {
    setCurrentPage(1);
    fetchRedemptions();
  }, [fetchRedemptions]);

  return (
    <div>
      {/* Header */}
      <h1 className="text-xl font-semibold">Redenciones</h1>

      <Card className="mt-4">
        <CardContent className="p-6 space-y-4">
          {/* Filtros */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-full md:w-64">
              <Input
                placeholder="ID de Sucursal"
                value={branchIdFilter}
                onChange={(e) => setBranchIdFilter(e.target.value)}
                type="number"
                className="w-full"
              />
            </div>

            <div className="w-full md:w-64">
              <Input
                placeholder="ID de Usuario"
                value={userIdFilter}
                onChange={(e) => setUserIdFilter(e.target.value)}
                type="number"
                className="w-full"
              />
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
                        selectedRedemptions.length === redemptions.length &&
                        redemptions.length > 0
                      }
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedRedemptions(
                            redemptions.map(
                              (redemption) => redemption.redemptionId
                            )
                          );
                        } else {
                          setSelectedRedemptions([]);
                        }
                      }}
                      disabled={loading || redemptions.length === 0}
                    />
                  </TableHead>
                  {/* <TableHead>ID</TableHead> */}
                  <TableHead>Pedido</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Aliado</TableHead>
                  <TableHead>Sucursal</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Ahorro</TableHead>
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
                        Cargando redenciones...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : redemptions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-gray-500"
                    >
                      No se encontraron redenciones
                    </TableCell>
                  </TableRow>
                ) : (
                  redemptions.map((redemption) => (
                    <TableRow key={redemption.redemptionId}>
                      <TableCell>
                        <Checkbox
                          checked={selectedRedemptions.includes(
                            redemption.redemptionId
                          )}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedRedemptions([
                                ...selectedRedemptions,
                                redemption.redemptionId,
                              ]);
                            } else {
                              setSelectedRedemptions(
                                selectedRedemptions.filter(
                                  (id) => id !== redemption.redemptionId
                                )
                              );
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {redemption.redemptionId}
                      </TableCell>
                      <TableCell>
                        {new Date(
                          redemption.redeemedAt || redemption.createdAt
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {redemption.user?.name ||
                          redemption.user?.email ||
                          redemption.user?.userId ||
                          "N/A"}
                      </TableCell>
                      <TableCell>
                        {redemption.branch?.merchant?.name || "N/A"}
                      </TableCell>
                      <TableCell>{redemption.branch?.name || "N/A"}</TableCell>
                      <TableCell>${redemption.value.toFixed(2)}</TableCell>
                      <TableCell className="text-green-600 font-semibold">
                        ${redemption.savings.toFixed(2)}
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
              {redemptions.length === 0
                ? " 0 "
                : ` ${(currentPage - 1) * pageSize + 1} - ${Math.min(
                    currentPage * pageSize,
                    totalCount
                  )} `}
              de {totalCount} redenciones
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
