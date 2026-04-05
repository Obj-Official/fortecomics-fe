'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  Modal,
} from '@mui/material';
import {
  CloudUpload,
  Close,
  CheckCircle,
  Error,
  DragIndicator,
  Publish,
  Preview,
  ArrowBack,
  ArrowForward,
} from '@mui/icons-material';

interface UploadImage {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  uploadedId?: string;
}

interface ComicLine {
  id: string;
  name: string;
}

const mockComicLines: ComicLine[] = [
  { id: '1', name: 'Luminess: Age of Light' },
  { id: '2', name: 'Legend of the First Flame' },
  { id: '3', name: '[Special] Colorful Twilights' },
  { id: '4', name: 'Genie Hunt' },
];

export default function ComicUploadPage() {
  const router = useRouter();
  const dragRef = useRef<HTMLDivElement>(null);
  const dragCoverRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileCoverInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [selectedComicLine, setSelectedComicLine] = useState('');
  const [comicIssue, setComicIssue] = useState('');
  const [createNewComic, setCreateNewComic] = useState(false);
  const [newComicName, setNewComicName] = useState('');

  // Upload state
  const [images, setImages] = useState<UploadImage[]>([]);
  const [coverImages, setCoverImages] = useState<UploadImage[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [dragCoverActive, setDragCoverActive] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

  // Generate unique ID for each image
  const generateImageId = () => `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Simulate upload with progress (handles both pages and covers)
  const simulateUpload = (imageId: string, isCover: boolean = false) => {
    const setStateFunc = isCover ? setCoverImages : setImages;

    setStateFunc((prev) =>
      prev.map((img) =>
        img.id === imageId ? { ...img, status: 'uploading', progress: 0 } : img
      )
    );

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) progress = 100;

      setStateFunc((prev) =>
        prev.map((img) =>
          img.id === imageId ? { ...img, progress: Math.min(progress, 100) } : img
        )
      );

      if (progress >= 100) {
        clearInterval(interval);
        // Simulate occasional failure (10% chance)
        const isSuccess = Math.random() > 0.1;
        setTimeout(() => {
          setStateFunc((prev) =>
            prev.map((img) =>
              img.id === imageId
                ? {
                    ...img,
                    status: isSuccess ? 'success' : 'error',
                    uploadedId: isSuccess ? generateImageId() : undefined,
                    error: isSuccess ? undefined : 'Upload failed, please retry',
                  }
                : img
            )
          );
        }, 300);
      }
    }, 150);
  };

  // Handle file selection for pages
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const newImages: UploadImage[] = [];
    const totalFiles = files.length;

    if (images.length + totalFiles > 20) {
      toast.error('Maximum 20 page images allowed');
      return;
    }

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const preview = URL.createObjectURL(file);
        newImages.push({
          id: generateImageId(),
          file,
          preview,
          progress: 0,
          status: 'pending',
        });
      }
    });

    setImages((prev) => [...prev, ...newImages]);
    
    // Simulate upload process
    newImages.forEach((img, idx) => {
      setTimeout(() => simulateUpload(img.id), idx * 100);
    });
  }, [images.length]);

  // Handle file selection for covers (only 1 cover image)
  const handleCoverFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    // Only allow 1 cover image
    if (coverImages.length > 0) {
      toast.error('Only 1 cover image allowed. Remove the existing one first.');
      return;
    }

    const newCovers: UploadImage[] = [];

    // Only take the first file
    const file = files[0];
    if (file && file.type.startsWith('image/')) {
      const preview = URL.createObjectURL(file);
      newCovers.push({
        id: generateImageId(),
        file,
        preview,
        progress: 0,
        status: 'pending',
      });
    }

    setCoverImages((prev) => [...prev, ...newCovers]);
    
    // Simulate upload process with isCover flag
    newCovers.forEach((img, idx) => {
      setTimeout(() => simulateUpload(img.id, true), idx * 100);
    });
  }, [coverImages.length]);

  // Retry failed upload
  const retryUpload = (imageId: string) => {
    simulateUpload(imageId);
  };

  // Remove image
  const removeImage = (imageId: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === imageId);
      if (img) {
        URL.revokeObjectURL(img.preview);
      }
      return prev.filter((i) => i.id !== imageId);
    });
  };

  // Remove cover image
  const removeCoverImage = (imageId: string) => {
    setCoverImages((prev) => {
      const img = prev.find((i) => i.id === imageId);
      if (img) {
        URL.revokeObjectURL(img.preview);
      }
      return prev.filter((i) => i.id !== imageId);
    });
  };

  // Handle drag events for pages
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drag events for covers
  const handleCoverDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragCoverActive(true);
    } else if (e.type === 'dragleave') {
      setDragCoverActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleCoverDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCoverActive(false);
    handleCoverFileSelect(e.dataTransfer.files);
  };

  // Drag to reorder
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDropReorder = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    
    // Find the dragged item (simplified - in production use proper drag data)
    const draggedElement = (e.currentTarget as HTMLElement).closest('[data-index]');
    if (draggedElement) {
      const dragIndex = parseInt(draggedElement.getAttribute('data-index') || '-1');
      if (dragIndex !== -1 && dragIndex !== dropIndex) {
        const newImages = [...images];
        const [draggedImage] = newImages.splice(dragIndex, 1);
        newImages.splice(dropIndex, 0, draggedImage);
        setImages(newImages);
      }
    }
  };

  // Check if ready to publish
  const canPublish = images.length > 0 && images.every((img) => img.status === 'success') && comicIssue.trim();
  const allUploaded = images.every((img) => img.status !== 'pending' && img.status !== 'uploading');

  // Handle publish
  const handlePublish = async () => {
    setIsPublishing(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const payload = {
      comicLineId: createNewComic ? null : selectedComicLine,
      newComicName: createNewComic ? newComicName : null,
      issue: comicIssue,
      imageIds: images
        .filter((img) => img.status === 'success')
        .map((img) => img.uploadedId),
      imageOrder: images.map((img) => img.id),
      coverIds: coverImages
        .filter((img) => img.status === 'success')
        .map((img) => img.uploadedId),
    };

    console.log('Publishing comic:', payload);
    setIsPublishing(false);
    setPublishDialogOpen(false);
    
    // Show success message and redirect
    toast.success('Comic published successfully!');
    setTimeout(() => {
      router.push('/admin/uploadcomic/add');
    }, 1000);
  };

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Upload New Comic
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Select a comic line, enter the issue number, upload a cover image, and add up to 20 pages
        </Typography>
      </Box>

      {/* Comic Selection Form */}
      <Card sx={{ mb: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
            Comic Information
          </Typography>
          
          <Grid container spacing={3}>
            {/* Comic Line Selection */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Select Comic Line</InputLabel>
                <Select
                  value={selectedComicLine}
                  label="Select Comic Line"
                  onChange={(e) => {
                    setSelectedComicLine(e.target.value);
                    setCreateNewComic(false);
                  }}
                  sx={{
                    minWidth: 240,
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
                  {mockComicLines.map((line) => (
                    <MenuItem key={line.id} value={line.id}>
                      {line.name}
                    </MenuItem>
                  ))}
                  <MenuItem value="__new__">
                    <Box sx={{ color: '#800000', fontWeight: 600 }}>+ Create New Comic</Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Issue Number */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Comic Issue Number"
                placeholder="e.g., #01, #05, Special"
                value={comicIssue}
                onChange={(e) => setComicIssue(e.target.value)}
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
            </Grid>

            {/* New Comic Name (if creating new) */}
            {selectedComicLine === '__new__' && (
              <Grid size={{ xs: 12}}>
                <TextField
                  fullWidth
                  label="New Comic Title"
                  placeholder="Enter the title for the new comic series"
                  value={newComicName}
                  onChange={(e) => {
                    setNewComicName(e.target.value);
                    setCreateNewComic(true);
                  }}
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
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Cover Upload and Preview Section */}
      <Card sx={{ mb: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
            Upload Comic Cover
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            {/* Left Side - Upload Zone */}
            <Box>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: '#800000' }}>
                Upload Cover Image
              </Typography>
              
              {/* Drag & Drop Zone for Cover */}
              <Box
                ref={dragCoverRef}
                onDragEnter={handleCoverDrag}
                onDragLeave={handleCoverDrag}
                onDragOver={handleCoverDrag}
                onDrop={handleCoverDrop}
                onClick={() => fileCoverInputRef.current?.click()}
                sx={{
                  border: '2px dashed',
                  borderColor: dragCoverActive ? '#800000' : '#FFA50040',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: dragCoverActive ? '#80000008' : '#FFA50005',
                  '&:hover': {
                    borderColor: '#800000',
                    backgroundColor: '#80000008',
                  },
                  minHeight: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <input
                  ref={fileCoverInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleCoverFileSelect(e.target.files)}
                  style={{ display: 'none' }}
                />
                
                <CloudUpload sx={{ fontSize: 40, color: '#800000', mb: 1 }} />
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: '#800000' }}>
                  Drag & Drop Here
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
                  or click to browse
                </Typography>
                <Chip
                  label="JPG, PNG, GIF, WebP"
                  size="small"
                  variant="outlined"
                />
              </Box>

              {/* Info Message */}
              {coverImages.length === 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Upload 1 cover image for your comic
                </Alert>
              )}
            </Box>

            {/* Right Side - Preview */}
            <Box>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: '#800000' }}>
                Cover Preview
              </Typography>

              {coverImages.length > 0 ? (
                <Paper
                  sx={{
                    position: 'relative',
                    width: '100%',
                    paddingBottom: '140%',
                    overflow: 'hidden',
                    borderRadius: 2,
                    background: '#f5f5f5',
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      background: 'linear-gradient(135deg, #800000, #FFA500)',
                      color: 'white',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      zIndex: 2,
                    }}
                  >
                    Cover
                  </Box>

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
                      src={coverImages[0].preview}
                      alt="Cover"
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </Box>

                  {/* Overlay */}
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background: coverImages[0].status === 'uploading' ? 'rgba(0,0,0,0.3)' : 'transparent',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      p: 1.5,
                      zIndex: 1,
                    }}
                  >
                    {/* Progress Bar */}
                    {coverImages[0].status === 'uploading' && (
                      <Box sx={{ mb: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={coverImages[0].progress}
                          sx={{
                            height: 4,
                            borderRadius: 2,
                            background: 'rgba(255,255,255,0.2)',
                            '& .MuiLinearProgress-bar': {
                              background: 'linear-gradient(90deg, #800000, #FFA500)',
                            },
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            color: 'white',
                            textAlign: 'center',
                            mt: 0.5,
                            fontWeight: 600,
                          }}
                        >
                          {Math.round(coverImages[0].progress)}%
                        </Typography>
                      </Box>
                    )}

                    {/* Status Badge */}
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      {coverImages[0].status === 'success' && (
                        <Chip
                          icon={<CheckCircle />}
                          label="Uploaded"
                          size="small"
                          sx={{
                            background: 'linear-gradient(135deg, #4caf50, #66bb6a)',
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                      )}
                      {coverImages[0].status === 'error' && (
                        <Box sx={{ flex: 1 }}>
                          <Chip
                            icon={<Error />}
                            label="Failed"
                            size="small"
                            sx={{
                              background: 'linear-gradient(135deg, #f44336, #ef5350)',
                              color: 'white',
                              fontWeight: 600,
                              width: '100%',
                            }}
                          />
                          <Button
                            size="small"
                            sx={{
                              mt: 1,
                              width: '100%',
                              background: 'rgba(255,255,255,0.9)',
                              color: '#800000',
                              fontWeight: 600,
                              '&:hover': { background: 'white' },
                            }}
                            onClick={() => simulateUpload(coverImages[0].id, true)}
                          >
                            Retry
                          </Button>
                        </Box>
                      )}
                      {coverImages[0].status === 'pending' && (
                        <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                          Waiting...
                        </Typography>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => removeCoverImage(coverImages[0].id)}
                        sx={{
                          ml: 'auto',
                          background: 'rgba(255,255,255,0.9)',
                          '&:hover': { background: 'white' },
                        }}
                      >
                        <Close sx={{ fontSize: 18, color: '#f44336' }} />
                      </IconButton>
                    </Box>
                  </Box>
                </Paper>
              ) : (
                <Paper
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    minHeight: 300,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f9f9f9',
                    border: '1px dashed #e0e0e0',
                    borderRadius: 2,
                  }}
                >
                  <Typography color="text.secondary">
                    Upload a cover image to preview it here
                  </Typography>
                </Paper>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* File Upload Area */}
      <Card sx={{ mb: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
            Upload Comic Pages
          </Typography>

          {/* Drag & Drop Zone */}
          <Box
            ref={dragRef}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            sx={{
              border: '2px dashed',
              borderColor: dragActive ? '#800000' : '#FFA50040',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backgroundColor: dragActive ? '#80000008' : '#FFA50005',
              '&:hover': {
                borderColor: '#800000',
                backgroundColor: '#80000008',
              },
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              style={{ display: 'none' }}
            />
            
            <CloudUpload sx={{ fontSize: 48, color: '#800000', mb: 1 }} />
            <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: '#800000' }}>
              Drag & Drop Images Here
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              or click to browse. Maximum 20 images allowed ({images.length}/20)
            </Typography>
            <Chip
              label="Supported: JPG, PNG, GIF, WebP"
              size="small"
              variant="outlined"
            />
          </Box>

          {/* Info Message */}
          {images.length === 0 && (
            <Alert severity="info" sx={{ mt: 3 }}>
              Images are uploaded sequentially in batches. You&apos;ll see live progress for each image.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <Card sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight={700}>
                Page Preview ({images.length}/20)
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography variant="body2" color={allUploaded ? 'success.main' : 'warning.main'} fontWeight={600}>
                  {allUploaded ? '✓ All processed' : 'Processing...'}
                </Typography>
                {images.length > 0 && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Preview />}
                    onClick={() => {
                      setCurrentPreviewIndex(0);
                      setPreviewModalOpen(true);
                    }}
                    sx={{
                      color: '#800000',
                      borderColor: '#800000',
                      '&:hover': {
                        borderColor: '#600000',
                        backgroundColor: '#80000005',
                      },
                    }}
                  >
                    Preview
                  </Button>
                )}
              </Box>
            </Box>

            <Grid container spacing={2}>
              {images.map((img, index) => (
                <Box
                  key={img.id}
                  data-index={index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDropReorder(e, index)}
                  sx={{
                    width: { xs: '100%', sm: '50%', md: '33.333%', lg: '25%' },
                    px: 1,
                    opacity: dragOverIndex === index ? 0.5 : 1,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  <Paper
                    sx={{
                      position: 'relative',
                      width: '100%',
                      paddingBottom: '140%',
                      overflow: 'hidden',
                      borderRadius: 2,
                      background: '#f5f5f5',
                      border: '1px solid #e0e0e0',
                      '&:hover': {
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    {/* Page Number */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        background: 'linear-gradient(135deg, #800000, #FFA500)',
                        color: 'white',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        zIndex: 2,
                      }}
                    >
                      Page {index + 1}
                    </Box>

                    {/* Drag Handle */}
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        background: 'rgba(255,255,255,0.9)',
                        '&:hover': { background: 'white' },
                        zIndex: 3,
                      }}
                    >
                      <DragIndicator sx={{ fontSize: 20, color: '#800000' }} />
                    </IconButton>

                    {/* Image Container */}
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
                        src={img.preview}
                        alt={`Page ${index + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </Box>

                    {/* Overlay */}
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background: img.status === 'uploading' ? 'rgba(0,0,0,0.3)' : 'transparent',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        p: 1.5,
                        zIndex: 1,
                      }}
                    >
                      {/* Progress Bar */}
                      {img.status === 'uploading' && (
                        <Box sx={{ mb: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={img.progress}
                            sx={{
                              height: 4,
                              borderRadius: 2,
                              background: 'rgba(255,255,255,0.2)',
                              '& .MuiLinearProgress-bar': {
                                background: 'linear-gradient(90deg, #800000, #FFA500)',
                              },
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              display: 'block',
                              color: 'white',
                              textAlign: 'center',
                              mt: 0.5,
                              fontWeight: 600,
                            }}
                          >
                            {Math.round(img.progress)}%
                          </Typography>
                        </Box>
                      )}

                      {/* Status Badge */}
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        {img.status === 'success' && (
                          <Chip
                            icon={<CheckCircle />}
                            label="Uploaded"
                            size="small"
                            sx={{
                              background: 'linear-gradient(135deg, #4caf50, #66bb6a)',
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                        )}
                        {img.status === 'error' && (
                          <Box sx={{ flex: 1 }}>
                            <Chip
                              icon={<Error />}
                              label="Failed"
                              size="small"
                              sx={{
                                background: 'linear-gradient(135deg, #f44336, #ef5350)',
                                color: 'white',
                                fontWeight: 600,
                                width: '100%',
                              }}
                            />
                            <Button
                              size="small"
                              sx={{
                                mt: 1,
                                width: '100%',
                                background: 'rgba(255,255,255,0.9)',
                                color: '#800000',
                                fontWeight: 600,
                                '&:hover': { background: 'white' },
                              }}
                              onClick={() => retryUpload(img.id)}
                            >
                              Retry
                            </Button>
                          </Box>
                        )}
                        {img.status === 'pending' && (
                          <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                            Waiting...
                          </Typography>
                        )}
                        <IconButton
                          size="small"
                          onClick={() => removeImage(img.id)}
                          sx={{
                            ml: 'auto',
                            background: 'rgba(255,255,255,0.9)',
                            '&:hover': { background: 'white' },
                          }}
                        >
                          <Close sx={{ fontSize: 18, color: '#f44336' }} />
                        </IconButton>
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          onClick={() => router.push('/admin/uploadcomic')}
          sx={{
            color: '#800000',
            borderColor: '#800000',
            '&:hover': {
              borderColor: '#600000',
              backgroundColor: '#80000005',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<Publish />}
          onClick={() => setPublishDialogOpen(true)}
          disabled={!canPublish || isPublishing}
          sx={{
            background: 'linear-gradient(135deg, #800000, #FFA500)',
            color: 'white',
            fontWeight: 600,
            px: 3,
            '&:hover': {
              background: 'linear-gradient(135deg, #600000, #FF8C00)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 16px rgba(128, 0, 0, 0.3)',
            },
            '&:disabled': {
              background: '#cccccc',
              color: '#999999',
            },
            transition: 'all 0.3s ease',
          }}
        >
          {isPublishing ? 'Publishing...' : 'Publish Comic'}
        </Button>
      </Box>

      {/* Publish Confirmation Dialog */}
      <Dialog open={publishDialogOpen} onClose={() => !isPublishing && setPublishDialogOpen(false)}>
        <DialogTitle sx={{ color: '#800000', fontWeight: 700 }}>Confirm Publication</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              <strong>Comic Line:</strong> {createNewComic ? newComicName : mockComicLines.find((l) => l.id === selectedComicLine)?.name}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              <strong>Issue:</strong> {comicIssue}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              <strong>Pages:</strong> {images.filter((img) => img.status === 'success').length} uploaded
            </Typography>
            <Alert severity="info">
              Once published, this comic will be available in your comic library and visible to readers.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPublishDialogOpen(false)} disabled={isPublishing}>
            Cancel
          </Button>
          <Button
            onClick={handlePublish}
            variant="contained"
            disabled={isPublishing}
            sx={{
              background: 'linear-gradient(135deg, #800000, #FFA500)',
              color: 'white',
            }}
          >
            {isPublishing ? 'Publishing...' : 'Publish'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Comic Pages Preview Modal */}
      <Modal
        open={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            width: '90%',
            maxWidth: '900px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Preview Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #800000, #FFA500)',
              color: 'white',
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6" fontWeight={700}>
              Comic Pages Preview - Sequential View
            </Typography>
            <IconButton
              onClick={() => setPreviewModalOpen(false)}
              sx={{ color: 'white' }}
            >
              <Close />
            </IconButton>
          </Box>

          {/* Preview Content */}
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
              backgroundColor: '#f5f5f5',
            }}
          >
            {images.length > 0 && images[currentPreviewIndex] ? (
              <>
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '500px',
                    aspectRatio: '2 / 3',
                    backgroundColor: 'white',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    mb: 2,
                  }}
                >
                  <Image
                    src={images[currentPreviewIndex].preview}
                    alt={`Page ${currentPreviewIndex + 1}`}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </Box>
                <Typography variant="body1" fontWeight={600} sx={{ mb: 1 }}>
                  Page {currentPreviewIndex + 1} of {images.length}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 3 }}>
                  {images[currentPreviewIndex].status === 'success' ? '✓ Uploaded' : `Status: ${images[currentPreviewIndex].status}`}
                </Typography>
              </>
            ) : (
              <Typography color="text.secondary">No images to preview</Typography>
            )}
          </Box>

          {/* Navigation Controls */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              backgroundColor: '#f9f9f9',
              borderTop: '1px solid #e0e0e0',
            }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => setCurrentPreviewIndex(Math.max(0, currentPreviewIndex - 1))}
              disabled={currentPreviewIndex === 0}
              sx={{
                color: '#800000',
                borderColor: '#800000',
                '&:hover': {
                  borderColor: '#600000',
                  backgroundColor: '#80000005',
                },
              }}
            >
              Previous
            </Button>

            {/* Page Indicator */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" fontWeight={600}>
                {currentPreviewIndex + 1} / {images.length}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, mt: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                {images.map((_, idx) => (
                  <Box
                    key={idx}
                    onClick={() => setCurrentPreviewIndex(idx)}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: idx === currentPreviewIndex ? 'linear-gradient(135deg, #800000, #FFA500)' : '#cccccc',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.3)',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>

            <Button
              variant="outlined"
              endIcon={<ArrowForward />}
              onClick={() => setCurrentPreviewIndex(Math.min(images.length - 1, currentPreviewIndex + 1))}
              disabled={currentPreviewIndex === images.length - 1}
              sx={{
                color: '#800000',
                borderColor: '#800000',
                '&:hover': {
                  borderColor: '#600000',
                  backgroundColor: '#80000005',
                },
              }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Box>
  );
}
