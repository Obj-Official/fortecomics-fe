'use client';

import { useState, useRef, useEffect } from 'react';
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
  Paper,
  IconButton,
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Cancel,
  Add as AddIcon,
  Close,
  KeyboardArrowUp,
  ImageRounded,
} from '@mui/icons-material';

interface Ability {
  name: string;
  description: string;
}

interface Character {
  name: string;
  alias: string;
  realname: string;
  origin: 'Mystical' | 'Mythical' | 'Scientific';
  powerSource: string;
  abilities: Ability[];
  description: string;
  briefIntro: string;
  images: string[];
  physicalAppearance: {
    height: string;
    weight: string;
    gender: string;
    ethnicOrigins: string;
  };
  familyAndFriends: string;
  allies: string;
  adversaries: string;
  skillsAndAchievements: string;
}

export default function AddCharacterPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Character>({
    name: '',
    alias: '',
    realname: '',
    origin: 'Mystical',
    powerSource: '',
    abilities: [],
    description: '',
    briefIntro: '',
    images: [],
    physicalAppearance: {
      height: '',
      weight: '',
      gender: '',
      ethnicOrigins: '',
    },
    familyAndFriends: '',
    allies: '',
    adversaries: '',
    skillsAndAchievements: '',
  });

  const [newAbility, setNewAbility] = useState('');
  const [newAbilityDescription, setNewAbilityDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll for the go-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle form changes
  const handleFormChange = (field: string, value: string | 'Mystical' | 'Mythical' | 'Scientific') => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle physical appearance changes
  const handlePhysicalAppearanceChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      physicalAppearance: {
        ...prev.physicalAppearance,
        [field]: value,
      },
    }));
  };

  // Add ability with description
  const handleAddAbility = () => {
    if (newAbility.trim() && newAbilityDescription.trim()) {
      if (!formData.abilities.some((a) => a.name.toLowerCase() === newAbility.trim().toLowerCase())) {
        setFormData((prev) => ({
          ...prev,
          abilities: [
            ...prev.abilities,
            {
              name: newAbility.trim(),
              description: newAbilityDescription.trim(),
            },
          ],
        }));
        setNewAbility('');
        setNewAbilityDescription('');
      } else {
        toast.warning('This ability already exists');
      }
    } else {
      toast.error('Please fill in both ability name and description');
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
    if (!formData.name.trim() || !formData.alias.trim() || !formData.realname.trim() || !formData.powerSource.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.abilities.length === 0) {
      toast.error('Please add at least one ability with description');
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
      alias: formData.alias,
      realname: formData.realname,
      origin: formData.origin,
      powerSource: formData.powerSource,
      abilities: formData.abilities,
      description: formData.description,
      briefIntro: formData.briefIntro,
      images: formData.images,
      physicalAppearance: formData.physicalAppearance,
      familyAndFriends: formData.familyAndFriends,
      allies: formData.allies,
      adversaries: formData.adversaries,
      skillsAndAchievements: formData.skillsAndAchievements,
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
        {/* Image Upload & Thumbnails Section */}
        <Grid size={{ xs: 12 }}>
          <Card sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Grid container spacing={2}>
                {/* Upload Area - Left Side (50%) */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                    Upload Images
                  </Typography>
                  <Paper
                    component="div"
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      backgroundColor: '#f9f9f9',
                      border: '2px dashed #ddd',
                      borderRadius: 2,
                      cursor: formData.images.length < 10 ? 'pointer' : 'not-allowed',
                      position: 'relative',
                      minHeight: 250,
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
                    <AddIcon sx={{ fontSize: 60, color: '#cccccc', mb: 1 }} />
                    <Typography variant="body2" fontWeight={600} color="text.secondary">
                      {formData.images.length >= 10
                        ? 'Maximum images uploaded'
                        : 'Click to add images'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formData.images.length} / 10 images
                    </Typography>
                  </Paper>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </Grid>

                {/* Thumbnails Grid - Right Side (50%) */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                    Uploaded Thumbnails
                  </Typography>
                  {formData.images.length > 0 ? (
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 1 }}>
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
                              width: 24,
                              height: 24,
                              '&:hover': {
                                background: 'rgba(0,0,0,0.8)',
                              },
                            }}
                          >
                            <Close sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Paper
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        backgroundColor: '#f5f5f5',
                        border: '1px dashed #ddd',
                        borderRadius: 1,
                        minHeight: 250,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                      }}
                    >
                    <ImageRounded sx={{ fontSize: 60, color: '#cccccc', margin: 3}} />
                      <Typography variant="caption" color="text.secondary">
                        No images uploaded yet
                      </Typography>
                    </Paper>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Basic Info Section */}
        <Grid size={{ xs: 12 }}>
          <Card sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ color: '#800000' }}>
                Basic Information
              </Typography>

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
                      '&:hover fieldset': { borderColor: '#800000' },
                      '&.Mui-focused fieldset': { borderColor: '#FFA500' },
                    },
                  }}
                />
              </Box>

              {/* Alias */}
              <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: '#800000' }}>
                  Alias *
                </Typography>
                <TextField
                  fullWidth
                  placeholder="e.g., The Crimson Comet, Quick Flame"
                  value={formData.alias}
                  onChange={(e) => handleFormChange('alias', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#800000' },
                      '&.Mui-focused fieldset': { borderColor: '#FFA500' },
                    },
                  }}
                />
              </Box>

              {/* Realname */}
              <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: '#800000' }}>
                  Real Name *
                </Typography>
                <TextField
                  fullWidth
                  placeholder="e.g., Dubem Ani"
                  value={formData.realname}
                  onChange={(e) => handleFormChange('realname', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#800000' },
                      '&.Mui-focused fieldset': { borderColor: '#FFA500' },
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
                      onChange={(e) =>
                        handleFormChange('origin', e.target.value as 'Mystical' | 'Mythical' | 'Scientific')
                      }
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': { borderColor: '#800000' },
                          '&.Mui-focused fieldset': { borderColor: '#FFA500' },
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
                      placeholder="e.g., First Flame, Celestial Energy"
                      value={formData.powerSource}
                      onChange={(e) => handleFormChange('powerSource', e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': { borderColor: '#800000' },
                          '&.Mui-focused fieldset': { borderColor: '#FFA500' },
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
                  rows={2}
                  placeholder="Enter a brief description of the character..."
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#800000' },
                      '&.Mui-focused fieldset': { borderColor: '#FFA500' },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Physical Appearance Section */}
        <Grid size={{ xs: 12 }}>
          <Card sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: '#800000' }}>
                Physical Appearance
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                      Height
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="e.g., 6 ft, 180 cm"
                      value={formData.physicalAppearance.height}
                      onChange={(e) => handlePhysicalAppearanceChange('height', e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': { borderColor: '#800000' },
                          '&.Mui-focused fieldset': { borderColor: '#FFA500' },
                        },
                      }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                      Weight
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="e.g., 180 lbs, 82 kg"
                      value={formData.physicalAppearance.weight}
                      onChange={(e) => handlePhysicalAppearanceChange('weight', e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': { borderColor: '#800000' },
                          '&.Mui-focused fieldset': { borderColor: '#FFA500' },
                        },
                      }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                      Gender
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="e.g., Male, Female, Other"
                      value={formData.physicalAppearance.gender}
                      onChange={(e) => handlePhysicalAppearanceChange('gender', e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': { borderColor: '#800000' },
                          '&.Mui-focused fieldset': { borderColor: '#FFA500' },
                        },
                      }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                      Ethnic Origins
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="e.g., European, Asian, etc."
                      value={formData.physicalAppearance.ethnicOrigins}
                      onChange={(e) => handlePhysicalAppearanceChange('ethnicOrigins', e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': { borderColor: '#800000' },
                          '&.Mui-focused fieldset': { borderColor: '#FFA500' },
                        },
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Relationships Section */}
        <Grid size={{ xs: 12 }}>
          <Card sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: '#800000' }}>
                Relationships
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                      Family and Friends
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Describe family members and friends..."
                      value={formData.familyAndFriends}
                      onChange={(e) => handleFormChange('familyAndFriends', e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': { borderColor: '#800000' },
                          '&.Mui-focused fieldset': { borderColor: '#FFA500' },
                        },
                      }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                      Allies
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="List and describe allies..."
                      value={formData.allies}
                      onChange={(e) => handleFormChange('allies', e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': { borderColor: '#800000' },
                          '&.Mui-focused fieldset': { borderColor: '#FFA500' },
                        },
                      }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                      Adversaries
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="List and describe adversaries..."
                      value={formData.adversaries}
                      onChange={(e) => handleFormChange('adversaries', e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': { borderColor: '#800000' },
                          '&.Mui-focused fieldset': { borderColor: '#FFA500' },
                        },
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Skills & Abilities Section */}
        <Grid size={{ xs: 12 }}>
          <Card sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: '#800000' }}>
                Skills & Abilities
              </Typography>

              {/* Human Skills and Achievements */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Human Skills and Achievements
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Describe human skills, training, and achievements..."
                  value={formData.skillsAndAchievements}
                  onChange={(e) => handleFormChange('skillsAndAchievements', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#800000' },
                      '&.Mui-focused fieldset': { borderColor: '#FFA500' },
                    },
                  }}
                />
              </Box>

              {/* Abilities with descriptions */}
              <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: '#800000' }}>
                  Superpowers & Special Abilities *
                </Typography>

                {/* Add new ability */}
                <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="caption" fontWeight={600} sx={{ mb: 2, display: 'block' }}>
                    Add New Ability
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Ability name (e.g., Fireball)"
                      value={newAbility}
                      onChange={(e) => setNewAbility(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': { borderColor: '#800000' },
                        },
                      }}
                    />
                    <TextField
                      size="small"
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="Describe this ability..."
                      value={newAbilityDescription}
                      onChange={(e) => setNewAbilityDescription(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey) {
                          handleAddAbility();
                        }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': { borderColor: '#800000' },
                        },
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleAddAbility}
                      sx={{
                        background: 'linear-gradient(135deg, #800000, #FFA500)',
                        color: 'white',
                        alignSelf: 'flex-start',
                      }}
                    >
                      Add Ability
                    </Button>
                  </Box>
                </Box>

                {/* Display added abilities */}
                {formData.abilities.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                      Added Abilities ({formData.abilities.length})
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {formData.abilities.map((ability, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            p: 2,
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            backgroundColor: '#fafafa',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            gap: 2,
                          }}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" fontWeight={700} sx={{ color: '#800000', mb: 0.5 }}>
                              {ability.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {ability.description}
                            </Typography>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveAbility(idx)}
                            sx={{
                              color: '#800000',
                              '&:hover': { backgroundColor: '#80000015' },
                            }}
                          >
                            <Close sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
                {formData.abilities.length === 0 && (
                  <Typography variant="caption" color="text.secondary">
                    Add at least one ability with description
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Character Introduction and Background */}
        <Grid size={{ xs: 12 }}>
          <Card sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: '#800000' }}>
                Introduction and Background
              </Typography>
              {/* Brief Intro */}
              <Box>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  placeholder="An introduction and background to the character..."
                  value={formData.briefIntro}
                  onChange={(e) => handleFormChange('briefIntro', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#800000' },
                      '&.Mui-focused fieldset': { borderColor: '#FFA500' },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Box
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            width: 50,
            height: 50,
            background: 'linear-gradient(135deg, #800000, #FFA500)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            color: 'white',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 20px rgba(128, 0, 0, 0.3)',
              transform: 'translateY(-4px)',
            },
          }}
        >
          <KeyboardArrowUp sx={{ fontSize: 28 }} />
        </Box>
      )}
    </Box>
  );
}
