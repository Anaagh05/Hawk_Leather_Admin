import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { adminMetaService, LocationData } from '../services/adminMetaService';
import { Pencil } from 'lucide-react';

export function CreateLocationForm() {
  const [formData, setFormData] = useState<LocationData>({
    location: '',
    phoneNumber: '',
    email: '',
  });
  const [initialData, setInitialData] = useState<LocationData>({
    location: '',
    phoneNumber: '',
    email: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchLocation = async () => {
    try {
      setIsFetching(true);
      const data = await adminMetaService.getLocation();
      setFormData(data);
      setInitialData(data);
    } catch (error: any) {
      toast.error(error.message || 'Internal server error');
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const changedPayload = useMemo(() => {
    const payload: Partial<LocationData> = {};

    if (formData.location !== initialData.location) {
      payload.location = formData.location;
    }
    if (formData.phoneNumber !== initialData.phoneNumber) {
      payload.phoneNumber = formData.phoneNumber;
    }
    if (formData.email !== initialData.email) {
      payload.email = formData.email;
    }

    return payload;
  }, [formData, initialData]);

  const hasChanges = Object.keys(changedPayload).length > 0;

  const handleSave = async () => {
    if (!hasChanges) {
      setIsEditing(false);
      return;
    }

    try {
      setIsSaving(true);
      const data = await adminMetaService.updateLocation(changedPayload);
      setFormData(data);
      setInitialData(data);
      setIsEditing(false);
      toast.success('Location updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Internal server error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-amber-900">Create Location</h2>
          {!isEditing && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsEditing(true)}
              disabled={isFetching || isSaving}
              aria-label="Edit location details"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="Enter location"
              disabled={!isEditing || isFetching}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
              placeholder="Enter phone number"
              disabled={!isEditing || isFetching}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email"
              disabled={!isEditing || isFetching}
            />
          </div>

          {isEditing && (
            <div className="pt-4 flex items-center gap-3">
              <Button
                type="button"
                className="bg-amber-700 hover:bg-amber-800"
                onClick={handleSave}
                disabled={isFetching || isSaving}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData(initialData);
                  setIsEditing(false);
                }}
                disabled={isFetching || isSaving}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
