"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { IUser } from "@/data/interfaces/user.interface";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/modules/auth/domain/hooks/use-auth";
import { toast } from "sonner";

interface ProfileViewProps {
  user: IUser;
  token: string;
}

// Mock data para redenciones
const mockRedemptions = [
  {
    id: 1,
    aliado: "Aliado n",
    fecha: "May 25, 3:12 PM",
    orderStatus: "Pending",
    valor: 29.74,
  },
  {
    id: 2,
    aliado: "Aliado n",
    fecha: "May 10, 2:00 PM",
    orderStatus: "Completed",
    valor: 23.06,
  },
  {
    id: 3,
    aliado: "Aliado n",
    fecha: "April 18, 8:00 AM",
    orderStatus: "Completed",
    valor: 29.74,
  },
  {
    id: 4,
    aliado: "Aliado n",
    fecha: "April 12, 8:00 AM",
    orderStatus: "Completed",
    valor: 23.06,
  },
  {
    id: 5,
    aliado: "Aliado n",
    fecha: "April 10, 4:12 PM",
    orderStatus: "Completed",
    valor: 23.06,
  },
];

export default function ProfileView({
  user: initialUser,
  token,
}: ProfileViewProps) {
  const router = useRouter();
  const { getMe, loading: loadingUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<IUser>(initialUser);

  // Estados del formulario
  const [direcciones, setDirecciones] = useState("Parapur langa");
  const [email, setEmail] = useState(user.email || "");
  const [telefono, setTelefono] = useState(user.phone || "");

  // Cargar datos del usuario desde la API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getMe(token);
        if (userData) {
          setUser(userData);
          setEmail(userData.email || "");
          setTelefono(userData.phone || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Error al cargar los datos del usuario");
      }
    };

    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleCancel = () => {
    router.push("/dashboard");
  };

  const handleSave = async () => {
    // Aquí iría la lógica para actualizar el perfil
    console.log("Guardando perfil...");
    setIsEditing(false);
  };

  const getUserRole = (role: any): string => {
    if (!role) return "Usuario";
    if (typeof role === "string") return role;
    if (typeof role === "object" && role.name) return role.name;
    return "Usuario";
  };

  const getStatusBadge = (status: string) => {
    if (status === "Completed") {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Completed
        </Badge>
      );
    }
    return (
      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
        Pending
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="h-8 w-8"
            disabled={loadingUser}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">Información del usuario</h1>
        </div>
        <div className="flex items-center gap-2">
          {loadingUser && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          {isEditing && (
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              size="sm"
              disabled={loadingUser}
            >
              Cancel
            </Button>
          )}
          <Button
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            size="sm"
            disabled={loadingUser}
          >
            {isEditing ? "Save" : "Edit"}
          </Button>
        </div>
      </div>

      {/* User Info Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="h-20 w-20 rounded-full bg-purple-500 flex items-center justify-center text-white text-3xl font-semibold flex-shrink-0">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>

            {/* User Details */}
            <div className="flex-1 space-y-2">
              <div>
                <h2 className="text-xl font-semibold">
                  {user.name} {user.lastName} - ROL: {getUserRole(user.role)}{" "}
                  no. {user.idUsuario || user.id || "3523"}
                </h2>
                <p className="text-sm text-muted-foreground">Colombia</p>
                <p className="text-sm text-muted-foreground">5 Redenciones</p>
                <p className="text-sm text-muted-foreground">
                  Fecha de creación:{" "}
                  {user.createdAt
                    ? new Date(user.createdAt).getFullYear()
                    : new Date().getFullYear()}
                </p>
              </div>
            </div>

            {/* Info Básica Panel */}
            <Card className="min-w-[300px]">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <h3 className="text-sm font-semibold">Inf. Básica</h3>
                {isEditing && (
                  <Button
                    variant="link"
                    size="sm"
                    className="text-blue-600 h-auto p-0"
                  >
                    Edit
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">
                    Direcciones
                  </label>
                  {isEditing ? (
                    <Input
                      value={direcciones}
                      onChange={(e) => setDirecciones(e.target.value)}
                      className="h-8"
                    />
                  ) : (
                    <p className="text-sm">{direcciones}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Hajjpur, vaishali
                  </p>
                  <p className="text-sm text-muted-foreground">844124</p>
                  <p className="text-sm text-muted-foreground">India</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Email</label>
                  {isEditing ? (
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-8"
                      type="email"
                    />
                  ) : (
                    <p className="text-sm">{email}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">
                    Teléfono
                  </label>
                  {isEditing ? (
                    <Input
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      className="h-8"
                      type="tel"
                    />
                  ) : (
                    <p className="text-sm">{telefono}</p>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-4 text-destructive"
                >
                  Delete Customer
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardHeader>
      </Card>

      {/* Redenciones Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Redenciones</h3>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aliado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRedemptions.map((redemption) => (
                <TableRow key={redemption.id}>
                  <TableCell className="font-medium">
                    {redemption.aliado}
                  </TableCell>
                  <TableCell>{redemption.fecha}</TableCell>
                  <TableCell>
                    {getStatusBadge(redemption.orderStatus)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(redemption.valor)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
