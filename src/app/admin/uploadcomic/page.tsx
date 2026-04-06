'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Box,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  MoreVert,
  Search,
  TrendingUp,
  Collections,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';

interface Comic {
  id: string;
  title: string;
  issue: string;
  date: string;
  plot: string;
  reads: number;
  description: string;
  image?: string;
}

const mockComics: Comic[] = [
  {
    id: '1',
    title: 'Luminess: Age of Light',
    issue: '#01',
    date: '2024-01-15',
    plot: 'An epic tale of light and darkness',
    reads: 5420,
    description: 'The beginning of a grand adventure',
    image: '/featured_release_01.png',
  },
  {
    id: '2',
    title: 'Legend of the First Flame',
    issue: '#06',
    date: '2024-01-20',
    plot: 'Journey through ancient kingdoms',
    reads: 8230,
    description: 'Discover the origins of magic',
    image: '/featured_release_02.png',
  },
  {
    id: '3',
    title: '[Special] Colorful Twilights',
    issue: 'Special',
    date: '2024-01-25',
    plot: 'A colorful journey through dimensions',
    reads: 6120,
    description: 'Special edition with unique art',
    image: '/featured_release_03.png',
  },
  {
    id: '4',
    title: 'Genie Hunt',
    issue: '#10',
    date: '2024-02-01',
    plot: 'Adventure and mystery combined',
    reads: 7890,
    description: 'Hunting for mystical genies',
    image: '/featured_release_04.png',
  },
  {
    id: '5',
    title: 'Legend of the First Flame',
    issue: '#24',
    date: '2024-02-05',
    plot: 'The story continues to unfold',
    reads: 9120,
    description: 'New chapters of the legend',
    image: '/featured_release_05.png',
  },
  {
    id: '6',
    title: 'Cosmic Adventures',
    issue: '#03',
    date: '2024-02-10',
    plot: 'Explore the vast reaches of space',
    reads: 4560,
    description: 'Beyond the stars await wonders',
    image: '/featured_release_06.jpg',
  },
  {
    id: '7',
    title: 'Secret Society',
    issue: '#12',
    date: '2024-02-15',
    plot: 'Uncover hidden truths',
    reads: 6780,
    description: 'A mystery within mystery',
    image: '/featured_release_07.jpg',
  },
];

const carouselComics = mockComics.slice(0, 5);

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement;
  color: string;
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
  <Card
    sx={{
      minWidth: '200px',
      background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
      border: `1px solid ${color}40`,
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      '&:hover': {
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        transform: 'translateY(-4px)',
        transition: 'all 0.3s ease',
      },
    }}
  >
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography color="text.secondary" variant="body2" gutterBottom fontWeight={500}>
            {title}
          </Typography>
          <Typography variant="h5" fontWeight={700} sx={{ color: color }}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 50,
            height: 50,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, #800000, #FFA500)`,
            color: 'white',
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

interface ComicCarouselProps {
  comics: Comic[];
  onComicClick: (id: string) => void;
}

const ComicCarousel = ({ comics, onComicClick }: ComicCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('carousel-container');
    if (container) {
      const itemWidth = container.offsetWidth / 3.5;
      const scrollAmount = itemWidth * 1.2;
      container.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleDotClick = (index: number) => {
    const container = document.getElementById('carousel-container');
    if (container) {
      const itemWidth = (container.scrollWidth - container.offsetWidth) / (comics.length - 1);
      container.scrollTo({
        left: itemWidth * index,
        behavior: 'smooth',
      });
      setCurrentIndex(index);
    }
  };

  return (
    <Card
      sx={{
        mb: 4,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            py: 3,
            px: 2,
          }}
        >
          {/* Carousel Title */}
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2, px: 1 }}>
            Featured Comics
          </Typography>

          {/* Carousel Container */}
          <Box
            id="carousel-container"
            sx={{
              display: 'flex',
              gap: 2,
              overflowX: 'hidden',
              scrollBehavior: 'smooth',
              pb: 1,
            }}
          >
            {comics.map((comic) => (
              <Box
                key={comic.id}
                onClick={() => onComicClick(comic.id)}
                sx={{
                  flex: '0 0 calc(33.333% - 12px)',
                  minWidth: '200px',
                  maxWidth: '250px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    paddingBottom: '140%',
                    overflow: 'hidden',
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(128, 0, 0, 0.3)',
                      transform: 'translateY(-8px)',
                    },
                  }}
                >
                  <Image
                    src={comic.image || '/placeholder-comic.jpg'}
                    alt={comic.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  {/* Info Overlay */}
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0))',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      p: 2,
                      color: 'white',
                    }}
                  >
                    <Typography variant="body2" fontWeight={700} noWrap>
                      {comic.title}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      {comic.issue}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Navigation Buttons */}
          <IconButton
            onClick={() => handleScroll('left')}
            sx={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255,255,255,0.9)',
              '&:hover': { backgroundColor: 'white' },
              zIndex: 2,
            }}
          >
            <ChevronLeft sx={{ color: '#800000' }} />
          </IconButton>
          <IconButton
            onClick={() => handleScroll('right')}
            sx={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255,255,255,0.9)',
              '&:hover': { backgroundColor: 'white' },
              zIndex: 2,
            }}
          >
            <ChevronRight sx={{ color: '#800000' }} />
          </IconButton>

          {/* Carousel Indicators */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 1,
              mt: 2,
              pb: 1,
            }}
          >
            {comics.map((_, index) => (
              <Box
                key={index}
                onClick={() => handleDotClick(index)}
                sx={{
                  width: currentIndex === index ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: currentIndex === index ? '#800000' : '#80000040',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#800000',
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default function ComicUploadPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedComic, setSelectedComic] = useState<Comic | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Filter comics based on search
  const filteredComics = useMemo(() => {
    return mockComics.filter((comic) =>
      comic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comic.issue.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Paginate filtered comics
  const paginatedComics = useMemo(() => {
    return filteredComics.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredComics, page, rowsPerPage]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, comic: Comic) => {
    setAnchorEl(event.currentTarget);
    setSelectedComic(comic);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleView = () => {
    if (selectedComic) {
      router.push(`/admin/uploadcomic/${selectedComic.id}`);
    }
    handleMenuClose();
  };

  const handleEdit = () => {
    if (selectedComic) {
      router.push(`/admin/uploadcomic/${selectedComic.id}`);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setDeleteDialogOpen(false);
    handleMenuClose();
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleComicClick = (comicId: string) => {
    router.push(`/admin/uploadcomic/${comicId}`);
  };

  const handleUploadClick = () => {
    router.push('/admin/uploadcomic/add');
  };

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Comic Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and upload your comic releases
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleUploadClick}
          sx={{
            background: 'linear-gradient(135deg, #800000, #FFA500)',
            color: 'white',
            fontWeight: 600,
            px: 3,
            py: 1.2,
            borderRadius: 2,
            '&:hover': {
              background: 'linear-gradient(135deg, #600000, #FF8C00)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 16px rgba(128, 0, 0, 0.3)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Upload Comic
        </Button>
      </Box>

      {/* Stat Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 4,
        }}
      >
        <StatCard
          title="Total Comics"
          value="24"
          icon={<Collections sx={{ fontSize: 25 }} />}
          color="#800000"
        />
        <StatCard
          title="Total Issues"
          value="187"
          icon={<TrendingUp sx={{ fontSize: 25 }} />}
          color="#FFA500"
        />
      </Box>

      {/* Carousel Section */}
      <ComicCarousel comics={carouselComics} onComicClick={handleComicClick} />

      {/* Table Section */}
      <Card sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              All Comic Releases
            </Typography>
            <TextField
              fullWidth
              placeholder="Search by title or issue..."
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
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

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 700, color: '#800000' }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#800000' }}>Issue</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#800000' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#800000' }}>Brief Plot</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: '#800000' }}>
                    Reads
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#800000' }}>Description</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: '#800000' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedComics.map((comic) => (
                  <TableRow
                    key={comic.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: '#fafafa',
                      },
                      cursor: 'pointer',
                    }}
                    onClick={() => handleComicClick(comic.id)}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {comic.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={comic.issue} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {comic.date}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {comic.plot}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={comic.reads}
                        size="small"
                        variant="outlined"
                        icon={<TrendingUp sx={{ fontSize: 14 }} />}
                        sx={{
                          background: 'linear-gradient(135deg, #80000010, #FFA50010)',
                          borderColor: '#FFA500',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {comic.description}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, comic)}
                        sx={{
                          '&:hover': {
                            backgroundColor: '#80000010',
                          },
                        }}
                      >
                        <MoreVert fontSize="small" />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && selectedComic?.id === comic.id}
                        onClose={handleMenuClose}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                      >
                        <MenuItem
                          onClick={handleView}
                          sx={{
                            '&:hover': {
                              backgroundColor: '#80000010',
                            },
                          }}
                        >
                          <Visibility fontSize="small" sx={{ mr: 1, color: '#800000' }} />
                          View
                        </MenuItem>
                        <MenuItem
                          onClick={handleEdit}
                          sx={{
                            '&:hover': {
                              backgroundColor: '#FFA50010',
                            },
                          }}
                        >
                          <Edit fontSize="small" sx={{ mr: 1, color: '#FFA500' }} />
                          Edit
                        </MenuItem>
                        <MenuItem
                          onClick={handleDelete}
                          sx={{
                            '&:hover': {
                              backgroundColor: '#ff1744' + '10',
                            },
                          }}
                        >
                          <Delete fontSize="small" sx={{ mr: 1, color: '#ff1744' }} />
                          Delete
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredComics.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            sx={{
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                marginBottom: 0,
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ color: '#800000', fontWeight: 700 }}>Delete Comic</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete &quot;{selectedComic?.title} {selectedComic?.issue}&quot;? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #800000, #FFA500)',
              color: 'white',
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
