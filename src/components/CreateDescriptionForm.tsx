import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { adminMetaService } from '../services/adminMetaService';
import { Pencil } from 'lucide-react';

export function CreateDescriptionForm() {
  const [upperDescription, setUpperDescription] = useState('');
  const [lowerDescription, setLowerDescription] = useState('');
  const [initialUpperDescription, setInitialUpperDescription] = useState('');
  const [initialLowerDescription, setInitialLowerDescription] = useState('');

  const [isUpperEditing, setIsUpperEditing] = useState(false);
  const [isLowerEditing, setIsLowerEditing] = useState(false);

  const [isFetching, setIsFetching] = useState(false);
  const [isSavingUpper, setIsSavingUpper] = useState(false);
  const [isSavingLower, setIsSavingLower] = useState(false);

  const fetchDescription = async () => {
    try {
      setIsFetching(true);
      const data = await adminMetaService.getDescription();
      setUpperDescription(data.upperDescription);
      setLowerDescription(data.lowerDescription);
      setInitialUpperDescription(data.upperDescription);
      setInitialLowerDescription(data.lowerDescription);
    } catch (error: any) {
      toast.error(error.message || 'Internal server error');
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchDescription();
  }, []);

  const handleSaveUpper = async () => {
    try {
      setIsSavingUpper(true);
      const data = await adminMetaService.updateDescription({
        upperDescription,
      });
      setUpperDescription(data.upperDescription);
      setLowerDescription(data.lowerDescription);
      setInitialUpperDescription(data.upperDescription);
      setInitialLowerDescription(data.lowerDescription);
      setIsUpperEditing(false);
      toast.success('Upper description updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Internal server error');
    } finally {
      setIsSavingUpper(false);
    }
  };

  const handleSaveLower = async () => {
    try {
      setIsSavingLower(true);
      const data = await adminMetaService.updateDescription({
        lowerDescription,
      });
      setUpperDescription(data.upperDescription);
      setLowerDescription(data.lowerDescription);
      setInitialUpperDescription(data.upperDescription);
      setInitialLowerDescription(data.lowerDescription);
      setIsLowerEditing(false);
      toast.success('Lower description updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Internal server error');
    } finally {
      setIsSavingLower(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6">
        <h2 className="mb-6 text-amber-900">Create Description</h2>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Label htmlFor="upperDescription">Upper Description</Label>
              {!isUpperEditing ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsUpperEditing(true)}
                  disabled={isFetching || isSavingUpper || isSavingLower}
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Edit upper description"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    className="bg-amber-700 hover:bg-amber-800"
                    onClick={handleSaveUpper}
                    disabled={isSavingUpper || isFetching}
                  >
                    {isSavingUpper ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setUpperDescription(initialUpperDescription);
                      setIsUpperEditing(false);
                    }}
                    disabled={isSavingUpper || isFetching}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            <Textarea
              id="upperDescription"
              value={upperDescription}
              onChange={(e) => setUpperDescription(e.target.value)}
              placeholder="Enter upper description"
              disabled={!isUpperEditing || isFetching}
              className="min-h-28"
            />
          </div>

          <div className="space-y-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Label htmlFor="lowerDescription">Lower Description</Label>
              {!isLowerEditing ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsLowerEditing(true)}
                  disabled={isFetching || isSavingUpper || isSavingLower}
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Edit lower description"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    className="bg-amber-700 hover:bg-amber-800"
                    onClick={handleSaveLower}
                    disabled={isSavingLower || isFetching}
                  >
                    {isSavingLower ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setLowerDescription(initialLowerDescription);
                      setIsLowerEditing(false);
                    }}
                    disabled={isSavingLower || isFetching}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            <Textarea
              id="lowerDescription"
              value={lowerDescription}
              onChange={(e) => setLowerDescription(e.target.value)}
              placeholder="Enter lower description"
              disabled={!isLowerEditing || isFetching}
              className="min-h-36"
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
