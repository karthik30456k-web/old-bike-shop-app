import React, { useState, useEffect, useRef } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { RotateCw, Play, Pause, ChevronLeft, ChevronRight, Eye, Sparkles, Compass } from 'lucide-react';

/**
 * 3D Showroom Turntable and Multi-Angle Image Scroller
 */
export const BikeViewer3D = ({
  bike,
  isOpen,
  onClose,
  initialAngle = 0
}) => {
  if (!bike) return null;

  // Prepare 360 multi-angle image views
  const photos = (bike.photos && bike.photos.length > 0) ? bike.photos : [
    'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'
  ];

  // 8 angle steps for a full 360 degree turntable rotation
  const angles = [
    { deg: 0, label: '0° Front View', photoIdx: 0 },
    { deg: 45, label: '45° Quarter Sport', photoIdx: 1 % photos.length },
    { deg: 90, label: '90° Side Profile', photoIdx: 2 % photos.length },
    { deg: 135, label: '135° Rear Quarter', photoIdx: 3 % photos.length },
    { deg: 180, label: '180° Rear Stance', photoIdx: 0 },
    { deg: 225, label: '225° Exhaust Angle', photoIdx: 1 % photos.length },
    { deg: 270, label: '270° Cockpit & Tank', photoIdx: 2 % photos.length },
    { deg: 315, label: '315° Front Dynamic', photoIdx: 3 % photos.length }
  ];

  const [currentAngle, setCurrentAngle] = useState(initialAngle);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragStartAngle, setDragStartAngle] = useState(0);
  const [headlightOn, setHeadlightOn] = useState(true);
  const stageRef = useRef(null);
  const scrollerRef = useRef(null);

  // Auto 360° spin loop
  useEffect(() => {
    if (!isAutoRotating || !isOpen) return;
    const interval = setInterval(() => {
      setCurrentAngle((prev) => (prev + 1) % 360);
    }, 45 / rotationSpeed);
    return () => clearInterval(interval);
  }, [isAutoRotating, rotationSpeed, isOpen]);

  // Determine active frame
  const currentStep = Math.floor((currentAngle / 360) * angles.length) % angles.length;
  const activeAngleData = angles[currentStep];
  const activePhoto = photos[activeAngleData.photoIdx];

  // Mouse drag to rotate
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX || (e.touches && e.touches[0].clientX) || 0);
    setDragStartAngle(currentAngle);
    setIsAutoRotating(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = clientX - startX;
    const newAngle = (dragStartAngle + Math.round(deltaX * 0.7) + 3600) % 360;
    setCurrentAngle(newAngle);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Scroll filmstrip thumbnail into view
  const selectPhotoByIndex = (idx) => {
    const targetAngle = (idx / photos.length) * 360;
    setCurrentAngle(Math.round(targetAngle));
    setIsAutoRotating(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`3D Showroom Turntable: ${bike.brand} ${bike.model}`}
      subtitle={`Interactive 360° Virtual Inspection • ${bike.year} • ${bike.mileage || '45 km/l'}`}
      maxWidth="940px"
      footer={
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Button
              variant={isAutoRotating ? 'primary' : 'outline'}
              size="sm"
              icon={isAutoRotating ? Pause : Play}
              onClick={() => setIsAutoRotating(!isAutoRotating)}
            >
              {isAutoRotating ? 'Pause' : 'Auto 360°'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRotationSpeed((s) => (s === 1 ? 2 : 1))}
            >
              Speed: {rotationSpeed}x
            </Button>
            <Button
              variant={headlightOn ? 'secondary' : 'ghost'}
              size="sm"
              icon={Sparkles}
              onClick={() => setHeadlightOn(!headlightOn)}
            >
              {headlightOn ? 'Light: On' : 'Light: Off'}
            </Button>
          </div>
          <Button variant="primary" onClick={onClose}>
            Done
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* 3D Stage Viewport */}
        <div
          ref={stageRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          style={{
            position: 'relative',
            height: 'min(400px, 45vh)',
            backgroundColor: 'var(--bg-app)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            perspective: '1200px'
          }}
        >
          {/* Ambient Lighting & Headlight Beam */}
          {headlightOn && (
            <>
              <div
                style={{
                  position: 'absolute',
                  top: '-40px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '500px',
                  height: '240px',
                  background: 'radial-gradient(ellipse at 50% 0%, var(--primary-glow) 0%, transparent 70%)',
                  pointerEvents: 'none',
                  zIndex: 1
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'radial-gradient(circle at 50% 60%, rgba(255,255,255,0.06) 0%, transparent 65%)',
                  pointerEvents: 'none'
                }}
              />
            </>
          )}

          {/* 3D Turntable Pedestal Floor */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: `translateX(-50%) rotateX(74deg) rotateZ(${currentAngle}deg)`,
              width: '460px',
              height: '460px',
              borderRadius: '50%',
              border: '2px dashed var(--primary-border)',
              boxShadow: '0 0 50px var(--primary-glow), inset 0 0 40px var(--primary-glow)',
              transition: isDragging ? 'none' : 'transform 120ms ease-out',
              pointerEvents: 'none'
            }}
          >
            {/* 360 Tick Markers */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => (
              <div
                key={d}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${d}deg) translateY(-220px)`,
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)'
                }}
              />
            ))}
          </div>

          {/* 3D Bike Image Layer with Perspective Tilt & Elevation */}
          <div
            style={{
              position: 'relative',
              zIndex: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <img
              src={activePhoto}
              alt={`${bike.brand} ${bike.model} at ${currentAngle}°`}
              style={{
                maxWidth: '560px',
                maxHeight: '300px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.4))',
                pointerEvents: 'none'
              }}
            />

            {/* Simulated 3D Floor Shadow */}
            <div
              style={{
                width: '380px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0,0,0,0.35)',
                filter: 'blur(10px)',
                marginTop: '-10px',
                pointerEvents: 'none'
              }}
            />
          </div>

          {/* Floating 360 HUD Badges */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              display: 'flex',
              gap: '8px',
              zIndex: 10
            }}
          >
            <div
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 700,
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Compass size={14} style={{ color: 'var(--primary)' }} />
              <span>{activeAngleData.label} ({currentAngle}°)</span>
            </div>

            <div
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(5, 150, 105, 0.2)',
                color: '#34d399',
                fontSize: '0.8rem',
                fontWeight: 700,
                border: '1px solid rgba(5, 150, 105, 0.3)',
                backdropFilter: 'blur(8px)'
              }}
            >
              ⚡ {bike.mileage || '45 km/l'}
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              color: '#94a3b8',
              fontSize: '0.75rem',
              fontWeight: 600,
              zIndex: 10
            }}
          >
            👆 Drag horizontally or use slider to rotate
          </div>

          {/* Quick angle step arrows */}
          <button
            onClick={() => {
              setCurrentAngle((a) => (a - 45 + 360) % 360);
              setIsAutoRotating(false);
            }}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)',
              zIndex: 10
            }}
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={() => {
              setCurrentAngle((a) => (a + 45) % 360);
              setIsAutoRotating(false);
            }}
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)',
              zIndex: 10
            }}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* 360 Degree Range Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '0 8px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', minWidth: '45px' }}>
            0°
          </span>
          <input
            type="range"
            min="0"
            max="359"
            value={currentAngle}
            onChange={(e) => {
              setCurrentAngle(Number(e.target.value));
              setIsAutoRotating(false);
            }}
            style={{
              flex: 1,
              accentColor: 'var(--primary)',
              cursor: 'pointer'
            }}
          />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', minWidth: '45px', textAlign: 'right' }}>
            360°
          </span>
        </div>

        {/* Multi-Angle Filmstrip Scroller */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Showroom Photo Angles & High-Res Details
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Click any photo or swipe horizontally
            </span>
          </div>

          <div
            ref={scrollerRef}
            className="smooth-scroller-track"
            style={{
              display: 'flex',
              gap: '12px',
              overflowX: 'auto',
              padding: '6px 2px'
            }}
          >
            {photos.map((p, idx) => {
              const isSelected = activePhoto === p;
              const angleLabel = idx === 0 ? 'Front Look' : idx === 1 ? 'Front Tyre ⭐' : idx === 2 ? 'Back Tyre ⭐' : idx === 3 ? 'Back Look' : `Extra View #${idx - 3}`;
              return (
                <div
                  key={idx}
                  onClick={() => selectPhotoByIndex(idx)}
                  className="smooth-scroller-item"
                  style={{
                    position: 'relative',
                    width: '140px',
                    height: '88px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    boxShadow: isSelected ? '0 0 12px var(--primary-glow)' : 'var(--shadow-sm)',
                    opacity: isSelected ? 1 : 0.75
                  }}
                >
                  <img
                    src={p}
                    alt={angleLabel}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '3px 6px',
                      backgroundColor: idx === 1 || idx === 2 ? 'rgba(217, 119, 6, 0.85)' : 'rgba(0,0,0,0.7)',
                      color: '#ffffff',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      textAlign: 'center'
                    }}
                  >
                    {angleLabel}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};

/**
 * Compact 3D Card Image Scroller with Floating 360 Spin Badge
 */
export const BikeCardImageWith3D = ({
  photos = [],
  bike,
  onOpen3D,
  height = '190px'
}) => {
  const imageList = photos.length > 0 ? photos : [
    'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height,
        overflow: 'hidden',
        backgroundColor: '#0f172a'
      }}
    >
      <img
        src={imageList[currentIndex]}
        alt={bike?.model || 'Bike'}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />

      {/* Photo Angle Tag Badge */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          padding: '4px 8px',
          borderRadius: '4px',
          backgroundColor: currentIndex === 1 || currentIndex === 2 ? 'rgba(217, 119, 6, 0.9)' : 'rgba(15, 23, 42, 0.85)',
          color: '#ffffff',
          fontSize: '0.7rem',
          fontWeight: 800,
          border: '1px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(6px)',
          zIndex: 6,
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        <span>
          {currentIndex === 0 ? '🏍️ Front' : currentIndex === 1 ? '🛞 Front Tyre' : currentIndex === 2 ? '🛞 Back Tyre' : currentIndex === 3 ? '🏍️ Back Look' : `📷 Angle ${currentIndex + 1}`}
        </span>
      </div>

      {/* 360 Spin Trigger Badge */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (onOpen3D) onOpen3D(bike);
        }}
        title="Open 3D Virtual Showroom Turntable"
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          padding: '6px 12px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          color: '#ffffff',
          border: '1px solid rgba(255,255,255,0.2)',
          fontSize: '0.74rem',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          backdropFilter: 'blur(8px)',
          zIndex: 6
        }}
      >
        <RotateCw size={13} />
        <span>360° 3D</span>
      </button>

      {/* Image Dots Indicator if multiple photos */}
      {imageList.length > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '5px',
            zIndex: 6,
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)'
          }}
        >
          {imageList.map((_, i) => (
            <div
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(i);
              }}
              style={{
                width: i === currentIndex ? '14px' : '6px',
                height: '6px',
                borderRadius: '3px',
                backgroundColor: i === currentIndex ? 'var(--primary)' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
