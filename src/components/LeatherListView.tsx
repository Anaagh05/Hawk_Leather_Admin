import React, { useEffect, useState } from 'react';
import { LeatherCard } from './LeatherCard';
import { useLeather } from '../context/LeatherContext';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { LeatherCategory, LeatherItem } from '../types';
import { EditLeatherDialog } from './EditLeatherDialog';
import { motion } from 'motion/react';

const ITEMS_PER_PAGE = 6;
const LEATHER_CATEGORIES: { value: LeatherCategory; label: string }[] = [
  { value: 'shoe_upper', label: 'Shoe Upper' },
  { value: 'sports_leather', label: 'Sports Leather' },
  { value: 'upholestry', label: 'Upholestry' },
  { value: 'garment_and_goods', label: 'Garment & Goods' },
];

export function LeatherListView() {
  const { items, loading, deleteLeather, fetchLeather, activeCategory } = useLeather();
  const [currentPage, setCurrentPage] = useState(1);
  const [editingItem, setEditingItem] = useState<LeatherItem | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [columns, setColumns] = useState(3);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    // Always default to shoe_upper when opening Leather from sidebar
    fetchLeather('shoe_upper');
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  }, [items.length, currentPage, totalPages]);

  const handleEdit = (item: LeatherItem) => {
    setEditingItem(item);
    setIsEditOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this leather product?')) {
      await deleteLeather(id);
    }
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
        {/* Category switch navbar */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            padding: '6px',
            borderRadius: '999px',
            background: '#f3f4f6',
            border: '1px solid #e5e7eb',
            margin: '10px 18px',
            flexWrap: 'wrap',
            width:"55%",
            justifyContent: 'start',
          }}
        >
          {LEATHER_CATEGORIES.map(cat => {
            const active = cat.value === activeCategory;
            return (
              <button
                key={cat.value}
                onClick={() => {
                  if (cat.value === activeCategory) return;
                  setCurrentPage(1);
                  fetchLeather(cat.value);
                }}
                type="button"
                style={{
                  padding: '8px 16px',
                  borderRadius: '999px',
                  border: active ? '1px solid #b45309' : '1px solid transparent',
                  background: active ? '#b45309' : 'transparent',
                  color: active ? '#ffffff' : '#374151',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'background-color 0.18s ease, border-color 0.18s ease',
                  fontFamily: 'inherit',
                  minWidth: '140px',
                  textAlign: 'center',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {loading && items.length === 0 ? (
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
          No leather products found
        </div>
        ) : (
        <>
          {/*
            ─────────────────────────────────────────────
            THE GRID — pure CSS, no Tailwind, no shadcn.
            3 equal columns on desktop, adapts on small screens.
            ─────────────────────────────────────────────
          */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              gap: '24px',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {currentItems.map((item, index) => (
              <div
                key={item.id}
                style={{
                  minWidth: 0,       /* prevent grid blowout */
                  minHeight: '340px',
                }}
              >
                <LeatherCard
                  item={item}
                  index={index}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>

          {/* ── Pagination ── */}
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
              {/* Prev */}
              <PaginationBtn
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </PaginationBtn>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PaginationBtn
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  active={currentPage === page}
                >
                  {page}
                </PaginationBtn>
              ))}

              {/* Next */}
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

      <EditLeatherDialog
        item={editingItem}
        open={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditingItem(null);
        }}
      />
    </motion.div>
  );
}

/* ─── Tiny custom pagination button ─────────────────────────── */
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