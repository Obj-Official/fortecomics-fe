'use client';

import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Avatar,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  People,
  Token,
  VideoCameraFront,
  AccountBalanceWallet,
  LibraryBooks,
  SportsMartialArts,
  PausePresentation,
  CollectionsBookmark,
  ImageRounded
} from '@mui/icons-material';
import {
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { toast } from 'react-toastify';
import { stat } from 'node:fs';
import { totalmem } from 'node:os';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement;
  color: string;
  trend?: string;
}

const StatCard = ({ title, value, icon, color, trend }: StatCardProps) => (
  <Card
    sx={{
      height: '100%',
      minWidth: '200px',
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
          <Typography variant="h4" fontWeight={600} sx={{ mb: 1, color: 'text.primary', fontSize : '20px' }}>
            {value}
          </Typography>
          {trend && (
            <Chip
              label={trend}
              size="small"
              icon={<TrendingUp sx={{ fontSize: 14 }} />}
              sx={{
                backgroundColor: '#E8F5E9',
                color: '#2E7D32',
                fontSize: '0.75rem',
                height: 24,
                fontWeight: 600,
              }}
            />
          )}
        </Box>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2,
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

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalReads: 0,
        totalSubscribers: 0,
        totalSubscriptionAmount: 0,
        totalCharacters: 0,
        totalStoryArcs: 0,
        totalComics: 0,
        totalIssues: 0,
    });

    // Dummy users data: progressive but pulsating increase from 400 -> 850 over 9 months
  const usersTrendData = [
    { name: 'Jan', users: 400 },
    { name: 'Feb', users: 460 },
    { name: 'Mar', users: 430 },
    { name: 'Apr', users: 520 },
    { name: 'May', users: 500 },
    { name: 'Jun', users: 600 },
    { name: 'Jul', users: 670 },
    { name: 'Aug', users: 740 },
    { name: 'Sep', users: 850 },
  ];

  return (
      <Box>
        {/* Welcome Section */}
        <Box mb={4}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Welcome Back, OBJ! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Upload Comic, Manage stories/characters, Track Performance
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Box mb={4} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon={<People />}
            color="#FFA319"
            trend="+15%"
          />
          <StatCard
            title="Total Reads"
            value={stats.totalReads.toLocaleString()}
            icon={<LibraryBooks />}
            color="#00A85A"
            trend="+12.5%"
          />
          <StatCard
            title="Total Subscribers"
            value={stats.totalSubscribers.toLocaleString()}
            icon={<VideoCameraFront />}
            color="#00A85A"
            trend="+12.5%"
          />
          <StatCard
            title="Total Amount"
            value={stats.totalSubscriptionAmount.toLocaleString()}
            icon={<AccountBalanceWallet />}
            color="#00A85A"
            trend="+12.5%"
          />
        </Box>

        {/* Second Row Stats */}
        <Box mb={4} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
          <StatCard
            title="Total Characters"
            value={stats.totalCharacters.toLocaleString()}
            icon={<SportsMartialArts />}
            color="#57CA22"
          />
          <StatCard
            title="Story Arcs"
            value={stats.totalStoryArcs.toLocaleString()}
            icon={<Token />}
            color="#33C2FF"
          />
          <StatCard
            title="Total Comics"
            value={stats.totalComics.toLocaleString()}
            icon={<ImageRounded />}
            color="#33C2FF"
          />
          <StatCard
            title="Total Issues"
            value={stats.totalIssues.toLocaleString()}
            icon={<CollectionsBookmark />}
            color="#FF1943"
          />
        </Box>

        <Typography variant="h6" fontWeight={600} marginBottom={5}>
          User Growth Trend
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={usersTrendData}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFA319" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#FFA319" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#666" style={{ fontSize: '13px' }} />
            <YAxis stroke="#666" style={{ fontSize: '13px' }} />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            />
            {/* Area provides gradient fill; overlay a Line to show active dot on hover */}
            <Area
              type="monotone"
              dataKey="users"
              stroke="#800000"
              strokeWidth={2}
              fill="url(#colorUsers)"
              dot={{ r: 4, fill: '#800000' }}
            />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#800000"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 8 }}
            />
          </AreaChart>
        </ResponsiveContainer>

    </Box>
  );
}