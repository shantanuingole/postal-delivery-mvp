import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  MenuItem
} from '@mui/material';
import RouteIcon from '@mui/icons-material/Route';

const DISTRICTS = [
  'Mumbai', 'Pune', 'Nagpur', 'Wardha', 'Akola', 
  'Aurangabad', 'Nashik', 'Solapur', 'Kolhapur', 
  'Sangli', 'Jalgaon', 'Ahmednagar'
];

const RouteCalculator = ({ onCalculate, loading }) => {
  const [formData, setFormData] = useState({
    sourceDistrict: '',
    destinationDistrict: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.sourceDistrict || !formData.destinationDistrict) {
      setError('Please select both source and destination districts');
      return;
    }

    if (formData.sourceDistrict === formData.destinationDistrict) {
      setError('Source and destination must be different');
      return;
    }

    setError('');
    onCalculate(formData);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        🗺️ Hub-to-Hub Routing
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Calculate optimal delivery route between two districts using Dijkstra's algorithm.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          select
          label="Source District"
          name="sourceDistrict"
          value={formData.sourceDistrict}
          onChange={handleChange}
          sx={{ mb: 2 }}
          disabled={loading}
        >
          {DISTRICTS.map((district) => (
            <MenuItem key={district} value={district}>
              {district}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          select
          label="Destination District"
          name="destinationDistrict"
          value={formData.destinationDistrict}
          onChange={handleChange}
          sx={{ mb: 3 }}
          disabled={loading}
        >
          {DISTRICTS.map((district) => (
            <MenuItem key={district} value={district}>
              {district}
            </MenuItem>
          ))}
        </TextField>

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <RouteIcon />}
        >
          {loading ? 'Calculating...' : 'Calculate Route'}
        </Button>
      </Box>

      <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
        💡 Uses graph algorithms to find shortest delivery path
      </Typography>
    </Paper>
    
  );
};

export default RouteCalculator;
