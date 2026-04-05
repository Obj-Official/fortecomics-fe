'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-toastify';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Chip,
  Paper,
  IconButton,
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Cancel,
  CloudUpload,
  Add as AddIcon,
  Close,
} from '@mui/icons-material';

interface Character {
  name: string;
  power: string;
  origin: 'Mystical' | 'Mythical' | 'Scientific';
  powerSource: string;
  abilities: string[];
  description: string;
  images: string[];
}

export default function AddCharacterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<Character>({
    name: '',
    power: '',
    origin: 'Mystical',
    powerSource: '',
    abilities: [],
    description: '',
    images: [],
  });

  const [newAbility, setNewAbility] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Handle form changes
  const handleFormChange = (field: string, value: string | 'Mystical' | 'Mythical' | 'Scientific') => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Add ability
  const handleAddAbility = () => {
    if (newAbility.trim() && !formData.abilities.includes(newAbility.trim())) {
      setFormData((prev) => ({
        ...prev,
        abilities: [...prev.abilities, newAbility.trim()],
      }));
      setNewAbility('');
    }
  };

  // Remove ability
  const handleRemoveAbility = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      abilities: prev.abilities.filter((_, i) => i !== index),
    }));
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const remainingSlots = 10 - formData.images.length;
      const filesToAdd = Array.from(files).slice(0, remainingSlots);

      if (filesToAdd.length + formData.images.length > 10) {
        toast.error('Maximum 10 images allowed');
        return;
      }

      filesToAdd.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, reader.result as string],
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Handle save
  const handleSave = async () => {
    if (!formData.name.trim() || !formData.power.trim() || !formData.powerSource.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.abilities.length === 0) {
      toast.error('Please add at least one ability');
      return;
    }

    if (formData.images.length === 0) {
      toast.error('Please add at least one image');
      return;
    }

    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const payload = {
      name: formData.name,
      power: formData.power,
      origin: formData.origin,
      powerSource: formData.powerSource,
      abilities: formData.abilities,
      description: formData.description,
      images: formData.images,
    };

    console.log('Creating character:', payload);
    
    setIsSaving(false);
    toast.success('Character created successfully!');
    setTimeout(() => {
      router.push('/admin/managecharacter');
    }, 1000);
  };

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.back()}
            sx={{
              color: '#800000',
              mb: 2,
              '&:hover': { backgroundColor: '#80000015' },
            }}
          >
            Back
          </Button>
          <Typography variant="h5" fontWeight={700}>
            Create New Character
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            disabled={isSaving}
            sx={{
              background: 'linear-gradient(135deg, #800000, #FFA500)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #600000, #FF8C00)',
              },
              '&:disabled': {
                background: '#cccccc',
              },
            }}
          >
            {isSaving ? 'Creating...' : 'Create Character'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<Cancel />}
            onClick={() => router.back()}
            sx={{
              color: '#800000',
              borderColor: '#800000',
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>

      {/* Form Section */}
      <Grid container spacing={3}>
        {/* Image Upload Section */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                Character Images (Max 10)
              </Typography>

              {/* Upload Area with Plus Icon */}
              <Paper
                component="div"
                onClick={() => {
                  const input = document.getElementById('character-images') as HTMLInputElement;
                  if (formData.images.length < 10) {
                    input?.click();
                  }
                }}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  mb: 2,
                  backgroundColor: '#f9f9f9',
                  border: '2px dashed #ddd',
                  borderRadius: 2,
                  cursor: formData.images.length < 10 ? 'pointer' : 'not-allowed',
                  position: 'relative',
                  minHeight: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  '&:hover': {
                    borderColor: formData.images.length < 10 ? '#800000' : '#ddd',
                    backgroundColor: formData.images.length < 10 ? '#80000005' : '#f9f9f9',
                  },
                  opacity: formData.images.length >= 10 ? 0.6 : 1,
                }}
              >
                <AddIcon sx={{ fontSize: 80, color: '#cccccc', mb: 1 }} />
                <Typography variant="body2" fontWeight={600} color="text.secondary">
                  {formData.images.length >= 10
                    ? 'Maximum images uploaded'
                    : 'Click or drag images here'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formData.images.length} / 10 images
                </Typography>
              </Paper>

              <input
                id="character-images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />

              {/* Images Grid */}
              {formData.images.length > 0 && (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
                  {formData.images.map((img, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        position: 'relative',
                        width: '100%',
                        paddingBottom: '100%',
                        borderRadius: 1,
                        overflow: 'hidden',
                        backgroundColor: '#f5f5f5',
                        border: '1px solid #e0e0e0',
                        '&:hover .removeBtn': {
                          opacity: 1,
                        },
                      }}
                    >
                      <Image
                        src={img}
                        alt={`Character ${idx + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveImage(idx)}
                        className="removeBtn"
                        sx={{
                          position: 'absolute',
                          top: 2,
                          right: 2,
                          background: 'rgba(0,0,0,0.6)',
                          color: 'white',
                          opacity: 0,
                          transition: 'opacity 0.2s',
                          '&:hover': {
                            background: 'rgba(0,0,0,0.8)',
                          },
                        }}
                      >
                        <Close sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Form Fields Section */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Name */}
              <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: '#800000' }}>
                  Character Name *
                </Typography>
                <TextField
                  fullWidth
                  placeholder="e.g., Flare, Luminess"
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#800000',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FFA500',
                      },
                    },
                  }}
                />
              </Box>

              {/* Power */}
              <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: '#800000' }}>
                  Power/Ability *
                </Typography>
                <TextField
                  fullWidth
                  placeholder="e.g., Fire Control, Light Manipulation"
                  value={formData.power}
                  onChange={(e) => handleFormChange('power', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#800000',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FFA500',
                      },
                    },
                  }}
                />
              </Box>

              <Grid container spacing={2}>
                {/* Origin */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: '#800000' }}>
                      Origin *
                    </Typography>
                    <TextField
                      fullWidth
                      select
                      value={formData.origin}
                      onChange={(e) => handleFormChange('origin', e.target.value as 'Mystical' | 'Mythical' | 'Scientific')}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: '#800000',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#FFA500',
                          },
                        },
                      }}
                    >
                      <option value="Mystical">Mystical</option>
                      <option value="Mythical">Mythical</option>
                      <option value="Scientific">Scientific</option>
                    </TextField>
                  </Box>
                </Grid>

                {/* Power Source */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: '#800000' }}>
                      Power Source *
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="e.g., Ancient Flame, Celestial Energy"
                      value={formData.powerSource}
                      onChange={(e) => handleFormChange('powerSource', e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: '#800000',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#FFA500',
                          },
                        },
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>

              {/* Description */}
              <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: '#800000' }}>
                  Description *
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Enter a detailed description of the character..."
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#800000',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FFA500',
                      },
                    },
                  }}
                />
              </Box>

              {/* Abilities */}
              <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: '#800000' }}>
                  Abilities *
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Add new ability (e.g., Fireball)"
                    value={newAbility}
                    onChange={(e) => setNewAbility(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddAbility();
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#800000',
                        },
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddAbility}
                    sx={{
                      background: 'linear-gradient(135deg, #800000, #FFA500)',
                      color: 'white',
                    }}
                  >
                    Add
                  </Button>
                </Box>
                {formData.abilities.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {formData.abilities.map((ability, idx) => (
                      <Chip
                        key={idx}
                        label={ability}
                        onDelete={() => handleRemoveAbility(idx)}
                        sx={{
                          background: 'linear-gradient(135deg, #800000, #FFA500)',
                          color: 'white',
                          '& .MuiChip-deleteIcon': {
                            color: 'white',
                            '&:hover': {
                              color: '#ffcccc',
                            },
                          },
                        }}
                      />
                    ))}
                  </Box>
                )}
                {formData.abilities.length === 0 && (
                  <Typography variant="caption" color="text.secondary">
                    Add at least one ability
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
