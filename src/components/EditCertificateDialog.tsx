import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Certificate } from '../types';
import { toast } from 'sonner';
import { certificateService } from '../services/certificateService';
import { CertificateImagePreview } from './CertificateImagePreview';

interface EditCertificateDialogProps {
  certificate: Certificate | null;
  open: boolean;
  onClose: () => void;
  onUpdated: (certificate: Certificate) => void;
}

export function EditCertificateDialog({
  certificate,
  open,
  onClose,
  onUpdated,
}: EditCertificateDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (certificate) {
      setName(certificate.certificateName);
      setDescription(certificate.certificateDescription);
      setImagePreview(certificate.certificateImageUrl);
      setImageFile(null);
    }
  }, [certificate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certificate) return;

    try {
      const submitData = new FormData();

      if (name.trim() !== certificate.certificateName) {
        submitData.append('certificateName', name.trim());
      }
      if (description.trim() !== certificate.certificateDescription) {
        submitData.append('certificateDesc', description.trim());
      }
      if (imageFile) {
        submitData.append('itemImageUrl', imageFile);
      }

      if ([...submitData.keys()].length === 0) {
        toast.info('No changes to save');
        return;
      }

      setSaving(true);
      const updated = await certificateService.updateCertificate(
        certificate.id,
        submitData,
      );
      toast.success('Certificate updated successfully');
      onUpdated(updated);
      onClose();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Internal server error';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (!certificate) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Certificate</DialogTitle>
          <DialogDescription>
            Update certificate details. Only changed fields are sent to the server.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="certificateName">Certificate Name</Label>
            <Input
              id="certificateName"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="certificateDesc">Description</Label>
            <Textarea
              id="certificateDesc"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="certificateImage">Certificate Image</Label>
            <Input
              id="certificateImage"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {imagePreview && <CertificateImagePreview src={imagePreview} />}
            <p className="text-sm text-gray-500">
              Upload a new image or keep the existing one
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-amber-700 hover:bg-amber-800"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
