'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Save,
  Cancel,
  Delete,
} from '@mui/icons-material';

interface Character {
  id: string;
  name: string;
  power: string;
  origin: 'Mystical' | 'Mythical' | 'Scientific';
  powerSource: string;
  abilities: string[];
  description: string;
  image: string;
}

// Mock character data (in real app, fetch from backend)
const mockCharacters: Record<string, Character> = {
  '1': {
    id: '1',
    name: 'Flare',
    power: 'Fire Control',
    origin: 'Mystical',
    powerSource: 'Ancient Flame',
    abilities: ['Fireball', 'Heat Shield', 'Flame Burst'],
    description: 'Master of fire with the ability to control flames and heat. Flare emerged from the ancient temples of the Mystical realm.',
    image: '/Flare.png',
  },
  '2': {
    id: '2',
    name: 'Luminess',
    power: 'Light Manipulation',
    origin: 'Mystical',
    powerSource: 'Celestial Energy',
    abilities: ['Light Beam', 'Solar Flare', 'Blinding Flash'],
    description: 'Harnesses the power of pure light and cosmic energy. Born from the stars themselves.',
    image: '/Luminess.png',
  },
  '3': {
    id: '3',
    name: 'Tekaru',
    power: 'Cybernetic Enhancement',
    origin: 'Scientific',
    powerSource: 'Advanced Technology',
    abilities: ['Energy Projection', 'Mechanical Strength', 'System Override'],
    description: 'A fusion of human and machine with incredible technological abilities. Enhanced by cutting-edge science.',
    image: '/Tekaru.jpg',
  },
  '4': {
    id: '4',
    name: 'Omigidi',
    power: 'Dimensional Shift',
    origin: 'Mythical',
    powerSource: 'Dimensional Rift',
    abilities: ['Portal Creation', 'Reality Warp', 'Dimension Hop'],
    description: 'An ancient being with the power to manipulate dimensions itself. From realms beyond our understanding.',
    image: '/Omi-Gidi.jpg',
  },
  '5': {
    id: '5',
    name: 'Omigidi2',
    power: 'Dimensional Shift',
    origin: 'Mythical',
    powerSource: 'Dimensional Rift',
    abilities: ['Portal Creation', 'Reality Warp', 'Dimension Hop'],
    description: 'An ancient being with the power to manipulate dimensions itself. From realms beyond our understanding.',
    image: '/Omi-Gidi.jpg',
  },
  '6': {
    id: '6',
    name: 'Flare02',
    power: 'Dimensional Shift',
    origin: 'Mythical',
    powerSource: 'Dimensional Rift',
    abilities: ['Portal Creation', 'Reality Warp', 'Dimension Hop'],
    description: 'An ancient being with the power to manipulate dimensions itself. From realms beyond our understanding.',
    image: '/Omi-Gidi.jpg',
  },
};

export default function CharacterDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const characterId = params.id as string;

  const character = mockCharacters[characterId];

  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Character>(
    character || {
      id: '',
      name: '',
      power: '',
      origin: 'Mystical',
      powerSource: '',
      abilities: [],
      description: '',
      image: '',
    }
  );
  const [newAbility, setNewAbility] = useState('');

  if (!character) {
    return (
      <Box sx={{ pb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.back()}
          sx={{ color: '#800000', mb: 2 }}
        >
          Back
        </Button>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">Character not found</Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

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

  // Handle save
  const handleSave = () => {
    if (!formData.name.trim() || !formData.power.trim() || !formData.powerSource.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Character updated successfully!');
    setIsEditing(false);
  };

  // Handle delete
  const handleDelete = () => {
    setDeleteDialogOpen(false);
    toast.success('Character deleted successfully!');
    setTimeout(() => {
      router.push('/admin/managecharacter');
    }, 1000);
  };

  const originColors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
    Mystical: 'primary',
    Mythical: 'secondary',
    Scientific: 'error',
  };

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.back()}
          sx={{
            color: '#800000',
            '&:hover': { backgroundColor: '#80000015' },
          }}
        >
          Back
        </Button>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {!isEditing ? (
            <>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setIsEditing(true)}
                sx={{
                  color: '#800000',
                  borderColor: '#800000',
                  '&:hover': {
                    borderColor: '#600000',
                    backgroundColor: '#80000005',
                  },
                }}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                startIcon={<Delete />}
                onClick={() => setDeleteDialogOpen(true)}
                sx={{
                  color: '#f44336',
                  borderColor: '#f44336',
                  '&:hover': {
                    borderColor: '#d32f2f',
                    backgroundColor: '#f4433615',
                  },
                }}
              >
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
                sx={{
                  background: 'linear-gradient(135deg, #800000, #FFA500)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #600000, #FF8C00)',
                  },
                }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={() => {
                  setIsEditing(false);
                  setFormData(character);
                }}
                sx={{
                  color: '#800000',
                  borderColor: '#800000',
                }}
              >
                Cancel
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* Character Details */}
      <Grid container spacing={3}>
        {/* Image Section */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                paddingBottom: '100%',
                overflow: 'hidden',
                backgroundColor: '#f5f5f5',
                border: '2px solid #FFA500',
              }}
            >
              <Image
                src={formData.image}
                alt={formData.name}
                fill
                style={{ objectFit: 'cover' }}
              />
            </Box>
          </Card>
        </Grid>

        {/* Details Section */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              {isEditing ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Name */}
                  <TextField
                    fullWidth
                    label="Character Name"
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

                  {/* Power */}
                  <TextField
                    fullWidth
                    label="Power"
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

                  {/* Origin */}
                  <TextField
                    fullWidth
                    select
                    label="Origin"
                    value={formData.origin}
                    onChange={(e) => handleFormChange('origin', e.target.value)}
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

                  {/* Power Source */}
                  <TextField
                    fullWidth
                    label="Power Source"
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

                  {/* Description */}
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
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

                  {/* Abilities */}
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                      Abilities
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <TextField
                        size="small"
                        placeholder="Add new ability"
                        value={newAbility}
                        onChange={(e) => setNewAbility(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddAbility();
                          }
                        }}
                        sx={{
                          flex: 1,
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
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ color: '#800000', mb: 1 }}>
                      {formData.name}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                      Power
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {formData.power}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                      Origin
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip
                        label={formData.origin}
                        color={originColors[formData.origin]}
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                      Power Source
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {formData.powerSource}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                      Description
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, lineHeight: 1.6 }}>
                      {formData.description}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight={600} sx={{ mb: 1 }}>
                      Abilities
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {formData.abilities.map((ability, idx) => (
                        <Chip
                          key={idx}
                          label={ability}
                          sx={{
                            background: 'linear-gradient(135deg, #800000, #FFA500)',
                            color: 'white',
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ color: '#800000', fontWeight: 700 }}>Delete Character</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography>
              Are you sure you want to delete <strong>{formData.name}</strong>? This action cannot be undone.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            sx={{
              background: '#f44336',
              color: 'white',
              '&:hover': {
                background: '#d32f2f',
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
