'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-toastify';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
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
  KeyboardArrowUp,
} from '@mui/icons-material';

interface Ability {
  name: string;
  description: string;
}

interface Character {
  id: string;
  name: string;
  alias: string;
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

// Mock character data (in real app, fetch from backend)
const mockCharacters: Record<string, Character> = {
  '1': {
    id: '1',
    name: 'Flare',
    alias: 'The Crimson Comet',
    origin: 'Mystical',
    powerSource: 'Ancient Flame',
    abilities: [
      { name: 'Fireball', description: 'Launch explosive fire spheres' },
      { name: 'Heat Shield', description: 'Create protective heat barriers' },
      { name: 'Flame Burst', description: 'Explosive fire release in all directions' },
    ],
    description: 'Master of fire with the ability to control flames and heat. Flare emerged from the ancient temples of the Mystical realm.',
    briefIntro: 'A fiery hero protecting the realm from darkness.',
    images: ['/Flare.png'],
    physicalAppearance: {
      height: '6 ft',
      weight: '180 lbs',
      gender: 'Male',
      ethnicOrigins: 'European',
    },
    familyAndFriends: 'Trained by Master Ignis, allied with the Light Guardian',
    allies: 'Luminess, Protective Order of Flames',
    adversaries: 'Shadow Emperor, Dark Cultists',
    skillsAndAchievements: 'Master Swordsman, Fire Magic Prodigy, Defender of the Realm',
  },
  '2': {
    id: '2',
    name: 'Luminess',
    alias: 'The Star Bearer',
    origin: 'Mystical',
    powerSource: 'Celestial Energy',
    abilities: [
      { name: 'Light Beam', description: 'Emit concentrated rays of pure light' },
      { name: 'Solar Flare', description: 'Create blinding explosions of solar energy' },
      { name: 'Blinding Flash', description: 'Temporarily blind enemies with intense light' },
    ],
    description: 'Harnesses the power of pure light and cosmic energy. Born from the stars themselves.',
    briefIntro: 'A luminous guardian bringing hope and light to all.',
    images: ['/Luminess.png'],
    physicalAppearance: {
      height: '5\'8"',
      weight: '130 lbs',
      gender: 'Female',
      ethnicOrigins: 'Celestial',
    },
    familyAndFriends: 'Daughter of the Star Council, close with Flare',
    allies: 'Flare, Knights of Light',
    adversaries: 'Dark Lord, Shadow Minions',
    skillsAndAchievements: 'Light Magic Expert, Diplomatic Leader, Healer',
  },
  '3': {
    id: '3',
    name: 'Tekaru',
    alias: 'The Machine',
    origin: 'Scientific',
    powerSource: 'Advanced Technology',
    abilities: [
      { name: 'Energy Projection', description: 'Fire concentrated energy blasts' },
      { name: 'Mechanical Strength', description: 'Enhanced physical power from cybernetics' },
      { name: 'System Override', description: 'Hack and control electronic systems' },
    ],
    description: 'A fusion of human and machine with incredible technological abilities. Enhanced by cutting-edge science.',
    briefIntro: 'A cyborg warrior blending human ingenuity with machine precision.',
    images: ['/Tekaru.jpg'],
    physicalAppearance: {
      height: '6\'2"',
      weight: '220 lbs (with enhancements)',
      gender: 'Male',
      ethnicOrigins: 'Asian-American',
    },
    familyAndFriends: 'Created by Dr. Chen, bonded with other enhanced humans',
    allies: 'Dr. Chen, The Tech Collective',
    adversaries: 'Rogue AI, Enemy Factions',
    skillsAndAchievements: 'Expert Technician, Combat Specialist, Strategic Thinker',
  },
  '4': {
    id: '4',
    name: 'Omigidi',
    alias: 'The Dimensional Shifter',
    origin: 'Mythical',
    powerSource: 'Dimensional Rift',
    abilities: [
      { name: 'Portal Creation', description: 'Open gateways between dimensions' },
      { name: 'Reality Warp', description: 'Bend the laws of reality in localized areas' },
      { name: 'Dimension Hop', description: 'Teleport instantly between planes of existence' },
    ],
    description: 'An ancient being with the power to manipulate dimensions itself. From realms beyond our understanding.',
    briefIntro: 'An otherworldly entity transcending boundaries of space and time.',
    images: ['/Omi-Gidi.jpg'],
    physicalAppearance: {
      height: 'Variable',
      weight: 'Unknown',
      gender: 'Non-binary',
      ethnicOrigins: 'Interdimensional',
    },
    familyAndFriends: 'Connected to ancient cosmic forces',
    allies: 'Mystical Order, Other Dimensional Beings',
    adversaries: 'Dimensional Invaders, Reality Threats',
    skillsAndAchievements: 'Dimensional Master, Reality Architect, Ancient Knowledge Guardian',
  },
  '5': {
    id: '5',
    name: 'Omigidi02',
    alias: 'The Echo',
    origin: 'Mythical',
    powerSource: 'Dimensional Resonance',
    abilities: [
      { name: 'Portal Reflection', description: 'Create mirror portals of dimensional gateways' },
      { name: 'Phase Shift', description: 'Move between solid and ethereal states' },
      { name: 'Dimensional Echo', description: 'Create duplicates across multiple dimensions' },
    ],
    description: 'A counterpart of the original dimensional shifter with slightly different manifestations of power.',
    briefIntro: 'An echo of interdimensional power with unique resonant abilities.',
    images: ['/Omi-Gidi.jpg'],
    physicalAppearance: {
      height: 'Variable',
      weight: 'Unknown',
      gender: 'Non-binary',
      ethnicOrigins: 'Interdimensional',
    },
    familyAndFriends: 'Twin-like connection to Omigidi',
    allies: 'Omigidi, Mystical Order',
    adversaries: 'Dimensional Invaders, Chaos Forces',
    skillsAndAchievements: 'Echo Mastery, Dimensional Resonance Control, Parallel Navigation',
  },
  '6': {
    id: '6',
    name: 'Flare02',
    alias: 'The Inferno',
    origin: 'Mystical',
    powerSource: 'Eternal Flame',
    abilities: [
      { name: 'Inferno Wave', description: 'Release massive waves of consuming fire' },
      { name: 'Flame Clone', description: 'Create sentient duplicates made of pure fire' },
      { name: 'Eternal Burn', description: 'Create fire that burns indefinitely' },
    ],
    description: 'An ancient being with the power to manipulate dimensions itself. From realms beyond our understanding.',
    briefIntro: 'A legendary fire spirit of untamed passion and ancient power.',
    images: ['/Flare.png'],
    physicalAppearance: {
      height: '6\'3"',
      weight: '190 lbs',
      gender: 'Male',
      ethnicOrigins: 'Mystical Being',
    },
    familyAndFriends: 'Ancient connection to Flare',
    allies: 'Fire Guardians, Mystical Council',
    adversaries: 'Ice Overlords, Darkness Entity',
    skillsAndAchievements: 'Supreme Fire Master, Ancient Guardian, Legendary Warrior',
  },
};

export default function CharacterDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const characterId = params.id as string;

  const character = mockCharacters[characterId];

  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [newAbility, setNewAbility] = useState('');
  const [newAbilityDescription, setNewAbilityDescription] = useState('');

  const [formData, setFormData] = useState<Character>(
    character || {
      id: '',
      name: '',
      alias: '',
      origin: 'Mystical',
      powerSource: '',
      abilities: [],
      description: '',
      briefIntro: '',
      images: [],
      physicalAppearance: { height: '', weight: '', gender: '', ethnicOrigins: '' },
      familyAndFriends: '',
      allies: '',
      adversaries: '',
      skillsAndAchievements: '',
    }
  );

  // Show scroll to top button
  const handleScroll = () => {
    setShowScrollTop(window.scrollY > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      setFormData((prev) => ({
        ...prev,
        abilities: [
          ...prev.abilities,
          { name: newAbility.trim(), description: newAbilityDescription.trim() },
        ],
      }));
      setNewAbility('');
      setNewAbilityDescription('');
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
    if (!formData.name.trim() || !formData.alias.trim() || !formData.powerSource.trim()) {
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

  if (!character) {
    return (
      <Box sx={{ pb: 4 }}>
        <Button startIcon={<ArrowBack />} onClick={() => router.back()} sx={{ color: '#800000', mb: 2 }}>
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

  return (
    <Box sx={{ pb: 4 }}  onScroll={handleScroll}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Button startIcon={<ArrowBack />} onClick={() => router.back()} sx={{ color: '#800000', mb: 2, '&:hover': { backgroundColor: '#80000015' } }}>
            Back
          </Button>
          <Typography variant="h5" fontWeight={700}>
            {formData.name}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {!isEditing ? (
            <>
              <Button variant="outlined" startIcon={<Edit />} onClick={() => setIsEditing(true)} sx={{ color: '#800000', borderColor: '#800000', '&:hover': { borderColor: '#600000', backgroundColor: '#80000005' } }}>
                Edit
              </Button>
              <Button variant="outlined" startIcon={<Delete />} onClick={() => setDeleteDialogOpen(true)} sx={{ color: '#f44336', borderColor: '#f44336', '&:hover': { borderColor: '#d32f2f', backgroundColor: '#f4433615' } }}>
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button variant="contained" startIcon={<Save />} onClick={handleSave} sx={{ background: 'linear-gradient(135deg, #800000, #FFA500)', color: 'white', '&:hover': { background: 'linear-gradient(135deg, #600000, #FF8C00)' } }}>
                Save
              </Button>
              <Button variant="outlined" startIcon={<Cancel />} onClick={() => { setIsEditing(false); setFormData(character); }} sx={{ color: '#800000', borderColor: '#800000' }}>
                Cancel
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* Images Section */}
      {formData.images.length > 0 && (
        <Card sx={{ mb: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#800000' }}>
              Character Images
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 2 }}>
              {formData.images.map((img, idx) => (
                <Box key={idx} sx={{ position: 'relative', width: '100%', paddingBottom: '100%', borderRadius: 1, overflow: 'hidden', backgroundColor: '#f5f5f5', border: '1px solid #e0e0e0' }}>
                  <Image src={img} alt={`Character ${idx + 1}`} fill style={{ objectFit: 'cover' }} />
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Basic Information */}
      <Card sx={{ mb: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: '#800000' }}>
            Basic Information
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Character Name
                </Typography>
                <Typography variant="body2">{formData.name}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Alias
                </Typography>
                <Typography variant="body2">{formData.alias}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Origin
                </Typography>
                <Chip label={formData.origin} color={originColors[formData.origin]} variant="outlined" size="small" />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Power Source
                </Typography>
                <Typography variant="body2">{formData.powerSource}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Description
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  {formData.description}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Brief Introduction
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  {formData.briefIntro}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Physical Appearance */}
      <Card sx={{ mb: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
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
                <Typography variant="body2">{formData.physicalAppearance.height || 'N/A'}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Weight
                </Typography>
                <Typography variant="body2">{formData.physicalAppearance.weight || 'N/A'}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Gender
                </Typography>
                <Typography variant="body2">{formData.physicalAppearance.gender || 'N/A'}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Ethnic Origins
                </Typography>
                <Typography variant="body2">{formData.physicalAppearance.ethnicOrigins || 'N/A'}</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Relationships */}
      <Card sx={{ mb: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
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
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  {formData.familyAndFriends || 'N/A'}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Allies
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  {formData.allies || 'N/A'}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Adversaries
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  {formData.adversaries || 'N/A'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Skills & Abilities */}
      <Card sx={{ mb: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: '#800000' }}>
            Skills & Abilities
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Human Skills and Achievements
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
              {formData.skillsAndAchievements || 'N/A'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: '#800000' }}>
              Superpowers & Special Abilities
            </Typography>
            {formData.abilities.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {formData.abilities.map((ability, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      p: 2,
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      backgroundColor: '#fafafa',
                    }}
                  >
                    <Typography variant="body2" fontWeight={700} sx={{ color: '#800000', mb: 0.5 }}>
                      {ability.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {ability.description}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="caption" color="text.secondary">
                No abilities added yet
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ color: '#800000', fontWeight: 700 }}>Delete Character</DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 2 }}>
            Are you sure you want to delete <strong>{formData.name}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" sx={{ background: '#f44336', color: 'white', '&:hover': { background: '#d32f2f' } }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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
