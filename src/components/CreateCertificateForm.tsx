import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { certificateService } from '../services/certificateService';
import { CertificateImagePreview } from './CertificateImagePreview';

export function CreateCertificateForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

    if (!name.trim()) {
      toast.error('Please enter a certificate name');
      return;
    }

    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    if (!imageFile) {
      toast.error('Please upload a certificate image');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('certificateName', name.trim());
      formData.append('certificateDesc', description.trim());
      formData.append('itemImageUrl', imageFile);

      await certificateService.createCertificate(formData);
      toast.success('Certificate created successfully');

      setName('');
      setDescription('');
      setImagePreview('');
      setImageFile(null);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Internal server error';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6">
        <h2 className="mb-6 text-amber-900">Create Certificate</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="certificateName">Certificate Name</Label>
            <Input
              id="certificateName"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter certificate name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="certificateDesc">Description</Label>
            <Textarea
              id="certificateDesc"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Enter certificate description"
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
              required
            />
            {imagePreview && <CertificateImagePreview src={imagePreview} />}
          </div>

          <Button
            type="submit"
            className="w-full bg-amber-700 hover:bg-amber-800"
            disabled={submitting}
          >
            {submitting ? 'Creating...' : 'Create Certificate'}
          </Button>
        </form>
      </Card>
    </motion.div>
  );
}
