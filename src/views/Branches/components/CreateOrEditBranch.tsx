"use client";

import { useBranchForm } from "./hooks/useBranchForm";
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
  WhatsAppCard,
} from "./CreateOrEditBranch/index";

interface CreateOrEditBranchProps {
  token: string;
  branchId?: string;
}

export function CreateOrEditBranch({
  token,
  branchId,
}: CreateOrEditBranchProps) {
  const {
    // Form
    form,
    
    // Loading states
    branchLoading,
    loadingCategories,
    loadingManagers,
    isUploading,
    creationProgress,
    
    // File states
    logo,
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
    handleInlineEditCategory,
    handleDeleteCategory,
    handleSave,
    handleCancelUpload,
    handleCancel,
  } = useBranchForm(token, branchId);

  const { watch, setValue } = form;
  
  // Watch specific fields for better performance and reactivity
  const whatsapp = watch("whatsapp");
  const canContact = watch("canContact");
  const formValues = watch();

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
            name={formValues.name}
            phone={formValues.phone}
            email={formValues.email}
            description={formValues.description}
            rating={rating}
            onNameChange={(value) => setValue("name", value)}
            onPhoneChange={(value) => setValue("phone", value)}
            onEmailChange={(value) => setValue("email", value)}
            onDescriptionChange={(value) => setValue("description", value)}
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
            categoryId={formValues.categoryId}
            categories={categories}
            loadingCategories={loadingCategories}
            onCategoryChange={(value) => setValue("categoryId", value)}
            onCreateCategory={handleOpenCategoryModal}
            onEditCategory={handleInlineEditCategory}
            onDeleteCategory={handleDeleteCategory}
          />

          {/* Address Card */}
          <AddressCard
            address={formValues.address}
            city={formValues.city}
            country={formValues.country}
            latitude={formValues.latitude}
            longitude={formValues.longitude}
            website={formValues.website}
            onAddressChange={(value) => setValue("address", value)}
            onCityChange={(value) => setValue("city", value)}
            onCountryChange={(value) => setValue("country", value)}
            onLatitudeChange={(value) => setValue("latitude", value)}
            onLongitudeChange={(value) => setValue("longitude", value)}
            onWebsiteChange={(value) => setValue("website", value)}
          />

          {/* Notes Card */}
          <NotesCard 
            note={formValues.note} 
            onNoteChange={(value) => setValue("note", value)} 
          />

          {/* Manager Card */}
          <ManagerCard
            userId={formValues.userId}
            managers={managers}
            loadingManagers={loadingManagers}
            onManagerChange={(value) => setValue("userId", value)}
            isRequired={!branchId}
          />

          {/* Ally Card */}
          <AllyCard
            merchantId={formValues.merchantId}
            merchants={merchants}
            merchantsLoading={false}
            onMerchantChange={(value) => setValue("merchantId", value)}
            isRequired={!branchId}
          />

          {/* Active Card */}
          <ActiveCard 
            isActive={formValues.isActive} 
            onActiveChange={(value) => setValue("isActive", value)} 
          />

          {/* WhatsApp Card */}
          <WhatsAppCard
            canContact={canContact}
            whatsapp={whatsapp}
            onCanContactChange={(value) => setValue("canContact", value)}
            onWhatsappChange={(value) => setValue("whatsapp", value)}
          />
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
