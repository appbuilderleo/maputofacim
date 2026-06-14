'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type GaleriaItem = {
  id: string;
  titulo: string | null;
  descricao: string | null;
  url: string;
  tipo: string;
};

export default function GaleriaClient({ items }: { items: GaleriaItem[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxIndex]);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null && lightboxIndex < items.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    }
  };

  const currentItem = lightboxIndex !== null ? items[lightboxIndex] : null;

  return (
    <>
      <style>{`
        .galeria-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        @media (max-width: 1024px) {
          .galeria-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .galeria-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .galeria-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="galeria-grid">
        {items.map((item, index) => (
          <div 
            key={item.id} 
            onClick={() => item.tipo === 'IMAGEM' ? openLightbox(index) : window.open(item.url, '_blank')}
            style={{ 
              borderRadius: 'var(--radius-md)', 
              overflow: 'hidden', 
              boxShadow: '0 8px 30px rgba(0,0,0,0.08)', 
              background: 'white', 
              display: 'flex', 
              flexDirection: 'column', 
              transition: 'transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.4s',
              cursor: 'pointer',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.12)';
              const overlay = e.currentTarget.querySelector('.overlay') as HTMLElement;
              if (overlay) overlay.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)';
              const overlay = e.currentTarget.querySelector('.overlay') as HTMLElement;
              if (overlay) overlay.style.opacity = '0';
            }}
          >
            {item.tipo === 'IMAGEM' ? (
              <div style={{ width: '100%', height: '300px', position: 'relative', overflow: 'hidden' }}>
                <img 
                  src={item.url} 
                  alt={item.titulo || 'Imagem da Galeria'} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} 
                  loading="lazy" 
                />
                <div 
                  className="overlay"
                  style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    background: 'rgba(0,0,0,0.3)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    opacity: 0, 
                    transition: 'opacity 0.3s' 
                  }}
                >
                  <i className="ti ti-zoom-in" style={{ color: 'white', fontSize: '32px' }}></i>
                </div>
              </div>
            ) : (
              <div style={{ width: '100%', height: '300px', background: '#111', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="ti ti-player-play-filled" style={{ fontSize: '64px', color: 'var(--facim-gold)' }}></i>
                <div 
                  className="overlay"
                  style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    background: 'rgba(0,0,0,0.5)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    opacity: 0, 
                    transition: 'opacity 0.3s' 
                  }}
                >
                  <span style={{ color: 'white', fontWeight: 600, fontSize: '16px' }}>Assistir no YouTube</span>
                </div>
              </div>
            )}
            
            {item.titulo && (
              <div style={{ padding: '20px', background: 'white' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'var(--facim-dark)', marginBottom: '4px' }}>{item.titulo}</h4>
                {item.descricao && <p style={{ fontSize: '14px', color: 'var(--facim-gray-500)', margin: 0, lineHeight: 1.4 }}>{item.descricao}</p>}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && currentItem && (
        <div 
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            backdropFilter: 'blur(1px)',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes zoomIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
          `}</style>
          
          <button 
            onClick={closeLightbox}
            style={{ position: 'absolute', top: '24px', right: '32px', background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '8px' }}
          >
            <i className="ti ti-x" style={{ fontSize: '32px' }}></i>
          </button>

          {lightboxIndex > 0 && (
            <button 
              onClick={prevImage}
              style={{ position: 'absolute', left: '32px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', padding: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              <i className="ti ti-chevron-left" style={{ fontSize: '24px' }}></i>
            </button>
          )}

          {lightboxIndex < items.length - 1 && (
            <button 
              onClick={nextImage}
              style={{ position: 'absolute', right: '32px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', padding: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              <i className="ti ti-chevron-right" style={{ fontSize: '24px' }}></i>
            </button>
          )}

          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{ maxWidth: '100%', maxHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'zoomIn 0.3s ease' }}
          >
            {currentItem.tipo === 'IMAGEM' ? (
              <img 
                src={currentItem.url} 
                alt={currentItem.titulo || 'Galeria'} 
                style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain', borderRadius: '4px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }} 
              />
            ) : (
              <div style={{ width: '80vw', height: '45vw', maxWidth: '1000px', maxHeight: '562px', background: 'black' }}>
                <iframe src={currentItem.url.replace('watch?v=', 'embed/')} width="100%" height="100%" frameBorder="0" allowFullScreen></iframe>
              </div>
            )}
            
            {(currentItem.titulo || currentItem.descricao) && (
              <div style={{ color: 'white', textAlign: 'center', marginTop: '24px', maxWidth: '800px' }}>
                {currentItem.titulo && <h3 style={{ fontSize: '24px', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>{currentItem.titulo}</h3>}
                {currentItem.descricao && <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)' }}>{currentItem.descricao}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
