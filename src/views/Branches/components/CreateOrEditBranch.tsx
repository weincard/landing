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
import { CreateOrEditCategoryModal } from "./CreateOrEditCategoryModal";
import {
  BranchHeader,
  InformationCard,
  LogoCard,
  ImagesCard,
  OfferCard,
  AvailabilityCard,
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
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

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
          setMerchantId(branch.merchantId?.toString() || "");
          setCategoryId(branch.category?.categoryId?.toString() || "");
          setUserId(branch.userId?.toString() || "");
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

  // Toggle handlers
  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleTime = (time: string) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  // Save handler
  const handleSave = async () => {
    // Validación de campos requeridos
    if (!merchantId) {
      toast.error("Por favor selecciona un aliado");
      return;
    }
    if (!categoryId) {
      toast.error("Por favor selecciona una categoría");
      return;
    }
    if (!userId) {
      toast.error("Por favor selecciona un manager");
      return;
    }
    if (!name) {
      toast.error("El nombre es requerido");
      return;
    }
    if (!address) {
      toast.error("La dirección es requerida");
      return;
    }
    if (!city) {
      toast.error("La ciudad es requerida");
      return;
    }
    if (!country) {
      toast.error("El país es requerido");
      return;
    }
    if (!latitude) {
      toast.error("La latitud es requerida");
      return;
    }
    if (!longitude) {
      toast.error("La longitud es requerida");
      return;
    }
    if (!phone) {
      toast.error("El teléfono es requerido");
      return;
    }
    if (!email) {
      toast.error("El correo electrónico es requerido");
      return;
    }
    if (!howItWorks) {
      toast.error("Debes describir cómo funciona la redención");
      return;
    }

    const branchData: Partial<IBranch> = {
      merchantId: Number(merchantId),
      categoryId: Number(categoryId),
      userId: Number(userId),
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
            selectedDays={selectedDays}
            selectedTimes={selectedTimes}
            onToggleDay={toggleDay}
            onToggleTime={toggleTime}
          />

          {/* Availability Card */}
          <AvailabilityCard
            selectedDays={selectedDays}
            selectedTimes={selectedTimes}
            onToggleDay={toggleDay}
            onToggleTime={toggleTime}
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
          />

          {/* Ally Card */}
          <AllyCard
            merchantId={merchantId}
            merchants={merchants}
            merchantsLoading={merchantsLoading}
            onMerchantChange={setMerchantId}
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
    </div>
  );
}
