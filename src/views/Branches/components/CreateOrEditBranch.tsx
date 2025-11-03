"use client";

import { useState, useEffect } from "react";
import { useBranches } from "@/modules/branches/domain/hooks/use-branches";
import { useMerchants } from "@/modules/merchants/domain/hooks/use-merchants";
import { useCategories } from "@/modules/categories/domain/hooks/use-categories";
import { useUsers } from "@/modules/users/domain/hooks/use-users";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { IBranch } from "@/data/interfaces/merchant.interface";
import type { ICategoria } from "@/data/interfaces/interfaces.interface";
import type { IUser } from "@/data/interfaces/user.interface";

// Types for offers and availability
interface Availability {
  id: string;
  selectedDays: string[];
  selectedTimes: string[];
}

interface Offer {
  id: string;
  title: string;
  offerType: string;
  membershipType: string;
  quantity: string;
  details: string;
  availabilities: Availability[];
}
import { CreateOrEditCategoryModal } from "./CreateOrEditCategoryModal";
import { CreateOrEditOfferModal } from "./CreateOrEditBranch/CreateOrEditOfferModal";
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
  const [howItWorks, setHowItWorks] = useState("");
  const [website, setWebsite] = useState("");
  const [note, setNote] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Files and images
  const [logo, setLogo] = useState<string>("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);

  // UI state
  const [rating, setRating] = useState(4.5);

  // Multiple offers
  const [offers, setOffers] = useState<Offer[]>([]);

  // Modal state
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

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

  // Load branch data if editing
  useEffect(() => {
    if (branchId) {
      const loadBranch = async () => {
        const response = await getOneBranch(Number(branchId), token);
        if (response && response.branch) {
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
          setHowItWorks(branch.howItWorks || "");
          setWebsite(branch.website || "");
          setNote(branch.note || "");
          setIsActive(branch.isActive ?? true);
          if (branch.logoUrl) setLogo(branch.logoUrl);

          console.log("Set merchantId:", extractedMerchantId); // Keep for debugging
          console.log("Set userId:", extractedUserId); // Keep for debugging
          console.log("Branch users:", branch.branchUsers); // Additional debugging
        }
      };
      loadBranch();
    }
  }, [branchId, token, getOneBranch]);

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
  const handleLogoChange = (file: File, base64: string) => {
    setLogoFile(file);
    setLogo(base64);
  };

  const handleImagesChange = (newImages: string[]) => {
    setImages(newImages);
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

  const handleDeleteOffer = (offerId: string) => {
    setOffers((prev) => prev.filter((offer) => offer.id !== offerId));
  };

  const handleSaveOffer = (offer: Offer) => {
    if (editingOffer) {
      // Update existing offer
      setOffers((prev) => prev.map((o) => (o.id === offer.id ? offer : o)));
    } else {
      // Add new offer
      setOffers((prev) => [...prev, offer]);
    }
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
      toast.error("El nombre del establecimiento es requerido");
      return;
    }
    if (!address) {
      toast.error("La dirección exacta es requerida");
      return;
    }
    if (!latitude) {
      toast.error("La ubicación de Google Maps (latitud) es requerida");
      return;
    }
    if (!longitude) {
      toast.error("La ubicación de Google Maps (longitud) es requerida");
      return;
    }
    if (!email) {
      toast.error("El correo electrónico es requerido");
      return;
    }

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
      howItWorks,
      website,
      note,
      isActive,
    };

    // Only include merchantId, categoryId, and userId for creation
    if (!branchId) {
      branchData.merchantId = Number(merchantId);
      branchData.categoryId = Number(categoryId);
      branchData.userId = Number(userId);
    }

    try {
      let response;
      if (branchId) {
        response = await updateBranch(
          Number(branchId),
          branchData,
          logoFile || undefined,
          token
        );
      } else {
        response = await createBranch(branchData, logoFile || undefined, token);
      }

      if (response) {
        toast.success(
          response.message || branchId
            ? "Sucursal actualizada exitosamente"
            : "Sucursal creada exitosamente"
        );
        router.push("/dashboard/branches");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error al guardar la sucursal");
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/branches");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <BranchHeader
        isEditing={!!branchId}
        isLoading={branchLoading}
        onSave={handleSave}
        onCancel={handleCancel}
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
            howItWorks={howItWorks}
            rating={rating}
            onNameChange={setName}
            onPhoneChange={setPhone}
            onEmailChange={setEmail}
            onDescriptionChange={setDescription}
            onHowItWorksChange={setHowItWorks}
            onRatingChange={setRating}
          />

          {/* Logo Card */}
          <LogoCard logo={logo} onLogoChange={handleLogoChange} />

          {/* Images Card */}
          <ImagesCard images={images} onImagesChange={handleImagesChange} />

          {/* Offer Card */}
          <OfferCard
            offers={offers}
            onCreateOffer={handleCreateOffer}
            onEditOffer={handleEditOffer}
            onDeleteOffer={handleDeleteOffer}
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
    </div>
  );
}
