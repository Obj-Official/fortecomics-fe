'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  Typography,
  Popover,
  FormControlLabel,
  Checkbox,
  Stack,
  IconButton,
  Menu,
  Chip,
} from '@mui/material';
import {
  Search,
  MoreVert,
  Visibility,
  Block,
  People,
  NewReleases,
  BlockOutlined,
} from '@mui/icons-material';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state: string;
  country: string;
  forteCoinBalance: number;
  numberOfReads: number;
  isNew: boolean;
  isSuspended: boolean;
  age?: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement;
  color: string;
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
  <Card
    sx={{
      height: '100%',
      border: '1px solid',
      borderColor: 'divider',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      '&:hover': {
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transform: 'translateY(-2px)',
        transition: 'all 0.3s ease',
      },
    }}
  >
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box flex={1}>
          <Typography color="text.secondary" variant="body2" gutterBottom fontWeight={500}>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={600} sx={{ mb: 1, color: 'text.primary', fontSize: '24px' }}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: `${color}15`,
            color: color,
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1-234-567-8901',
    state: 'California',
    country: 'USA',
    forteCoinBalance: 1500,
    numberOfReads: 45,
    isNew: false,
    isSuspended: false,
    age: 28,
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+1-234-567-8902',
    state: 'Texas',
    country: 'USA',
    forteCoinBalance: 2300,
    numberOfReads: 78,
    isNew: true,
    isSuspended: false,
    age: 25,
  },
  {
    id: '3',
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'robert.j@example.com',
    phone: '+1-234-567-8903',
    state: 'New York',
    country: 'USA',
    forteCoinBalance: 890,
    numberOfReads: 12,
    isNew: false,
    isSuspended: true,
    age: 35,
  },
  {
    id: '4',
    firstName: 'Emily',
    lastName: 'Williams',
    email: 'emily.w@example.com',
    phone: '+1-234-567-8904',
    state: 'Florida',
    country: 'USA',
    forteCoinBalance: 3200,
    numberOfReads: 156,
    isNew: true,
    isSuspended: false,
    age: 22,
  },
  {
    id: '5',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.b@example.com',
    phone: '+1-234-567-8905',
    state: 'Illinois',
    country: 'USA',
    forteCoinBalance: 1100,
    numberOfReads: 34,
    isNew: false,
    isSuspended: false,
    age: 31,
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [actionAnchorEl, setActionAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Filter options state
  const [filters, setFilters] = useState({
    location: '',
    isNewUser: false,
    isSuspendedUser: false,
    ageMin: '',
    ageMax: '',
  });

  const itemsPerPage = 10;

  // Calculate statistics
  const totalUsers = users.length;
  const newUsersCount = users.filter((u) => u.isNew).length;
  const suspendedUsersCount = users.filter((u) => u.isSuspended).length;

  // Compute filtered and sorted users using useMemo
  const computedFilteredUsers = useMemo(() => {
    let result = users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const matchesSearch =
        fullName.includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation =
        !filters.location || `${user.state}, ${user.country}`.includes(filters.location);

      const matchesNewUser = !filters.isNewUser || user.isNew;

      const matchesSuspendedUser = !filters.isSuspendedUser || user.isSuspended;

      const matchesAge =
        (!filters.ageMin || (user.age && user.age >= parseInt(filters.ageMin))) &&
        (!filters.ageMax || (user.age && user.age <= parseInt(filters.ageMax)));

      return matchesSearch && matchesLocation && matchesNewUser && matchesSuspendedUser && matchesAge;
    });

    // Sort
    result = result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'reads-desc':
          return b.numberOfReads - a.numberOfReads;
        case 'reads-asc':
          return a.numberOfReads - b.numberOfReads;
        case 'balance-desc':
          return b.forteCoinBalance - a.forteCoinBalance;
        case 'balance-asc':
          return a.forteCoinBalance - b.forteCoinBalance;
        default:
          return 0;
      }
    });

    return result;
  }, [searchTerm, sortBy, filters, users]);

  // Update filtered users state when computed value changes
  useMemo(() => {
    setFilteredUsers(computedFilteredUsers);
    setCurrentPage(1);
  }, [computedFilteredUsers]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleActionOpen = (event: React.MouseEvent<HTMLElement>, userId: string) => {
    setActionAnchorEl(event.currentTarget);
    setSelectedUserId(userId);
  };

  const handleActionClose = () => {
    setActionAnchorEl(null);
    setSelectedUserId(null);
  };

  const handleFilterChange = (key: string, value: string | boolean | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSuspendUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, isSuspended: !user.isSuspended } : user
      )
    );
    handleActionClose();
  };

  const handleViewUser = (userId: string) => {
    // Navigate to user detail view
    console.log('View user:', userId);
    handleActionClose();
  };

  const openFilterMenu = Boolean(filterAnchorEl);
  const openActionMenu = Boolean(actionAnchorEl);

  return (
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{mb:4}}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Manage Users
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View, manage, and monitor all user accounts
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Box mb={4} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          <StatCard
            title="Total Users"
            value={totalUsers}
            icon={<People />}
            color="#800000"
          />
          <StatCard
            title="New Users"
            value={newUsersCount}
            icon={<NewReleases />}
            color="#FFA500"
          />
          <StatCard
            title="Suspended Users"
            value={suspendedUsersCount}
            icon={<BlockOutlined />}
            color="#d32f2f"
          />
        </Box>

        {/* Table Controls */}
        <Card sx={{ p: 2, mb: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ alignItems: { xs: 'stretch', sm: 'center' } }}
          >
            {/* Search Bar */}
            <TextField
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'gray' }} />,
              }}
              sx={{ flexGrow: 1, minWidth: 200 }}
              size="small"
            />

            {/* Sort Dropdown */}
            <FormControl sx={{ minWidth: 150 }} size="small">
              <InputLabel>Sort By</InputLabel>
              <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} label="Sort By">
                <MenuItem value="name">Name (A-Z)</MenuItem>
                <MenuItem value="reads-desc">Reads (High to Low)</MenuItem>
                <MenuItem value="reads-asc">Reads (Low to High)</MenuItem>
                <MenuItem value="balance-desc">Balance (High to Low)</MenuItem>
                <MenuItem value="balance-asc">Balance (Low to High)</MenuItem>
              </Select>
            </FormControl>

            {/* Filter Button */}
            <Button
              variant="outlined"
              onClick={handleFilterOpen}
              sx={{ minWidth: 120 }}
            >
              More Filters
            </Button>
          </Stack>
        </Card>

        {/* Filter Popover */}
        <Popover
          open={openFilterMenu}
          anchorEl={filterAnchorEl}
          onClose={handleFilterClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Card sx={{ p: 3, minWidth: 320 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
              Advanced Filters
            </Typography>

            {/* Location Filter */}
            <TextField
              label="Location (State, Country)"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 2 }}
            />

            {/* Age Range Filter */}
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <TextField
                label="Min Age"
                type="number"
                value={filters.ageMin}
                onChange={(e) => handleFilterChange('ageMin', e.target.value)}
                size="small"
                inputProps={{ min: '0', max: '150' }}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Max Age"
                type="number"
                value={filters.ageMax}
                onChange={(e) => handleFilterChange('ageMax', e.target.value)}
                size="small"
                inputProps={{ min: '0', max: '150' }}
                sx={{ flex: 1 }}
              />
            </Stack>

            {/* Checkboxes */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.isNewUser}
                  onChange={(e) => handleFilterChange('isNewUser', e.target.checked)}
                  size="small"
                />
              }
              label="New Users Only"
              sx={{ display: 'block', mb: 1 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.isSuspendedUser}
                  onChange={(e) => handleFilterChange('isSuspendedUser', e.target.checked)}
                  size="small"
                />
              }
              label="Suspended Users Only"
              sx={{ display: 'block', mb: 3 }}
            />

            {/* Reset Filters Button */}
            <Button
              variant="outlined"
              size="small"
              fullWidth
              onClick={() => {
                setFilters({
                  location: '',
                  isNewUser: false,
                  isSuspendedUser: false,
                  ageMin: '',
                  ageMax: '',
                });
              }}
            >
              Reset Filters
            </Button>
          </Card>
        </Popover>

        {/* Users Table */}
        <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)', mb: 3 }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Location</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Forte Coin</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Reads</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', textAlign: 'center' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      sx={{
                        backgroundColor: user.isSuspended ? '#ffebee' : 'inherit',
                        borderBottom: '1px solid #f0f0f0',
                        '&:hover': { backgroundColor: user.isSuspended ? '#ffebee' : '#fafafa' },
                      }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {user.firstName} {user.lastName}
                            </Typography>
                            <Box display="flex" gap={0.5} mt={0.5}>
                              {user.isNew && (
                                <Chip
                                  label="NEW"
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: '0.65rem',
                                    fontWeight: 600,
                                    backgroundColor: '#FFA500',
                                    color: 'white',
                                  }}
                                />
                              )}
                              {user.isSuspended && (
                                <Chip
                                  label="SUSPENDED"
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: '0.65rem',
                                    fontWeight: 600,
                                    backgroundColor: '#d32f2f',
                                    color: 'white',
                                  }}
                                />
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{user.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{user.phone}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {user.state}, {user.country}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {user.forteCoinBalance}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{user.numberOfReads}</Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={(e) => handleActionOpen(e, user.id)}
                          sx={{ color: '#800000' }}
                        >
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography color="textSecondary">No users found</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Action Menu */}
        <Menu
          anchorEl={actionAnchorEl}
          open={openActionMenu}
          onClose={handleActionClose}
        >
          <MenuItem
            onClick={() => selectedUserId && handleViewUser(selectedUserId)}
          >
            <Visibility sx={{ mr: 1 }} fontSize="small" />
            View
          </MenuItem>
          <MenuItem
            onClick={() => selectedUserId && handleSuspendUser(selectedUserId)}
          >
            <Block sx={{ mr: 1 }} fontSize="small" />
            {users.find((u) => u.id === selectedUserId)?.isSuspended
              ? 'Unsuspend User'
              : 'Suspend User'}
          </MenuItem>
        </Menu>

        {/* Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
          />
        </Box>
      </Box>
  );
}
