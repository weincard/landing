"use client";

import { useState, useEffect, useCallback } from "react";
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
  validTo?: string; // Hora de fin (Formato HH:mm) - actualizado para compatibilidad
  validDays: string[];
  // validHours: string[]; // Deprecated: now using startTime and validTo
  startTime?: string;
  // endTime?: string; // Deprecated: ahora usamos validTo
  isActive: boolean;
  expiresAt: string | null; // Fecha límite de la oferta
  excludesBankHolidays: boolean;
  membershipPlanId: number;
  branchId?: number;
}
import { CreateOrEditCategoryModal } from "./CreateOrEditCategoryModal";
import { CreateOrEditOfferModal } from "./CreateOrEditBranch/CreateOrEditOfferModal";
import { UploadProgressModal } from "./CreateOrEditBranch/UploadProgressModal";
import {
  BranchHeader,
  InformationCard,
  LogoCard,
  ImagesCard,
  OfferCard,
  CategoryCard,
  AddressCard,
  NotesCard,
  ManagerCard,
  AllyCard,
  ActiveCard,
} from "./CreateOrEditBranch/index";

interface CreateOrEditBranchProps {
  token: string;
  branchId?: string;
}

export function CreateOrEditBranch({
  token,
  branchId,
}: CreateOrEditBranchProps) {
  const router = useRouter();
  const {
    createBranch,
    getOneBranch,
    updateBranch,
    loading: branchLoading,
  } = useBranches();

  const {
    createOffer,
    updateOffer,
    deleteOffer,
    getAllOffers,
    loading: offersLoading,
  } = useOffers();

  const { getAllMerchants, loading: merchantsLoading } = useMerchants();
  const { getAllCategories } = useCategories();
  const { getAllUsers } = useUsers();

  // Form fields - Required
  const [merchantId, setMerchantId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");

  // Form fields - Optional
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [note, setNote] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Files and images - Store File objects for upload, URLs for display
  const [logo, setLogo] = useState<string>("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  // Upload progress state
  const [uploadProgress, setUploadProgress] = useState<
    CloudinaryUploadProgress[]
  >([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState("");

  // UI state
  const [rating, setRating] = useState(4.5);

  // Multiple offers
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
  const [editingCategoryId, setEditingCategoryId] = useState<
    number | undefined
  >(undefined);

  // Load merchants
  useEffect(() => {
    const fetchMerchants = async () => {
      const response = await getAllMerchants(token, { skip: 0, limit: 100 });
      if (response && response.merchants) {
        setMerchants(response.merchants);
      }
    };
    fetchMerchants();
  }, [token, getAllMerchants]);

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
        const response = await getAllUsers(
          token,
          { skip: 0, limit: 100 },
          "manager"
        );
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
  }, [token, getAllUsers]);

  // Load offers for a specific branch
  const loadBranchOffers = useCallback(
    async (branchIdNum: number) => {
      try {
        const offersResponse = await getAllOffers(
          branchIdNum.toString(),
          token
        );
        if (offersResponse && offersResponse.offers) {
          // Convert API offers to component format
          const mappedOffers: Offer[] = offersResponse.offers.map(
            (apiOffer: any) => {
              // Extraer hora de validFrom si existe
              let startTime = "";
              if (apiOffer.validFrom) {
                const fromDate = new Date(apiOffer.validFrom);
                const hours = fromDate
                  .getUTCHours()
                  .toString()
                  .padStart(2, "0");
                const minutes = fromDate
                  .getUTCMinutes()
                  .toString()
                  .padStart(2, "0");
                // Solo guardar si no es medianoche (00:00)
                if (hours !== "00" || minutes !== "00") {
                  startTime = `${hours}:${minutes}`;
                }
              }

              // Extraer hora de validTo si existe
              let validToTime = "";
              if (apiOffer.validTo) {
                const toDate = new Date(apiOffer.validTo);
                const hours = toDate.getUTCHours().toString().padStart(2, "0");
                const minutes = toDate
                  .getUTCMinutes()
                  .toString()
                  .padStart(2, "0");
                // Solo guardar si no es 23:59
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
                validTo: validToTime, // Ahora es solo la hora extraída
                validDays: apiOffer.validDays || [],
                // validHours: apiOffer.validHours || [], // Deprecated
                startTime,
                // endTime, // Deprecated: ahora usamos validTo
                isActive: apiOffer.isActive,
                expiresAt: apiOffer.expiresAt,
                excludesBankHolidays: apiOffer.excludesBankHolidays,
                membershipPlanId: apiOffer.membershipPlanId,
                branchId: apiOffer.branchId,
              };
            }
          );
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
          console.log("Loading branch data:", branch); // Keep for debugging preload issue

          // Extract merchantId from nested merchant object
          const extractedMerchantId =
            branch.merchant?.merchantId?.toString() || "";
          setMerchantId(extractedMerchantId);

          // Extract categoryId from nested category object
          setCategoryId(branch.category?.categoryId?.toString() || "");

          // Extract userId from branchUsers array (get first user if exists)
          const extractedUserId =
            branch.branchUsers?.[0]?.user?.userId?.toString() || "";
          setUserId(extractedUserId);

          setName(branch.name || "");
          setAddress(branch.address || "");
          setCity(branch.city || "");
          setCountry(branch.country || "");
          setPhone(branch.phone || "");
          setEmail(branch.email || "");
          setLatitude(branch.latitude?.toString() || "");
          setLongitude(branch.longitude?.toString() || "");
          setDescription(branch.description || "");
          setWebsite(branch.website || "");
          setNote(branch.note || "");
          setIsActive(branch.isActive ?? true);
          if (branch.logoUrl) setLogo(branch.logoUrl);
          if (branch.images && branch.images.length > 0) {
            setImages(branch.images);
          }

          console.log("Set merchantId:", extractedMerchantId); // Keep for debugging
          console.log("Set userId:", extractedUserId); // Keep for debugging
          console.log("Branch users:", branch.branchUsers); // Additional debugging

          // Load offers for this branch in edit mode
          loadBranchOffers(Number(branchId));
        }
      };
      loadBranch();
    }
  }, [branchId, token, getOneBranch, loadBranchOffers]);

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

  // Image handlers
  const handleLogoChange = async (file: File, base64: string) => {
    // Set preview immediately
    setLogo(base64);

    try {
      setIsUploading(true);
      setUploadStep("Subiendo logo...");

      const logoResults = await uploadFilesToCloudinary(
        [file],
        logoUploadOptions,
        setUploadProgress
      );

      const logoResult = logoResults[0];
      if (logoResult.success) {
        setLogo(logoResult.secureUrl);
        setLogoFile(null); // Clear file since we now have URL
        toast.success("Logo subido exitosamente");
      } else {
        toast.error(`Error al subir logo: ${logoResult.error}`);
        setLogo(""); // Clear preview on error
      }
    } catch (error: any) {
      toast.error(
        `Error al subir logo: ${error?.message || "Error desconocido"}`
      );
      setLogo(""); // Clear preview on error
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
    // If no new files, just update images (for removals)
    if (newFiles.length === 0) {
      setImages(newImages);
      return;
    }

    // Set preview immediately for new files
    setImages(newImages);

    try {
      setIsUploading(true);
      setUploadStep(`Subiendo ${newFiles.length} imagen(es)...`);

      const imageResults = await uploadFilesToCloudinary(
        newFiles,
        branchImageUploadOptions,
        setUploadProgress
      );

      // Replace base64 previews with Cloudinary URLs
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

      // Update images with successful uploads
      setImages([...existingUrls, ...newCloudinaryUrls]);
      setImageFiles([]); // Clear files since we now have URLs

      if (newCloudinaryUrls.length > 0) {
        toast.success(
          `${newCloudinaryUrls.length} imagen(es) subida(s) exitosamente`
        );
      }

      if (failedUploads.length > 0) {
        toast.warning(`${failedUploads.length} imagen(es) fallaron al subirse`);
      }
    } catch (error: any) {
      toast.error(
        `Error al subir imágenes: ${error?.message || "Error desconocido"}`
      );
      // Revert to original images on error
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
      // Edit mode: delete directly from API
      try {
        await deleteOffer(offerId, token);
        // Reload offers to reflect changes
        loadBranchOffers(Number(branchId));
      } catch (error) {
        console.error("Error deleting offer:", error);
      }
    } else {
      // Create mode: remove from local state
      setOffers((prev) => prev.filter((offer) => offer.offerId !== offerId));
    }
  };

  const handleSaveOffer = async (offer: Offer) => {
    if (branchId) {
      // Edit mode: save directly to API
      try {
        const offerData: CreateOfferRequest = {
          title: offer.title,
          description: offer.description,
          offerType: offer.offerType,
          value: offer.value,
          conditions: offer.conditions,
          validFrom: offer.validFrom,
          validTo: offer.validTo || null, // Permitir null cuando está vacío
          validDays: offer.validDays,
          isActive: offer.isActive,
          expiresAt: offer.expiresAt,
          excludesBankHolidays: offer.excludesBankHolidays,
          membershipPlanId: offer.membershipPlanId,
          branchId: Number(branchId),
        };

        if (editingOffer && editingOffer.offerId) {
          // Update existing offer
          await updateOffer(editingOffer.offerId, offerData, token);
        } else {
          // Create new offer
          await createOffer(offerData, token);
        }

        // Reload offers to reflect changes
        loadBranchOffers(Number(branchId));
      } catch (error) {
        console.error("Error saving offer:", error);
      }
    } else {
      // Create mode: save to local state
      if (editingOffer) {
        // Update existing offer
        setOffers((prev) =>
          prev.map((o) => (o.offerId === offer.offerId ? offer : o))
        );
      } else {
        // Add new offer with temporary ID
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

  // Save handler
  const handleSave = async () => {
    // Validación de campos requeridos solo para CREATE
    if (!branchId) {
      if (!merchantId) {
        toast.error("Por favor selecciona un aliado");
        return;
      }
      if (!categoryId) {
        toast.error("Por favor selecciona una categoría");
        return;
      }
      if (!userId) {
        toast.error("Por favor selecciona un manager (nombre del responsable)");
        return;
      }
    }

    // Validación de campos obligatorios para CREATE y EDIT
    if (!name) {
      toast.error("El campo 'Nombre del establecimiento' es obligatorio");
      return;
    }
    if (!phone) {
      toast.error("El campo 'Contacto' (teléfono) es obligatorio");
      return;
    }
    if (!email) {
      toast.error("El campo 'Correo' es obligatorio");
      return;
    }
    if (!logo) {
      toast.error("El campo 'Logo' es obligatorio. Por favor, sube un logo");
      return;
    }
    if (!address) {
      toast.error("El campo 'Dirección exacta' es obligatorio");
      return;
    }
    if (!latitude) {
      toast.error(
        "El campo 'Ubicación de Google Maps' (latitud) es obligatorio"
      );
      return;
    }
    if (!longitude) {
      toast.error(
        "El campo 'Ubicación de Google Maps' (longitud) es obligatorio"
      );
      return;
    }

    try {
      // Prepare branch data with existing URLs (files already uploaded)
      const logoUrl = logo;
      const imageUrls = images.filter((img) => img.startsWith("http"));

      // Prepare branch data with URLs
      const branchData: Partial<IBranch> = {
        name,
        address,
        city,
        country,
        latitude: Number(latitude),
        longitude: Number(longitude),
        phone,
        email,
        description,
        website,
        note,
        isActive,
        logoUrl: logoUrl || undefined,
        images: imageUrls.length > 0 ? imageUrls : undefined,
      };

      // Only include merchantId, categoryId, and userId for creation
      if (!branchId) {
        branchData.merchantId = Number(merchantId);
        branchData.categoryId = Number(categoryId);
        branchData.userId = Number(userId);
      }

      let response;
      if (branchId) {
        // Edit mode: just update the branch
        response = await updateBranch(Number(branchId), branchData, token);

        if (response) {
          toast.success("Sucursal actualizada exitosamente");
          router.push("/dashboard/branches");
        }
      } else {
        // Create mode: create branch and then create offers with progress
        setCreationProgress({
          isCreating: true,
          step: "Creando sucursal...",
          currentOffer: 0,
          totalOffers: offers.length,
        });

        try {
          response = await createBranch(branchData, token);

          console.log("Create branch response:", response);

          if (response && response.branch) {
            const newBranchId = response.branch.branchId;

            console.log("Extracted branchId:", newBranchId);

            if (!newBranchId) {
              console.error("Branch response structure:", response);
              throw new Error("No se pudo obtener el ID de la sucursal creada");
            }

            // Show success for branch creation
            toast.success("Sucursal creada exitosamente");

            if (offers.length > 0) {
              // Create offers one by one with progress feedback
              const offerErrors: string[] = [];

              for (let i = 0; i < offers.length; i++) {
                const offer = offers[i];

                setCreationProgress({
                  isCreating: true,
                  step: `Creando oferta ${i + 1} de ${offers.length}: "${
                    offer.title
                  }"`,
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
                  validTo: offer.validTo || null, // No generar fecha automática
                  validDays: offer.validDays,
                  isActive: offer.isActive,
                  expiresAt: offer.expiresAt,
                  excludesBankHolidays: offer.excludesBankHolidays,
                  membershipPlanId: offer.membershipPlanId,
                  branchId: newBranchId,
                };

                console.log(`Creating offer ${i + 1}:`, offerData);

                try {
                  const offerResult = await createOffer(offerData, token);
                  console.log(
                    `Offer ${i + 1} created successfully:`,
                    offerResult
                  );
                  // Small delay to show progress
                  await new Promise((resolve) => setTimeout(resolve, 500));
                } catch (offerError: any) {
                  const errorMsg = `Error al crear oferta "${offer.title}": ${
                    offerError?.message || "Error desconocido"
                  }`;
                  console.error(errorMsg, offerError);
                  offerErrors.push(errorMsg);
                }
              }

              // Show results
              if (offerErrors.length > 0) {
                console.error("Errors creating offers:", offerErrors);
                toast.warning(
                  `Sucursal creada, pero ${offerErrors.length} oferta(s) fallaron. Revisa la consola para más detalles.`
                );
              } else {
                toast.success(
                  `${offers.length} oferta(s) creada(s) exitosamente`
                );
              }
            }

            setCreationProgress({
              isCreating: false,
              step: "",
              currentOffer: 0,
              totalOffers: 0,
            });

            // Navigate to branches list
            router.push("/dashboard/branches");
          } else {
            // If response is empty or branch creation failed
            console.error("Invalid response:", response);
            throw new Error("No se recibió respuesta válida del servidor");
          }
        } catch (branchError) {
          // Reset progress state on any error during creation
          setCreationProgress({
            isCreating: false,
            step: "",
            currentOffer: 0,
            totalOffers: 0,
          });
          throw branchError; // Re-throw to be caught by outer catch
        }
      }
    } catch (err: any) {
      // Ensure progress state is always reset on any error
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <BranchHeader
        isEditing={!!branchId}
        isLoading={branchLoading || creationProgress.isCreating}
        onSave={handleSave}
        onCancel={handleCancel}
        creationProgress={
          creationProgress.isCreating ? creationProgress : undefined
        }
      />

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Main Information */}
        <div className="col-span-2 space-y-6">
          {/* Information Card */}
          <InformationCard
            name={name}
            phone={phone}
            email={email}
            description={description}
            rating={rating}
            onNameChange={setName}
            onPhoneChange={setPhone}
            onEmailChange={setEmail}
            onDescriptionChange={setDescription}
            onRatingChange={setRating}
          />

          {/* Logo Card */}
          <LogoCard
            logo={logo}
            onLogoChange={handleLogoChange}
            onLogoRemove={handleLogoRemove}
          />

          {/* Images Card */}
          <ImagesCard
            images={images}
            imageFiles={imageFiles}
            onImagesChange={handleImagesChange}
          />

          {/* Offer Card */}
          <OfferCard
            offers={offers}
            onCreateOffer={handleCreateOffer}
            onEditOffer={handleEditOffer}
            onDeleteOffer={handleDeleteOffer}
            isEditMode={!!branchId}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Category Card */}
          <CategoryCard
            categoryId={categoryId}
            categories={categories}
            loadingCategories={loadingCategories}
            onCategoryChange={setCategoryId}
            onCreateCategory={handleOpenCategoryModal}
          />

          {/* Address Card */}
          <AddressCard
            address={address}
            city={city}
            country={country}
            latitude={latitude}
            longitude={longitude}
            website={website}
            onAddressChange={setAddress}
            onCityChange={setCity}
            onCountryChange={setCountry}
            onLatitudeChange={setLatitude}
            onLongitudeChange={setLongitude}
            onWebsiteChange={setWebsite}
          />

          {/* Notes Card */}
          <NotesCard note={note} onNoteChange={setNote} />

          {/* Manager Card */}
          <ManagerCard
            userId={userId}
            managers={managers}
            loadingManagers={loadingManagers}
            onManagerChange={setUserId}
            isRequired={!branchId}
          />

          {/* Ally Card */}
          <AllyCard
            merchantId={merchantId}
            merchants={merchants}
            merchantsLoading={merchantsLoading}
            onMerchantChange={setMerchantId}
            isRequired={!branchId}
          />

          {/* Active Card */}
          <ActiveCard isActive={isActive} onActiveChange={setIsActive} />
        </div>
      </div>

      {/* Category Modal */}
      <CreateOrEditCategoryModal
        token={token}
        isOpen={isCategoryModalOpen}
        onClose={handleCloseCategoryModal}
        onSuccess={handleCategorySuccess}
        categoryId={editingCategoryId}
        allCategories={categories}
      />

      {/* Offer Modal */}
      <CreateOrEditOfferModal
        isOpen={isOfferModalOpen}
        onClose={handleCloseOfferModal}
        onSave={handleSaveOffer}
        offer={editingOffer}
      />

      {/* Upload Progress Modal */}
      {isUploading && (
        <UploadProgressModal
          progress={uploadProgress}
          step={uploadStep}
          onCancel={handleCancelUpload}
        />
      )}
    </div>
  );
}
