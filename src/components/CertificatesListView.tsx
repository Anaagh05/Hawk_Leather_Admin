import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Label } from './ui/label';
import { LandingPageToggle } from './LandingPageToggle';
import { Certificate } from '../types';
import { certificateService } from '../services/certificateService';
import { CertificateCard } from './CertificateCard';
import { EditCertificateDialog } from './EditCertificateDialog';

const ITEMS_PER_PAGE = 6;

export function CertificatesListView() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [columns, setColumns] = useState(3);
  const [shownOnLandingPage, setShownOnLandingPage] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const totalPages = Math.ceil(certificates.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = certificates.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [shown, list] = await Promise.all([
        certificateService.getShownOnLandingPage(),
        certificateService.getAllCertificates(),
      ]);
      setShownOnLandingPage(shown);
      setCertificates(list);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Internal server error';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const updateColumns = () => {
      if (typeof window === 'undefined') return;
      const width = window.innerWidth;
      if (width < 640) {
        setColumns(1);
      } else if (width < 1024) {
        setColumns(2);
      } else {
        setColumns(3);
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [certificates.length, currentPage, totalPages]);

  const handleToggleChange = async (checked: boolean) => {
    const previous = shownOnLandingPage;
    setShownOnLandingPage(checked);
    setToggleLoading(true);

    try {
      const updated = await certificateService.updateShownOnLandingPage(checked);
      setShownOnLandingPage(updated);
      toast.success('Landing page visibility updated successfully');
    } catch (error: unknown) {
      setShownOnLandingPage(previous);
      const message =
        error instanceof Error ? error.message : 'Internal server error';
      toast.error(message);
    } finally {
      setToggleLoading(false);
    }
  };

  const handleEdit = (certificate: Certificate) => {
    setEditingCertificate(certificate);
    setIsEditOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) {
      return;
    }

    try {
      await certificateService.deleteCertificate(id);
      setCertificates(prev => prev.filter(c => c.id !== id));
      toast.success('Certificate deleted successfully');
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Internal server error';
      toast.error(message);
    }
  };

  const handleUpdated = (updated: Certificate) => {
    setCertificates(prev =>
      prev.map(c => (c.id === updated.id ? updated : c)),
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45 }}
      style={{ width: '100%' }}
    >
      <div
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            margin: '0 18px 20px',
            flexWrap: 'wrap',
          }}
        >
          <Label
            htmlFor="landing-page-toggle"
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#7c3a10',
              margin: 0,
            }}
          >
            Active:
          </Label>
          <LandingPageToggle
            id="landing-page-toggle"
            checked={shownOnLandingPage}
            onCheckedChange={handleToggleChange}
            disabled={toggleLoading || loading}
          />
        </div>

        {loading && certificates.length === 0 ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '48px 0',
            }}
          >
            <Loader2
              size={32}
              style={{ color: '#b45309', animation: 'spin 1s linear infinite' }}
            />
          </div>
        ) : currentItems.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              color: '#9ca3af',
              padding: '48px 0',
              fontSize: '15px',
            }}
          >
            No certificates found
          </div>
        ) : (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                gap: '24px',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              {currentItems.map((certificate, index) => (
                <div
                  key={certificate.id}
                  style={{
                    minWidth: 0,
                    minHeight: '380px',
                  }}
                >
                  <CertificateCard
                    certificate={certificate}
                    index={index}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '32px',
                }}
              >
                <PaginationBtn
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} />
                </PaginationBtn>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <PaginationBtn
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    active={currentPage === page}
                  >
                    {page}
                  </PaginationBtn>
                ))}

                <PaginationBtn
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={16} />
                </PaginationBtn>
              </div>
            )}
          </>
        )}
      </div>

      <EditCertificateDialog
        certificate={editingCertificate}
        open={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditingCertificate(null);
        }}
        onUpdated={handleUpdated}
      />
    </motion.div>
  );
}

function PaginationBtn({
  children,
  onClick,
  disabled = false,
  active = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  const [hover, setHover] = React.useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        border: active ? '1.5px solid #d97706' : '1.5px solid #e5e7eb',
        backgroundColor: active
          ? '#d97706'
          : hover && !disabled
            ? '#fff8ee'
            : '#ffffff',
        color: active ? '#ffffff' : disabled ? '#d1d5db' : '#374151',
        fontSize: '13px',
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background-color 0.18s ease, border-color 0.18s ease',
        fontFamily: 'inherit',
      }}
    >
      {children}
    </button>
  );
}
