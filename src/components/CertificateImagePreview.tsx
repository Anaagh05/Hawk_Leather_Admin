import React from 'react';

interface CertificateImagePreviewProps {
  src: string;
  alt?: string;
}

export function CertificateImagePreview({
  src,
  alt = 'Certificate preview',
}: CertificateImagePreviewProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '12px',
        padding: '16px',
        minHeight: '160px',
        maxHeight: '280px',
        borderRadius: '10px',
        border: '1px solid #e8dcc8',
        backgroundColor: '#faf6f0',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          display: 'block',
          maxWidth: '100%',
          maxHeight: '240px',
          width: 'auto',
          height: 'auto',
          objectFit: 'contain',
        }}
      />
    </div>
  );
}
