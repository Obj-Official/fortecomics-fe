'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
// import { useAuthStore } from '@/store/authStore';
// import { toast } from 'react-toastify';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  HelpOutline,
  PeopleOutline,
  Settings,
  Logout,
  AccountCircle,
  Notifications,
  AssessmentOutlined,
SportsMartialArts,
UploadFile,
AutoStories,
StackedBarChart,
AccountBalanceWallet
} from '@mui/icons-material';

const drawerWidth = 280;

interface NavItem {
  title: string;
  path: string;
  icon: React.ReactElement;
  badge?: number;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { title: 'Dashboard', path: '/admin/dashboard', icon: <AssessmentOutlined /> },
  { title: 'Comic Upload', path: '/admin/uploadcomic', icon: <UploadFile /> },
  { title: 'Characters', path: '/admin/managecharacter', icon: <SportsMartialArts /> },
  { title: 'Story Arcs', path: '/admin/arcs', icon: <AutoStories/> },
  { title: 'Manage Users', path: '/admin/users', icon: <PeopleOutline /> },
  { title: 'Stats', path: '/admin/stats', icon: <StackedBarChart />  },
  { title: 'Transactions', path: '/admin/transactions', icon: <AccountBalanceWallet /> },
  { title: 'FAQ', path: '/admin/faq', icon: <HelpOutline /> },
  { title: 'Settings', path: '/admin/settings', icon: <Settings />, adminOnly: true },
  { title: 'Profile', path: '/admin/profile', icon: <AccountCircle />, adminOnly: true },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

//   const { user, clearAuth } = useAuthStore();
const [user] = useState({
    role: "Admin",
    username: "obj",
    email: "obj@obj.com"
});
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // clearAuth();
    // toast.success('Logged out successfully');
    router.push('/auth/login');
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box>
      {/* Logo Section */}
      <Box
        sx={{
          p: 3,
          backgroundColor: '#800000',
          color: 'white',
        }}
      >
        <Image
          src={"/forte-logo.jpg"}
          alt="Forte Logo"
          width={100}
          height={50}
          priority
        />
        
      </Box>

      {/* <Divider /> */}

      {/* Navigation */}
      <List sx={{ px: 2,backgroundColor: '#800000', py: 1 }}>
        {navItems.map((item) => {
          // Hide admin-only items if user is not super admin
          if (item.adminOnly && user?.role !== 'super') {
            return null;
          }

          const isActive = pathname === item.path;

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  display: item.path === '/admin/profile' ? 'none' : 'flex',
                  borderRadius: 1,
                  backgroundColor: isActive ? '#FFA50040' : 'transparent',
                  borderLeft: isActive ? '4px solid #FFA500' : 'none',
                  paddingLeft: isActive ? '12px' : '16px',
                  mt: item.path === '/admin/settings' ? 15 : 0,
                  color: '#ffffff',
                  fontWeight: isActive ? 700 : 500,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(247, 247, 247, 0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#ffffff' : 'inherit', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontSize: '0.95rem',
                    fontWeight: isActive ? 600 : 500,
                  }}
                />
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.75rem',
                      backgroundColor: '#8B1538',
                      color: 'white',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* User Info */}
      <Box sx={{ p: 1, mt: 'auto', backgroundColor: '#800000' }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 0.5,
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer',  
            '&:hover': { backgroundColor: 'rgba(93, 11, 37, 0.1)', } 
          }}
           onClick={() => handleNavigation('/admin/profile')}
        >
          <Avatar sx={{ bgcolor: '#8B1538', width: 40, height: 40 }}>
            {user?.username?.charAt(0).toUpperCase() || 'A'}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0, }}>
            <Typography variant="body2" fontWeight={600} noWrap>
              {user?.username ? user.username.charAt(0).toUpperCase() + user.username.slice(1) : 'Admin User'}
            </Typography>
            <Typography variant="caption" noWrap>
              {user?.email || user?.username || 'admin@admoni.com'}
            </Typography>
          </Box>

          <Box sx={{ flex: 0.3, minWidth: 0 }}>
            <ListItemButton
                onClick={() => handleLogout()}
                sx={{
                  borderRadius: 1,
                  p:2,
                  backgroundColor:  'transparent',
                }}
              >
            <Logout
                sx={{
                  color: "#ffffff",
                  '&:hover': {
                    color: '#f9f910',
                    fontWeight: 800,
                  },
                }}
            />
            </ListItemButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: 'white',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {navItems.find((item) => {
              if (pathname === item.path) return true;
              if (item.path === '/adverts' && pathname.startsWith('/adverts')) return true;
              if (item.path === '/users' && pathname.startsWith('/users')) return true;
              if (item.path === '/advertgroup' && pathname.startsWith('/advertgroup')) return true;
              if (item.path === '/advertisers' && pathname.startsWith('/advertisers')) return true;
              return false;
            })?.title || 'Dashboard'}
          </Typography>

          {/* Notifications */}
          <IconButton color="inherit" sx={{ mr: 1 }}>
            <Notifications />
          </IconButton>

          {/* Profile Menu */}
          <IconButton onClick={handleProfileMenuOpen} color="inherit">
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        {children}
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => { handleNavigation('/profile'); handleProfileMenuClose(); }}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => { handleNavigation('/settings'); handleProfileMenuClose(); }}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}
