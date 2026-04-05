'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-toastify';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Chip,
  IconButton,
  Popover,
  MenuItem,
  Pagination,
  Grid,
  Badge,
} from '@mui/material';
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Search,
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

// Mock character data
const mockCharacters: Character[] = [
  {
    id: '1',
    name: 'Flare',
    power: 'Fire Control',
    origin: 'Mystical',
    powerSource: 'Ancient Flame',
    abilities: ['Fireball', 'Heat Shield', 'Flame Burst'],
    description: 'Master of fire with the ability to control flames and heat.',
    image: '/Flare.png',
  },
  {
    id: '2',
    name: 'Luminess',
    power: 'Light Manipulation',
    origin: 'Mystical',
    powerSource: 'Celestial Energy',
    abilities: ['Light Beam', 'Solar Flare', 'Blinding Flash'],
    description: 'Harnesses the power of pure light and cosmic energy.',
    image: '/Luminess.png',
  },
  {
    id: '3',
    name: 'Tekaru',
    power: 'Cybernetic Enhancement',
    origin: 'Scientific',
    powerSource: 'Advanced Technology',
    abilities: ['Energy Projection', 'Mechanical Strength', 'System Override'],
    description: 'A fusion of human and machine with incredible technological abilities.',
    image: '/Tekaru.jpg',
  },
  {
    id: '4',
    name: 'Omigidi',
    power: 'Dimensional Shift',
    origin: 'Mythical',
    powerSource: 'Dimensional Rift',
    abilities: ['Portal Creation', 'Reality Warp', 'Dimension Hop'],
    description: 'An ancient being with the power to manipulate dimensions itself.',
    image: '/Omi-Gidi.jpg',
  },
  {
    id: '5',
    name: 'Omigidi02',
    power: 'Dimensional Shift',
    origin: 'Mythical',
    powerSource: 'Dimensional Rift',
    abilities: ['Portal Creation', 'Reality Warp', 'Dimension Hop'],
    description: 'An ancient being with the power to manipulate dimensions itself.',
    image: '/Omi-Gidi.jpg',
  },
  {
    id: '6',
    name: 'Flare02',
    power: 'Dimensional Shift',
    origin: 'Mythical',
    powerSource: 'Dimensional Rift',
    abilities: ['Portal Creation', 'Reality Warp', 'Dimension Hop'],
    description: 'An ancient being with the power to manipulate dimensions itself.',
    image: '/Flare.png',
  },
];

const ROWS_PER_PAGE = 5;

export default function ManageCharacterPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);

  // Filter characters based on search query
  const filteredCharacters = useMemo(() => {
    return mockCharacters.filter((char) =>
      char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      char.power.toLowerCase().includes(searchQuery.toLowerCase()) ||
      char.powerSource.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCharacters.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const paginatedCharacters = filteredCharacters.slice(startIndex, startIndex + ROWS_PER_PAGE);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle pagination
  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  // Handle carousel navigation
  const handlePrevCarousel = () => {
    setCarouselIndex((prev) => (prev - 1 + mockCharacters.length) % mockCharacters.length);
  };

  const handleNextCarousel = () => {
    setCarouselIndex((prev) => (prev + 1) % mockCharacters.length);
  };

  // Handle action menu
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, characterId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedCharacterId(characterId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCharacterId(null);
  };

  // Handle view character
  const handleViewCharacter = (characterId: string) => {
    handleMenuClose();
    router.push(`/admin/managecharacter/${characterId}`);
  };

  // Handle edit character
  const handleEditCharacter = (characterId: string) => {
    handleMenuClose();
    router.push(`/admin/managecharacter/${characterId}`);
  };

  // Handle delete character
  const handleDeleteCharacter = (characterId: string) => {
    handleMenuClose();
    toast.success(`Character deleted successfully!`);
  };

  const menuOpen = Boolean(anchorEl);

  const originColors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
    Mystical: 'primary',
    Mythical: 'secondary',
    Scientific: 'error',
  };

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Manage Characters
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View, edit, and manage your comic characters
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => router.push('/admin/managecharacter/addcharacter')}
          sx={{
            background: 'linear-gradient(135deg, #800000, #FFA500)',
            color: 'white',
            fontWeight: 600,
            padding: 1.5,
            borderRadius:2,
            '&:hover': {
              background: 'linear-gradient(135deg, #600000, #FF8C00)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 16px rgba(128, 0, 0, 0.3)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Add Character
        </Button>
      </Box>

      {/* Character Count Card */}
      <Card sx={{ mb: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', width: '300px' }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: "auto" }}>
              <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                Total Characters
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ color: '#800000', mt: 0.5 }}>
                {mockCharacters.length}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Character Spotlight - Grid View */}
      <Card sx={{ mb: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
            Character Spotlight
          </Typography>

          <Grid container spacing={2}>
            {mockCharacters.map((character) => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={character.id}>
                <Paper
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: '350px',
                    paddingBottom: '120%',
                    overflow: 'hidden',
                    borderRadius: 2,
                    background: '#f5f5f5',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 12px 28px rgba(128, 0, 0, 0.2)',
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  {/* Character Image */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <Image
                      src={character.image}
                      alt={character.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </Box>

                  {/* Character Info Overlay */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))',
                      p: 2,
                      color: 'white',
                    }}
                  >
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                      {character.name}
                    </Typography>
                    <Typography variant="caption" fontWeight={600}>
                      {character.origin}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Search and Table Section */}
      <Card sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
            All Characters
          </Typography>

          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="Search by name, power, or power source..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearch}
            slotProps={{
              input: {
                startAdornment: <Search sx={{ mr: 1, color: '#800000' }} />,
              },
            }}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                height: 40,
                '&:hover fieldset': {
                  borderColor: '#800000',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FFA500',
                },
              },
            }}
          />

          {/* Table */}
          {filteredCharacters.length > 0 ? (
            <>
              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 700, color: '#800000' }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#800000' }}>Power Source</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#800000' }}>Origin</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#800000' }}>Abilities</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#800000' }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#800000', textAlign: 'center' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedCharacters.map((character) => (
                      <TableRow
                        key={character.id}
                        sx={{
                          '&:hover': {
                            backgroundColor: '#FFA50008',
                          },
                        }}
                      >
                        <TableCell sx={{ fontWeight: 600 }}>{character.name}</TableCell>
                        <TableCell>{character.powerSource}</TableCell>
                        <TableCell>
                          <Chip
                            label={character.origin}
                            color={originColors[character.origin]}
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                        <TableCell sx={{ maxWidth: 200 }}>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap'}}>
                            {character.abilities.map((ability, idx) => (
                              <Chip
                                key={idx}
                                label={ability}
                                size="small"
                                sx={{
                                  background: 'linear-gradient(135deg, #800000, #FFA500)',
                                  color: 'white',
                                }}
                              />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 400 }}>
                          <Typography variant="caption" >
                            {character.description}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, character.id)}
                            sx={{ color: '#800000' }}
                          >
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    sx={{
                      '& .MuiPaginationItem-root.Mui-selected': {
                        background: 'linear-gradient(135deg, #800000, #FFA500)',
                        color: 'white',
                      },
                      '& .MuiPaginationItem-root:hover': {
                        backgroundColor: '#FFA50015',
                      },
                    }}
                  />
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">No characters found matching your search.</Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Action Popover */}
      <Popover
        open={menuOpen}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ p: 0 }}>
          <MenuItem
            onClick={() => selectedCharacterId && handleViewCharacter(selectedCharacterId)}
            sx={{
              color: '#800000',
              '&:hover': { backgroundColor: '#FFA50015' },
            }}
          >
            <Visibility sx={{ mr: 1, fontSize: 18 }} />
            <Typography variant="body2">View Details</Typography>
          </MenuItem>
          <MenuItem
            onClick={() => selectedCharacterId && handleEditCharacter(selectedCharacterId)}
            sx={{
              color: '#800000',
              '&:hover': { backgroundColor: '#FFA50015' },
            }}
          >
            <Edit sx={{ mr: 1, fontSize: 18 }} />
            <Typography variant="body2">Edit</Typography>
          </MenuItem>
          <MenuItem
            onClick={() => selectedCharacterId && handleDeleteCharacter(selectedCharacterId)}
            sx={{
              color: '#f44336',
              '&:hover': { backgroundColor: '#f4433615' },
            }}
          >
            <Delete sx={{ mr: 1, fontSize: 18 }} />
            <Typography variant="body2">Delete</Typography>
          </MenuItem>
        </Box>
      </Popover>
    </Box>
  );
}
