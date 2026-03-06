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
import type { IGeneratedRedemptionCode } from "@/modules/redemptions/data/interfaces/redemptions.response.interface";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useRedemptions } from "@/modules/redemptions/domain/hooks/use-redemptions";

interface RedemptionsViewProps {
  token: string;
}

export default function RedemptionsView({ token }: RedemptionsViewProps) {
  const { getGeneratedRedemptions, loading } = useRedemptions();

  const [redemptions, setRedemptions] = useState<IGeneratedRedemptionCode[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [branchFilter, setBranchFilter] = useState<string>("");
  const [userFilter, setUserFilter] = useState<string>("");

  const totalPages = totalCount > 0
    ? Math.ceil(totalCount / pageSize)
    : currentPage + (redemptions.length === pageSize ? 1 : 0);

  const fetchData = useCallback(async () => {
    const skip = (currentPage - 1) * pageSize;
    const filters: { branchId?: number | null; userId?: number | null } = {};
    if (branchFilter) filters.branchId = parseInt(branchFilter) || null;
    if (userFilter) filters.userId = parseInt(userFilter) || null;

    const response = await getGeneratedRedemptions(token, { limit: pageSize, skip }, filters);
    if (response) {
      setRedemptions(response.redemptionCodes);
      setTotalCount(response.count);
    }
  }, [getGeneratedRedemptions, token, currentPage, pageSize, branchFilter, userFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = useCallback((page: number) => setCurrentPage(page), []);

  const handlePageSizeChange = useCallback((value: number) => {
    setPageSize(value);
    setCurrentPage(1);
  }, []);

  const handleSearch = useCallback(() => {
    setCurrentPage(1);
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <h1 className="text-xl font-semibold">Redenciones</h1>

      <Card className="mt-4">
        <CardContent className="p-6 space-y-4">
          {/* Filtros */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-full md:w-64">
              <Input
                placeholder="Sucursal"
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-64">
              <Input
                placeholder="Usuario"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="w-full"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buscar"}
            </Button>
          </div>

          {/* Tabla */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selected.length === redemptions.length && redemptions.length > 0}
                      onCheckedChange={(checked) => {
                        setSelected(checked ? redemptions.map((r) => r.code) : []);
                      }}
                      disabled={loading || redemptions.length === 0}
                    />
                  </TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Sucursal</TableHead>
                  <TableHead>Código</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        Cargando redenciones...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : redemptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No se encontraron redenciones
                    </TableCell>
                  </TableRow>
                ) : (
                  redemptions.map((r) => (
                    <TableRow key={r.code}>
                      <TableCell>
                        <Checkbox
                          checked={selected.includes(r.code)}
                          onCheckedChange={(checked) => {
                            setSelected(checked
                              ? [...selected, r.code]
                              : selected.filter((id) => id !== r.code)
                            );
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(r.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{r.userName?.replace("~", " ") || "N/A"}</TableCell>
                      <TableCell>{r.branchName || "N/A"}</TableCell>
                      <TableCell className="font-mono">{r.code}</TableCell>
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
                : ` ${(currentPage - 1) * pageSize + 1} - ${totalCount > 0 ? Math.min(currentPage * pageSize, totalCount) : (currentPage - 1) * pageSize + redemptions.length} `}
              {totalCount > 0 ? `de ${totalCount} ` : ""}redenciones
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
                  const p = i + 1;
                  return (
                    <Button
                      key={p}
                      variant={p === currentPage ? "default" : "outline"}
                      onClick={() => handlePageChange(p)}
                      className="w-10 h-10 p-0"
                      disabled={loading}
                    >
                      {p}
                    </Button>
                  );
                })
              ) : (
                <>
                  {currentPage > 2 && (
                    <Button variant="outline" onClick={() => handlePageChange(1)} className="w-10 h-10 p-0" disabled={loading}>1</Button>
                  )}
                  {currentPage > 3 && <span className="mx-1">...</span>}
                  {currentPage > 1 && (
                    <Button variant="outline" onClick={() => handlePageChange(currentPage - 1)} className="w-10 h-10 p-0" disabled={loading}>{currentPage - 1}</Button>
                  )}
                  <Button variant="default" className="w-10 h-10 p-0" disabled={loading}>{currentPage}</Button>
                  {currentPage < totalPages && (
                    <Button variant="outline" onClick={() => handlePageChange(currentPage + 1)} className="w-10 h-10 p-0" disabled={loading}>{currentPage + 1}</Button>
                  )}
                  {currentPage < totalPages - 2 && <span className="mx-1">...</span>}
                  {currentPage < totalPages - 1 && (
                    <Button variant="outline" onClick={() => handlePageChange(totalPages)} className="w-10 h-10 p-0" disabled={loading}>{totalPages}</Button>
                  )}
                </>
              )}

              <Button
                variant="outline"
                disabled={currentPage >= totalPages || loading || redemptions.length === 0}
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
