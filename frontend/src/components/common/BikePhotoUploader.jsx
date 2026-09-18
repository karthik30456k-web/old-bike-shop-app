import React, { useState, useRef } from 'react';
import { Camera, Upload, Trash2, Plus, Image as ImageIcon, CheckCircle, AlertCircle, RefreshCw, Link as LinkIcon } from 'lucide-react';
import { Button } from './Button';

/**
 * 4-Angle Mandatory Bike Inspection Photo Pack
 * Enforces:
 * 1. Front Look (Required)
 * 2. Front Tyre (Compulsory)
 * 3. Back Tyre (Compulsory)
 * 4. Back Look (Required)
 * + Option to add additional photos (Side Profile, Odometer, Engine, etc.)
 */

export const MANDATORY_PHOTO_SLOTS = [
  {
    id: 'front',
    index: 0,
    label: '1. Front Look',
    shortLabel: 'Front Look',
    icon: '🏍️',
    isTyre: false,
    compulsoryBadge: 'Required',
    hint: 'Clear headlight, visor & front styling',
    presetUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'front_tyre',
    index: 1,
    label: '2. Front Tyre',
    shortLabel: 'Front Tyre',
    icon: '🛞',
    isTyre: true,
    compulsoryBadge: 'Compulsory Tyre ⭐',
    hint: 'Tread depth, rim, disc plate & brake condition',
    presetUrl: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'back_tyre',
    index: 2,
    label: '3. Back Tyre',
    shortLabel: 'Back Tyre',
    icon: '🛞',
    isTyre: true,
    compulsoryBadge: 'Compulsory Tyre ⭐',
    hint: 'Rear tread grip, alloy wheel & chain/sprocket',
    presetUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'back_look',
    index: 3,
    label: '4. Back Look',
    shortLabel: 'Back Look',
    icon: '🏍️',
    isTyre: false,
    compulsoryBadge: 'Required',
    hint: 'Tail light, exhaust stance & rear number plate',
    presetUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'
  }
];

export function validateBikePhotos(photosArray) {
  const list = Array.isArray(photosArray) ? photosArray : [];
  const missing = [];
  if (!list[0] || !list[0].trim()) missing.push('Front Look (Photo 1)');
  if (!list[1] || !list[1].trim()) missing.push('Front Tyre (Photo 2 - Compulsory)');
  if (!list[2] || !list[2].trim()) missing.push('Back Tyre (Photo 3 - Compulsory)');
  if (!list[3] || !list[3].trim()) missing.push('Back Look (Photo 4)');

  const validCount = list.filter(p => p && p.trim()).length;
  const hasBothTyres = Boolean(list[1] && list[1].trim() && list[2] && list[2].trim());
  const isValid = missing.length === 0;

  let errorMessage = null;
  if (!isValid) {
    if (!hasBothTyres) {
      errorMessage = 'Front Tyre and Back Tyre photos are COMPULSORY! Please upload all 4 mandatory angles.';
    } else {
      errorMessage = `Minimum 4 photos required. Missing: ${missing.join(', ')}`;
    }
  }

  return {
    isValid,
    missing,
    hasBothTyres,
    validCount,
    errorMessage
  };
}

export const BikePhotoUploader = ({
  photos = [],
  onChange,
  error = null
}) => {
  const [activeUrlInputIdx, setActiveUrlInputIdx] = useState(null);
  const [tempUrl, setTempUrl] = useState('');
  const fileInputRefs = useRef({});

  // Ensure an array of at least 4 items
  const photosList = Array.isArray(photos) ? [...photos] : [];
  while (photosList.length < 4) {
    photosList.push('');
  }

  const { isValid, missing, hasBothTyres, validCount, errorMessage } = validateBikePhotos(photosList);

  const handleSetPhotoAt = (index, value) => {
    const updated = [...photosList];
    updated[index] = value;
    // Clean trailing empty strings if beyond index 3
    while (updated.length > 4 && !updated[updated.length - 1]) {
      updated.pop();
    }
    onChange(updated);
    setActiveUrlInputIdx(null);
    setTempUrl('');
  };

  const handleFileUpload = (index, e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      handleSetPhotoAt(index, uploadEvent.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (index) => {
    if (index < 4) {
      handleSetPhotoAt(index, '');
    } else {
      const updated = photosList.filter((_, idx) => idx !== index);
      onChange(updated);
    }
  };

  const handleAddExtraSlot = () => {
    const updated = [...photosList, ''];
    onChange(updated);
  };

  const handleFillAllPresets = () => {
    const updated = [
      MANDATORY_PHOTO_SLOTS[0].presetUrl,
      MANDATORY_PHOTO_SLOTS[1].presetUrl,
      MANDATORY_PHOTO_SLOTS[2].presetUrl,
      MANDATORY_PHOTO_SLOTS[3].presetUrl,
      ...photosList.slice(4)
    ];
    onChange(updated);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      padding: '16px',
      backgroundColor: 'var(--bg-surface-elevated)',
      borderRadius: 'var(--radius-md)',
      border: `1px solid ${error ? 'var(--color-danger)' : 'var(--border-color)'}`,
      gridColumn: 'span 2'
    }}>
      {/* Header with Title & Rules */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Camera size={18} style={{ color: 'var(--primary)' }} />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Bike Inspection Photos (Minimum 4 Required)
            </h4>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
            Upload standard 4-angle pack. <strong>Front Tyre & Back Tyre photos are COMPULSORY</strong> for quality verification.
          </p>
        </div>

        {/* Status Pill & 1-Click Test Preset Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={handleFillAllPresets}
            title="Auto-fill with 4 showroom sample photos for rapid testing"
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--primary-border)',
              backgroundColor: 'var(--primary-bg)',
              color: 'var(--primary)',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <RefreshCw size={12} />
            <span>Fill 4 Sample Photos</span>
          </button>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: isValid ? 'rgba(5, 150, 105, 0.15)' : 'rgba(239, 68, 68, 0.12)',
            color: isValid ? '#047857' : '#dc2626',
            border: `1px solid ${isValid ? 'rgba(5, 150, 105, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            fontSize: '0.76rem',
            fontWeight: 700
          }}>
            {isValid ? (
              <>
                <CheckCircle size={14} />
                <span>4 / 4 Angles Verified ✓</span>
              </>
            ) : (
              <>
                <AlertCircle size={14} />
                <span>{validCount} / 4 Uploaded</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Validation warning banner if incomplete */}
      {!isValid && (
        <div style={{
          padding: '8px 12px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          color: 'var(--text-primary)',
          fontSize: '0.78rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertCircle size={16} style={{ color: '#d97706', flexShrink: 0 }} />
          <span>
            <strong>Required:</strong> Front Look, <strong>Front Tyre (Compulsory)</strong>, <strong>Back Tyre (Compulsory)</strong>, and Back Look.
          </span>
        </div>
      )}

      {/* 4 Mandatory Slots Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '12px'
      }}>
        {MANDATORY_PHOTO_SLOTS.map((slot) => {
          const photoVal = photosList[slot.index];
          const hasPhoto = Boolean(photoVal && photoVal.trim());
          const isUrlInputOpen = activeUrlInputIdx === slot.index;

          return (
            <div
              key={slot.id}
              style={{
                borderRadius: 'var(--radius-md)',
                border: hasPhoto
                  ? '2px solid var(--border-color)'
                  : slot.isTyre
                  ? '2px dashed #f59e0b' // Highlight tyres with amber dashed border
                  : '2px dashed var(--border-color)',
                backgroundColor: hasPhoto ? '#0f172a' : 'var(--bg-card)',
                padding: hasPhoto ? '0' : '12px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: hasPhoto ? 'space-between' : 'center',
                minHeight: '160px',
                overflow: 'hidden'
              }}
            >
              {hasPhoto ? (
                /* Uploaded Photo Preview Card */
                <div style={{ position: 'relative', width: '100%', height: '160px', backgroundColor: '#000000' }}>
                  <img
                    src={photoVal}
                    alt={slot.label}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />

                  {/* Top Badge Overlay */}
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(15, 23, 42, 0.88)',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    backdropFilter: 'blur(6px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    <span>{slot.icon}</span>
                    <span>{slot.shortLabel}</span>
                    {slot.isTyre && (
                      <span style={{ color: '#fbbf24', marginLeft: '2px' }}>⭐</span>
                    )}
                  </div>

                  {/* Action Overlay */}
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    display: 'flex',
                    gap: '6px'
                  }}>
                    <button
                      type="button"
                      onClick={() => fileInputRefs.current[slot.index]?.click()}
                      title="Replace photo"
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(15, 23, 42, 0.85)',
                        color: '#ffffff',
                        border: '1px solid rgba(255,255,255,0.3)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(slot.index)}
                      title="Delete photo"
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(239, 68, 68, 0.9)',
                        color: '#ffffff',
                        border: 'none',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ) : (
                /* Empty Upload Slot */
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' }}>
                  {/* Angle Icon & Label */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '1.2rem' }}>{slot.icon}</span>
                    <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      {slot.label}
                    </span>
                  </div>

                  {/* Compulsory Tag */}
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: slot.isTyre ? 'rgba(245, 158, 11, 0.2)' : 'var(--primary-bg)',
                    color: slot.isTyre ? '#d97706' : 'var(--primary)',
                    border: `1px solid ${slot.isTyre ? 'rgba(245, 158, 11, 0.4)' : 'var(--primary-border)'}`
                  }}>
                    {slot.compulsoryBadge}
                  </span>

                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.3 }}>
                    {slot.hint}
                  </p>

                  {/* Action Buttons */}
                  {isUrlInputOpen ? (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                      <input
                        type="url"
                        placeholder="https://...image.jpg"
                        value={tempUrl}
                        onChange={(e) => setTempUrl(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          fontSize: '0.78rem',
                          borderRadius: '4px',
                          border: '1px solid var(--border-color)',
                          backgroundColor: 'var(--bg-input)',
                          color: 'var(--text-primary)'
                        }}
                      />
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleSetPhotoAt(slot.index, tempUrl)}
                          disabled={!tempUrl.trim()}
                          style={{ flex: 1, padding: '4px' }}
                        >
                          Save URL
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => { setActiveUrlInputIdx(null); setTempUrl(''); }}
                          style={{ padding: '4px' }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', marginTop: '4px' }}>
                      <Button
                        size="sm"
                        variant="outline"
                        icon={Upload}
                        onClick={() => fileInputRefs.current[slot.index]?.click()}
                        style={{ width: '100%' }}
                      >
                        Upload Photo
                      </Button>

                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                        <button
                          type="button"
                          onClick={() => { setActiveUrlInputIdx(slot.index); setTempUrl(''); }}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--text-muted)',
                            fontSize: '0.72rem',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                        >
                          Paste URL
                        </button>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>•</span>
                        <button
                          type="button"
                          onClick={() => handleSetPhotoAt(slot.index, slot.presetUrl)}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--primary)',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                        >
                          Use Preset
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Hidden File Input for Native File Picker */}
              <input
                ref={(el) => (fileInputRefs.current[slot.index] = el)}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(slot.index, e)}
                style={{ display: 'none' }}
              />
            </div>
          );
        })}
      </div>

      {/* Additional Photos Section (Beyond the 4 Mandatory Angles) */}
      <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '12px', marginTop: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Additional Inspection Photos (Optional)
            </span>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block' }}>
              Side profile, odometer reading, engine closeup, or scratch details.
            </span>
          </div>

          <Button
            type="button"
            size="sm"
            variant="secondary"
            icon={Plus}
            onClick={handleAddExtraSlot}
          >
            Add More Photo
          </Button>
        </div>

        {photosList.length > 4 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '10px'
          }}>
            {photosList.slice(4).map((extraPhoto, i) => {
              const extraIndex = i + 4;
              const hasPhoto = Boolean(extraPhoto && extraPhoto.trim());

              return (
                <div
                  key={extraIndex}
                  style={{
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: hasPhoto ? '#000000' : 'var(--bg-card)',
                    height: '120px',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {hasPhoto ? (
                    <>
                      <img
                        src={extraPhoto}
                        alt={`Extra Photo ${i + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span style={{
                        position: 'absolute',
                        top: '6px',
                        left: '6px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        color: '#ffffff',
                        fontSize: '0.68rem',
                        fontWeight: 700
                      }}>
                        Extra #{i + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(extraIndex)}
                        style={{
                          position: 'absolute',
                          bottom: '6px',
                          right: '6px',
                          padding: '4px 6px',
                          borderRadius: '4px',
                          backgroundColor: 'rgba(239, 68, 68, 0.85)',
                          color: '#ffffff',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '10px' }}>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                        Extra Angle #{i + 1}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        icon={Upload}
                        onClick={() => fileInputRefs.current[extraIndex]?.click()}
                      >
                        Choose File
                      </Button>
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(extraIndex)}
                        style={{
                          marginTop: '6px',
                          border: 'none',
                          background: 'transparent',
                          color: 'var(--color-danger)',
                          fontSize: '0.68rem',
                          cursor: 'pointer'
                        }}
                      >
                        Remove Slot
                      </button>
                    </div>
                  )}

                  <input
                    ref={(el) => (fileInputRefs.current[extraIndex] = el)}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(extraIndex, e)}
                    style={{ display: 'none' }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
