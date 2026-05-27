import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { useOwnerProperties } from '../../context/OwnerPropertiesContext';
import { OWNER_PROPERTY_STATUS, PROPERTY_PURPOSE_OPTIONS, PROPERTY_TYPE_OPTIONS } from '../../lib/property';
import { useAuth } from '../../context/AuthContext';

const createEmptyForm = () => ({
  title: '',
  description: '',
  priceValue: '',
  address: '',
  purpose: 'sale',
  propertyType: 'apartment',
  numberOfRooms: 1,
  bathrooms: 1,
  areaM2: '',
  features: '',
  status: OWNER_PROPERTY_STATUS,
  deedPhotoUrl: '',
  deedPhotoFile: null,
  existingImages: [],
  additionalImageFiles: [],
})

const buildEditableProperty = (property) => ({
  title: property.title || '',
  description: property.description || '',
  priceValue: property.priceValue || '',
  address: property.location || '',
  purpose: property.purpose || 'sale',
  propertyType: property.propertyType || 'apartment',
  numberOfRooms: property.beds || 0,
  bathrooms: property.baths ?? 0,
  areaM2: property.area || '',
  features: property.features || '',
  status: property.status || OWNER_PROPERTY_STATUS,
  deedPhotoUrl: property.deedPhoto || property.image || '',
  deedPhotoFile: null,
  existingImages: property.images || [],
  additionalImageFiles: [],
})

const PropertyEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const isCreateMode = !id;
  const { profile, isLoadingProfile } = useAuth();
  const { getPropertyById, createProperty, updateProperty, isLoading } = useOwnerProperties();
  const property = isCreateMode ? null : getPropertyById(id);

  const [formData, setFormData] = useState(() => (isCreateMode ? createEmptyForm() : null));
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isCreateMode) {
      setFormData(createEmptyForm());
      return;
    }

    if (property) {
      setFormData(buildEditableProperty(property));
    }
  }, [isCreateMode, property]);

  useEffect(() => {
    if (!isCreateMode || isLoadingProfile) {
      return;
    }

    if (!profile) {
      navigate('/owner/profile/create', {
        replace: true,
        state: {
          returnTo: '/owner/properties/new',
        },
      });
    }
  }, [isCreateMode, isLoadingProfile, navigate, profile]);

  const additionalImagePreviews = useMemo(
    () =>
      formData?.additionalImageFiles.map((file) => ({
        id: `${file.name}-${file.lastModified}`,
        src: URL.createObjectURL(file),
        name: file.name,
      })) || [],
    [formData?.additionalImageFiles],
  );

  useEffect(() => () => {
    additionalImagePreviews.forEach((image) => {
      URL.revokeObjectURL(image.src)
    })
  }, [additionalImagePreviews]);

  const handleChange = (e) => {
    setErrorMessage('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDeedPhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setErrorMessage('');
    setFormData((currentData) => ({
      ...currentData,
      deedPhotoFile: file,
      deedPhotoUrl: URL.createObjectURL(file),
    }));
  };

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files ?? []);

    if (!files.length) {
      return;
    }

    setFormData((previousData) => {
      return {
        ...previousData,
        additionalImageFiles: [...previousData.additionalImageFiles, ...files],
      };
    });

    e.target.value = '';
  };

  const handleRemoveImage = (imageId) => {
    setFormData((previousData) => {
      return {
        ...previousData,
        additionalImageFiles: previousData.additionalImageFiles.filter(
          (file) => `${file.name}-${file.lastModified}` !== imageId,
        ),
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isCreateMode && !property) {
      return;
    }

    if (isCreateMode && !(formData.deedPhotoFile instanceof File)) {
      setErrorMessage(t('profile.deed_photo_required', 'Please upload the property deed image.'));
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        ...formData,
        status: isCreateMode ? OWNER_PROPERTY_STATUS : formData.status,
      };

      if (isCreateMode) {
        await createProperty(payload);
        toast.success(t('profile.property_created', 'Property created successfully!'));
      } else {
        await updateProperty(property.id, payload);
        toast.success(t('profile.property_updated', 'Property updated successfully!'));
      }

      navigate('/owner', { replace: true });
    } catch (error) {
      const msg = error.message || t('profile.save_failed', 'Failed to save the property.');
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if ((isCreateMode && isLoadingProfile) || (!isCreateMode && isLoading && !formData)) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-4">{t('profile.loading_properties', 'Loading your properties...')}</h2>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-4">{t('profile.property_not_found', 'Property not found')}</h2>
        <Link to="/owner" className="text-brand-gold hover:underline">
          {t('profile.back_to_properties', 'Back to My Properties')}
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light text-gray-900 dark:text-white uppercase tracking-widest mb-4">
            {isCreateMode ? t('profile.create_property', 'CREATE PROPERTY') : t('profile.edit_property', 'EDIT PROPERTY')}
          </h1>
          <div className="w-24 h-1 bg-brand-gold mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
             {isCreateMode ? t('profile.create_subtitle', 'Publish a new property for admin review') : `${t('profile.edit_subtitle', 'Update your property listing')} - ${formData.title}`}
          </p>
        </div>

        <Link
          to="/owner"
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-gold transition-colors font-medium tracking-wide uppercase"
        >
          {isRtl ? <FaAngleRight className="w-4 h-4" /> : <FaAngleLeft className="w-4 h-4" />}
          {t('profile.back_to_properties', 'BACK TO MY PROPERTIES')}
        </Link>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm dark:shadow-none p-8 md:p-10 max-w-4xl border border-gray-200 dark:border-white/10 transition-colors duration-300">
        <div className="mb-8 rounded-2xl border border-gray-200 bg-gray-50/70 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-xl aspect-video bg-gray-100 dark:bg-neutral-950">
                {formData.deedPhotoUrl ? (
                  <img
                    src={formData.deedPhotoUrl}
                    alt={t('profile.deed_photo', 'Deed Photo')}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    {t('profile.deed_photo_help', 'Upload the deed photo to create the property listing.')}
                  </div>
                )}
              </div>

              <label className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-brand-gold px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-brand-gold/90">
                {t('profile.change_deed_photo', 'Upload Deed Photo')}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleDeedPhotoChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500 dark:text-gray-400">
                  {t('profile.existing_images', 'Existing Images')}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {formData.existingImages.length > 0 ? formData.existingImages.map((image, index) => (
                    <img
                      key={`${image.id || image.image_path}-${index}`}
                      src={image.image_path}
                      alt={`${formData.title || t('profile.image_preview', 'Property image preview')} ${index + 1}`}
                      className="h-24 w-full rounded-lg object-cover"
                    />
                  )) : (
                    <p className="col-span-2 text-sm text-gray-500 dark:text-gray-400">
                      {t('profile.no_existing_images', 'No saved gallery images for this property yet.')}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-gray-200 px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-gray-700 transition hover:border-brand-gold hover:text-brand-gold dark:border-white/10 dark:text-gray-200">
                  {t('profile.add_images', 'Add Images')}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAddImages}
                    className="hidden"
                  />
                </label>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  {additionalImagePreviews.length > 0 ? additionalImagePreviews.map((image) => (
                    <div key={image.id} className="rounded-xl border border-gray-200 bg-white p-2 dark:border-white/10 dark:bg-neutral-900">
                      <img
                        src={image.src}
                        alt={image.name}
                        className="h-24 w-full rounded-lg object-cover"
                      />
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <p className="truncate text-[11px] font-medium uppercase tracking-widest-extra text-gray-500 dark:text-gray-400">
                          {image.name}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(image.id)}
                          className="rounded-md border border-red-200 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest-extra text-red-500 transition hover:bg-red-500 hover:text-white dark:border-red-500/40"
                        >
                          {t('profile.remove_image', 'Remove')}
                        </button>
                      </div>
                    </div>
                  )) : (
                    <p className="col-span-2 text-sm text-gray-500 dark:text-gray-400">
                      {t('profile.new_images_help', 'Upload extra property images to append to the listing gallery.')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {errorMessage ? (
            <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
              {errorMessage}
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            
            <div className="md:col-span-2">
              <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-medium mb-2 block">
                {t('profile.title', 'Title')}
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-lg text-gray-700 dark:text-gray-100 text-sm focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/10 transition-colors bg-gray-50/50 dark:bg-white/5"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-medium mb-2 block">
                {t('profile.approved', 'Approved')}
              </label>
              <input
                type="text"
                value={t(`profile.status_${formData.status}`, formData.status)}
                readOnly
                className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-lg text-gray-500 dark:text-gray-300 text-sm focus:outline-none bg-gray-100 dark:bg-white/10 cursor-default"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-medium mb-2 block">
                {t('profile.description', 'Description')}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
                className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-lg text-gray-700 dark:text-gray-100 text-sm focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/10 transition-colors bg-gray-50/50 dark:bg-white/5 resize-none"
              ></textarea>
            </div>

            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-medium mb-2 block">
                {t('profile.price', 'Price (SYP)')}
              </label>
              <input
                type="number"
                min="100"
                step="1"
                name="priceValue"
                value={formData.priceValue}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-lg text-gray-700 dark:text-gray-100 text-sm focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/10 transition-colors bg-gray-50/50 dark:bg-white/5"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-medium mb-2 block">
                {t('profile.location', 'Location')}
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-lg text-gray-700 dark:text-gray-100 text-sm focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/10 transition-colors bg-gray-50/50 dark:bg-white/5"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-medium mb-2 block">
                {t('profile.purpose', 'Purpose')}
              </label>
              <select
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-lg text-gray-700 dark:text-gray-100 text-sm focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/10 transition-colors bg-gray-50/50 dark:bg-white/5"
              >
                {PROPERTY_PURPOSE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {t(`profile.${option}`, option)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-medium mb-2 block">
                {t('profile.property_type', 'Property Type')}
              </label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-lg text-gray-700 dark:text-gray-100 text-sm focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/10 transition-colors bg-gray-50/50 dark:bg-white/5 appearance-none bg-no-repeat bg-position-[right_1rem_center] rtl:bg-position-[left_1rem_center]"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundSize: '1.5em 1.5em' }}
              >
                {PROPERTY_TYPE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {t(`profile.type_${option}`, option)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-medium mb-2 block">
                {t('profile.area', 'Area (sqm)')}
              </label>
              <input
                type="number"
                min="0"
                step="1"
                name="areaM2"
                value={formData.areaM2}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-lg text-gray-700 dark:text-gray-100 text-sm focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/10 transition-colors bg-gray-50/50 dark:bg-white/5"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-medium mb-2 block">
                {t('profile.rooms', 'Rooms')}
              </label>
              <input
                type="number"
                min="0"
                name="numberOfRooms"
                value={formData.numberOfRooms}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-lg text-gray-700 dark:text-gray-100 text-sm focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/10 transition-colors bg-gray-50/50 dark:bg-white/5"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-medium mb-2 block">
                {t('profile.bathrooms', 'Bathrooms')}
              </label>
              <input
                type="number"
                min="0"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-lg text-gray-700 dark:text-gray-100 text-sm focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/10 transition-colors bg-gray-50/50 dark:bg-white/5"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-medium mb-2 block">
                {t('profile.features', 'Features')}
              </label>
              <textarea
                name="features"
                value={formData.features}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-lg text-gray-700 dark:text-gray-100 text-sm focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/10 transition-colors bg-gray-50/50 dark:bg-white/5 resize-none"
              />
            </div>

          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-white/10 flex flex-col-reverse md:flex-row justify-end gap-3 md:gap-4">
             <Link
                to="/owner"
                className="w-full md:w-auto px-10 py-3 text-center bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 text-xs uppercase tracking-widest font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-all duration-300 block"
             >
                {t('profile.cancel', 'CANCEL')}
             </Link>
             <button
                type="submit"
               disabled={isSubmitting}
                className="w-full md:w-auto px-10 py-3 text-center bg-brand-gold text-white text-xs uppercase tracking-widest-extra font-semibold rounded-lg hover:bg-brand-gold/90 transition-all duration-300 cursor-pointer"
             >
               {isSubmitting
                ? t('profile.saving', 'Saving...')
                : isCreateMode
                  ? t('profile.create_property', 'CREATE PROPERTY')
                  : t('profile.save_changes', 'SAVE CHANGES')}
             </button>
          </div>
        </form>

      </div>
    </>
  );
};

export default PropertyEdit;
