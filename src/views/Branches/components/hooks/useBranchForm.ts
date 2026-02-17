import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useBranches } from "@/modules/branches/domain/hooks/use-branches";
import { useOffers } from "@/modules/offers/domain/hooks/use-offers";
import { useMerchants } from "@/modules/merchants/domain/hooks/use-merchants";
import { useCategories } from "@/modules/categories/domain/hooks/use-categories";
import { useUsers } from "@/modules/users/domain/hooks/use-users";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { IBranch } from "@/data/interfaces/merchant.interface";
import type { ICategoria } from "@/data/interfaces/interfaces.interface";
import type { IUser } from "@/data/interfaces/user.interface";
import type { CreateOfferRequest } from "@/modules/offers/data/interfaces/offers.response.interface";
import {
  uploadFilesToCloudinary,
  logoUploadOptions,
  branchImageUploadOptions,
  type CloudinaryUploadProgress,
} from "@/modules/cloudinary";

// Types for offers according to new API
interface Offer {
  offerId?: number;
  title: string;
  description: string;
  offerType: "percentage" | "fixed_amount" | "promo" | "menu_weincard";
  value: string;
  conditions: string;
  validFrom: string;
  validTo?: string;
  validDays: string[];
  startTime?: string;
  isActive: boolean;
  expiresAt: string | null;
  excludesBankHolidays: boolean;
  membershipPlanId: number;
  branchId?: number;
}

interface BranchFormData {
  merchantId: string;
  categoryId: string;
  userId: string;
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  latitude: string;
  longitude: string;
  description: string;
  website: string;
  whatsapp: string;
  note: string;
  isActive: boolean;
  canContact: boolean;
}

export function useBranchForm(token: string, branchId?: string) {
  const router = useRouter();
  
  // React Hook Form
  const form = useForm<BranchFormData>({
    defaultValues: {
      merchantId: "",
      categoryId: "",
      userId: "",
      name: "",
      address: "",
      city: "",
      country: "",
      phone: "",
      email: "",
      latitude: "",
      longitude: "",
      description: "",
      website: "",
      whatsapp: "",
      note: "",
      isActive: true,
      canContact: true,
    },
  });

  // API Hooks
  const { createBranch, getOneBranch, updateBranch, loading: branchLoading } = useBranches();
  const { createOffer, updateOffer, deleteOffer, getAllOffers, loading: offersLoading } = useOffers();
  const { getAllMerchants, loading: merchantsLoading } = useMerchants();
  const { getAllCategories } = useCategories();
  const { getAllUsers } = useUsers();

  // File states
  const [logo, setLogo] = useState<string>("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  // Upload progress state
  const [uploadProgress, setUploadProgress] = useState<CloudinaryUploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState("");

  // UI state
  const [rating, setRating] = useState(4.5);
  const [offers, setOffers] = useState<Offer[]>([]);

  // Modal state
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  // Progress state for creation flow
  const [creationProgress, setCreationProgress] = useState({
    isCreating: false,
    step: "",
    currentOffer: 0,
    totalOffers: 0,
  });

  // Data lists
  const [merchants, setMerchants] = useState<any[]>([]);
  const [categories, setCategories] = useState<ICategoria[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [managers, setManagers] = useState<IUser[]>([]);
  const [loadingManagers, setLoadingManagers] = useState(true);

  // Category modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | undefined>(undefined);

  // Load merchants
  useEffect(() => {
    const fetchMerchants = async () => {
      const response = await getAllMerchants(token, { skip: 0, limit: 100 });
      if (response && response.merchants) {
        setMerchants(response.merchants);
      }
    };
    fetchMerchants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const categoriesList = await getAllCategories(token);
        setCategories(categoriesList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Load managers
  useEffect(() => {
    const fetchManagers = async () => {
      setLoadingManagers(true);
      try {
        const response = await getAllUsers(token, { skip: 0, limit: 100 }, "manager");
        if (response && response.users) {
          setManagers(response.users);
        }
      } catch (error) {
        console.error("Error fetching managers:", error);
      } finally {
        setLoadingManagers(false);
      }
    };
    fetchManagers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Load offers for a specific branch
  const loadBranchOffers = useCallback(
    async (branchIdNum: number) => {
      try {
        const offersResponse = await getAllOffers(branchIdNum.toString(), token);
        if (offersResponse && offersResponse.offers) {
          const mappedOffers: Offer[] = offersResponse.offers.map((apiOffer: any) => {
            let startTime = "";
            if (apiOffer.validFrom) {
              const fromDate = new Date(apiOffer.validFrom);
              const hours = fromDate.getUTCHours().toString().padStart(2, "0");
              const minutes = fromDate.getUTCMinutes().toString().padStart(2, "0");
              if (hours !== "00" || minutes !== "00") {
                startTime = `${hours}:${minutes}`;
              }
            }

            let validToTime = "";
            if (apiOffer.validTo) {
              const toDate = new Date(apiOffer.validTo);
              const hours = toDate.getUTCHours().toString().padStart(2, "0");
              const minutes = toDate.getUTCMinutes().toString().padStart(2, "0");
              if (hours !== "23" || minutes !== "59") {
                validToTime = `${hours}:${minutes}`;
              }
            }

            return {
              offerId: apiOffer.offerId,
              title: apiOffer.title,
              description: apiOffer.description || "",
              offerType: apiOffer.offerType,
              value: apiOffer.value,
              conditions: apiOffer.conditions || "",
              validFrom: apiOffer.validFrom,
              validTo: validToTime,
              validDays: apiOffer.validDays || [],
              startTime,
              isActive: apiOffer.isActive,
              expiresAt: apiOffer.expiresAt,
              excludesBankHolidays: apiOffer.excludesBankHolidays,
              membershipPlanId: apiOffer.membershipPlanId,
              branchId: apiOffer.branchId,
            };
          });
          setOffers(mappedOffers);
        }
      } catch (error) {
        console.error("Error loading branch offers:", error);
      }
    },
    [getAllOffers, token]
  );

  // Load branch data if editing
  useEffect(() => {
    if (branchId) {
      const loadBranch = async () => {
        const response = await getOneBranch(Number(branchId), token);
        if (response) {
          const branch = response.branch;
          console.log("Loading branch data:", branch);

          const extractedMerchantId = branch.merchant?.merchantId?.toString() || "";
          const extractedCategoryId = branch.category?.categoryId?.toString() || "";
          const extractedUserId = branch.branchUsers?.[0]?.user?.userId?.toString() || "";

          form.reset({
            merchantId: extractedMerchantId,
            categoryId: extractedCategoryId,
            userId: extractedUserId,
            name: branch.name || "",
            address: branch.address || "",
            city: branch.city || "",
            country: branch.country || "",
            phone: branch.phone || "",
            email: branch.email || "",
            latitude: branch.latitude?.toString() || "",
            longitude: branch.longitude?.toString() || "",
            description: branch.description || "",
            website: branch.website || "",
            whatsapp: branch.whatsapp || "",
            note: branch.note || "",
            isActive: branch.isActive ?? true,
            canContact: branch.canContact ?? true,
          });

          // Debug: log the branch data to verify whatsapp is coming from API
          console.log("Branch whatsapp from API:", branch.whatsapp);
          console.log("Branch canContact from API:", branch.canContact);

          if (branch.logoUrl) setLogo(branch.logoUrl);
          if (branch.images && branch.images.length > 0) {
            setImages(branch.images);
          }

          loadBranchOffers(Number(branchId));
        }
      };
      loadBranch();
    }
  }, [branchId, token, getOneBranch, loadBranchOffers, form]);

  // Image handlers
  const handleLogoChange = async (file: File, base64: string) => {
    setLogo(base64);
    try {
      setIsUploading(true);
      setUploadStep("Subiendo logo...");
      const logoResults = await uploadFilesToCloudinary([file], logoUploadOptions, setUploadProgress);
      const logoResult = logoResults[0];
      if (logoResult.success) {
        setLogo(logoResult.secureUrl);
        setLogoFile(null);
        toast.success("Logo subido exitosamente");
      } else {
        toast.error(`Error al subir logo: ${logoResult.error}`);
        setLogo("");
      }
    } catch (error: any) {
      toast.error(`Error al subir logo: ${error?.message || "Error desconocido"}`);
      setLogo("");
    } finally {
      setIsUploading(false);
      setUploadProgress([]);
      setUploadStep("");
    }
  };

  const handleLogoRemove = () => {
    setLogoFile(null);
    setLogo("");
  };

  const handleImagesChange = async (newImages: string[], newFiles: File[]) => {
    if (newFiles.length === 0) {
      setImages(newImages);
      return;
    }

    setImages(newImages);
    try {
      setIsUploading(true);
      setUploadStep(`Subiendo ${newFiles.length} imagen(es)...`);
      const imageResults = await uploadFilesToCloudinary(newFiles, branchImageUploadOptions, setUploadProgress);
      const existingUrls = images.filter((img) => img.startsWith("http"));
      const newCloudinaryUrls: string[] = [];
      const failedUploads: string[] = [];

      for (const result of imageResults) {
        if (result.success) {
          newCloudinaryUrls.push(result.secureUrl);
        } else {
          failedUploads.push(result.fileName);
          toast.error(`Error al subir ${result.fileName}: ${result.error}`);
        }
      }

      setImages([...existingUrls, ...newCloudinaryUrls]);
      setImageFiles([]);

      if (newCloudinaryUrls.length > 0) {
        toast.success(`${newCloudinaryUrls.length} imagen(es) subida(s) exitosamente`);
      }
      if (failedUploads.length > 0) {
        toast.warning(`${failedUploads.length} imagen(es) fallaron al subirse`);
      }
    } catch (error: any) {
      toast.error(`Error al subir imágenes: ${error?.message || "Error desconocido"}`);
      setImages(images);
    } finally {
      setIsUploading(false);
      setUploadProgress([]);
      setUploadStep("");
    }
  };

  // Offer handlers
  const handleCreateOffer = () => {
    setEditingOffer(null);
    setIsOfferModalOpen(true);
  };

  const handleEditOffer = (offer: Offer) => {
    setEditingOffer(offer);
    setIsOfferModalOpen(true);
  };

  const handleDeleteOffer = async (offerId: number) => {
    if (branchId) {
      try {
        await deleteOffer(offerId, token);
        loadBranchOffers(Number(branchId));
      } catch (error) {
        console.error("Error deleting offer:", error);
      }
    } else {
      setOffers((prev) => prev.filter((offer) => offer.offerId !== offerId));
    }
  };

  const handleSaveOffer = async (offer: Offer) => {
    if (branchId) {
      try {
        const offerData: CreateOfferRequest = {
          title: offer.title,
          description: offer.description,
          offerType: offer.offerType,
          value: offer.value,
          conditions: offer.conditions,
          validFrom: offer.validFrom,
          validTo: offer.validTo || null,
          validDays: offer.validDays,
          isActive: offer.isActive,
          expiresAt: offer.expiresAt,
          excludesBankHolidays: offer.excludesBankHolidays,
          membershipPlanId: offer.membershipPlanId,
          branchId: Number(branchId),
        };

        if (editingOffer && editingOffer.offerId) {
          await updateOffer(editingOffer.offerId, offerData, token);
        } else {
          await createOffer(offerData, token);
        }
        loadBranchOffers(Number(branchId));
      } catch (error) {
        console.error("Error saving offer:", error);
      }
    } else {
      if (editingOffer) {
        setOffers((prev) => prev.map((o) => (o.offerId === offer.offerId ? offer : o)));
      } else {
        const newOffer = { ...offer, offerId: Date.now() };
        setOffers((prev) => [...prev, newOffer]);
      }
    }
    setIsOfferModalOpen(false);
    setEditingOffer(null);
  };

  const handleCloseOfferModal = () => {
    setIsOfferModalOpen(false);
    setEditingOffer(null);
  };

  // Category modal handlers
  const handleOpenCategoryModal = () => {
    setIsCategoryModalOpen(true);
  };

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setEditingCategoryId(undefined);
  };

  const handleCategorySuccess = async () => {
    try {
      const categoriesList = await getAllCategories(token);
      setCategories(categoriesList);
    } catch (error) {
      console.error("Error reloading categories:", error);
    }
  };

  // Save handler
  const handleSave = async () => {
    const formData = form.getValues();

    // Validación de campos requeridos solo para CREATE
    if (!branchId) {
      if (!formData.merchantId) {
        toast.error("Por favor selecciona un aliado");
        return;
      }
      if (!formData.categoryId) {
        toast.error("Por favor selecciona una categoría");
        return;
      }
      if (!formData.userId) {
        toast.error("Por favor selecciona un manager (nombre del responsable)");
        return;
      }
    }

    // Validación de campos obligatorios para CREATE y EDIT
    if (!formData.name) {
      toast.error("El campo 'Nombre del establecimiento' es obligatorio");
      return;
    }
    if (!formData.phone) {
      toast.error("El campo 'Contacto' (teléfono) es obligatorio");
      return;
    }
    if (!formData.email) {
      toast.error("El campo 'Correo' es obligatorio");
      return;
    }
    if (!logo) {
      toast.error("El campo 'Logo' es obligatorio. Por favor, sube un logo");
      return;
    }
    if (!formData.address) {
      toast.error("El campo 'Dirección exacta' es obligatorio");
      return;
    }
    if (!formData.latitude) {
      toast.error("El campo 'Ubicación de Google Maps' (latitud) es obligatorio");
      return;
    }
    if (!formData.longitude) {
      toast.error("El campo 'Ubicación de Google Maps' (longitud) es obligatorio");
      return;
    }

    try {
      const logoUrl = logo;
      const imageUrls = images.filter((img) => img.startsWith("http"));

      const branchData: Partial<IBranch> = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        phone: formData.phone,
        email: formData.email,
        description: formData.description,
        website: formData.website,
        whatsapp: formData.whatsapp,
        note: formData.note,
        isActive: formData.isActive,
        canContact: formData.canContact,
        logoUrl: logoUrl || undefined,
        images: imageUrls.length > 0 ? imageUrls : undefined,
      };

      if (!branchId) {
        branchData.merchantId = Number(formData.merchantId);
        branchData.userId = Number(formData.userId);
      }

      if (formData.categoryId !== "") {
        branchData.categoryId = Number(formData.categoryId);
      } else if (branchId) {
        branchData.categoryId = null as any;
      }

      let response;
      if (branchId) {
        response = await updateBranch(Number(branchId), branchData, token);
        if (response) {
          toast.success("Sucursal actualizada exitosamente");
          router.push("/dashboard/branches");
        }
      } else {
        setCreationProgress({
          isCreating: true,
          step: "Creando sucursal...",
          currentOffer: 0,
          totalOffers: offers.length,
        });

        try {
          response = await createBranch(branchData, token);

          if (response && response.branch) {
            const newBranchId = response.branch.branchId;

            if (!newBranchId) {
              throw new Error("No se pudo obtener el ID de la sucursal creada");
            }

            toast.success("Sucursal creada exitosamente");

            if (offers.length > 0) {
              const offerErrors: string[] = [];

              for (let i = 0; i < offers.length; i++) {
                const offer = offers[i];
                setCreationProgress({
                  isCreating: true,
                  step: `Creando oferta ${i + 1} de ${offers.length}: "${offer.title}"`,
                  currentOffer: i + 1,
                  totalOffers: offers.length,
                });

                const offerData: CreateOfferRequest = {
                  title: offer.title,
                  description: offer.description,
                  offerType: offer.offerType,
                  value: offer.value,
                  conditions: offer.conditions,
                  validFrom: offer.validFrom,
                  validTo: offer.validTo || null,
                  validDays: offer.validDays,
                  isActive: offer.isActive,
                  expiresAt: offer.expiresAt,
                  excludesBankHolidays: offer.excludesBankHolidays,
                  membershipPlanId: offer.membershipPlanId,
                  branchId: newBranchId,
                };

                try {
                  await createOffer(offerData, token);
                  await new Promise((resolve) => setTimeout(resolve, 500));
                } catch (offerError: any) {
                  const errorMsg = `Error al crear oferta "${offer.title}": ${
                    offerError?.message || "Error desconocido"
                  }`;
                  offerErrors.push(errorMsg);
                }
              }

              if (offerErrors.length > 0) {
                toast.warning(
                  `Sucursal creada, pero ${offerErrors.length} oferta(s) fallaron. Revisa la consola para más detalles.`
                );
              } else {
                toast.success(`${offers.length} oferta(s) creada(s) exitosamente`);
              }
            }

            setCreationProgress({
              isCreating: false,
              step: "",
              currentOffer: 0,
              totalOffers: 0,
            });

            router.push("/dashboard/branches");
          } else {
            throw new Error("No se recibió respuesta válida del servidor");
          }
        } catch (branchError) {
          setCreationProgress({
            isCreating: false,
            step: "",
            currentOffer: 0,
            totalOffers: 0,
          });
          throw branchError;
        }
      }
    } catch (err: any) {
      setCreationProgress({
        isCreating: false,
        step: "",
        currentOffer: 0,
        totalOffers: 0,
      });
      toast.error(err?.message || "Error al guardar la sucursal");
    }
  };

  const handleCancelUpload = () => {
    setUploadProgress([]);
    setUploadStep("");
  };

  const handleCancel = () => {
    router.push("/dashboard/branches");
  };

  return {
    // Form
    form,
    
    // Loading states
    branchLoading,
    offersLoading,
    merchantsLoading,
    loadingCategories,
    loadingManagers,
    isUploading,
    creationProgress,
    
    // File states
    logo,
    logoFile,
    images,
    imageFiles,
    uploadProgress,
    uploadStep,
    
    // UI states
    rating,
    setRating,
    
    // Offer states
    offers,
    isOfferModalOpen,
    editingOffer,
    
    // Category states
    isCategoryModalOpen,
    editingCategoryId,
    
    // Data
    merchants,
    categories,
    managers,
    
    // Handlers
    handleLogoChange,
    handleLogoRemove,
    handleImagesChange,
    handleCreateOffer,
    handleEditOffer,
    handleDeleteOffer,
    handleSaveOffer,
    handleCloseOfferModal,
    handleOpenCategoryModal,
    handleCloseCategoryModal,
    handleCategorySuccess,
    handleSave,
    handleCancelUpload,
    handleCancel,
  };
}