import React from 'react';
import { Certificate } from '../types';
import { Pencil, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

interface CertificateCardProps {
  certificate: Certificate;
  index: number;
  onEdit: (certificate: Certificate) => void;
  onDelete: (id: string) => void;
}

export function CertificateCard({
  certificate,
  index,
  onEdit,
  onDelete,
}: CertificateCardProps) {
  const [editHover, setEditHover] = React.useState(false);
  const [deleteHover, setDeleteHover] = React.useState(false);
  const [cardHover, setCardHover] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      style={{ width: '100%', height: '100%' }}
    >
      <div
        onMouseEnter={() => setCardHover(true)}
        onMouseLeave={() => setCardHover(false)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid #f0e6d3',
          boxShadow: cardHover
            ? '0 10px 32px rgba(180, 90, 10, 0.16)'
            : '0 2px 10px rgba(0, 0, 0, 0.07)',
          transform: cardHover ? 'translateY(-4px)' : 'translateY(0)',
          transition: 'box-shadow 0.25s ease, transform 0.25s ease',
        }}
      >
        <div
          style={{
            width: '100%',
            aspectRatio: '4 / 3',
            flexShrink: 0,
            overflow: 'hidden',
            backgroundColor: '#f5ede0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px',
            boxSizing: 'border-box',
          }}
        >
          <img
            src={certificate.certificateImageUrl}
            alt={certificate.certificateName}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              transform: cardHover ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 0.4s ease',
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: '16px',
            gap: '10px',
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '15px',
              fontWeight: 700,
              color: '#7c3a10',
              lineHeight: 1.35,
              fontFamily: "'Georgia', serif",
            }}
          >
            {certificate.certificateName}
          </h3>

          <p
            style={{
              margin: 0,
              fontSize: '13px',
              color: '#666',
              lineHeight: 1.6,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              flex: 1,
            }}
          >
            {certificate.certificateDescription}
          </p>

          <div
            style={{
              display: 'flex',
              gap: '8px',
              marginTop: 'auto',
              paddingTop: '12px',
            }}
          >
            <button
              type="button"
              onClick={() => onEdit(certificate)}
              onMouseEnter={() => setEditHover(true)}
              onMouseLeave={() => setEditHover(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 14px',
                borderRadius: '7px',
                border: '1.5px solid #d97706',
                backgroundColor: editHover ? '#d97706' : 'transparent',
                color: editHover ? '#ffffff' : '#d97706',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.18s ease, color 0.18s ease',
                fontFamily: 'inherit',
              }}
            >
              <Pencil size={14} />
              Edit
            </button>

            <button
              type="button"
              onClick={() => onDelete(certificate.id)}
              onMouseEnter={() => setDeleteHover(true)}
              onMouseLeave={() => setDeleteHover(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 14px',
                borderRadius: '7px',
                border: '1.5px solid #dc2626',
                backgroundColor: deleteHover ? '#b91c1c' : '#dc2626',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.18s ease',
                fontFamily: 'inherit',
              }}
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
