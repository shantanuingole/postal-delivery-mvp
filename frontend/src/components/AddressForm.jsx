import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const AddressForm = ({ onValidate, loading }) => {
  const [formData, setFormData] = useState({
    address: '',
    pincode: '',
    district: ''
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
    
    // Validation
    if (!formData.address && !formData.pincode) {
      setError('Please provide either address or PIN code');
      return;
    }

    // Clear error and call parent function
    setError('');
    onValidate(formData);
  };

  const handleClear = () => {
    setFormData({ address: '', pincode: '', district: '' });
    setError('');
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        🔍 Address Validation
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Enter an address or PIN code to validate and correct spelling errors.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Address / Locality"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="e.g., Sawangi, Jawahar Nagar"
          sx={{ mb: 2 }}
          disabled={loading}
        />

        <TextField
          fullWidth
          label="PIN Code (Optional)"
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          placeholder="e.g., 442001"
          sx={{ mb: 2 }}
          inputProps={{ maxLength: 6 }}
          disabled={loading}
        />

        <TextField
          fullWidth
          label="District (Optional)"
          name="district"
          value={formData.district}
          onChange={handleChange}
          placeholder="e.g., Wardha"
          sx={{ mb: 3 }}
          disabled={loading}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
          >
            {loading ? 'Validating...' : 'Validate Address'}
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={handleClear}
            disabled={loading}
            sx={{ minWidth: '120px' }}
          >
            Clear
          </Button>
        </Box>
      </Box>

      <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
        💡 Tip: The system uses fuzzy matching to correct spelling mistakes!
      </Typography>
    </Paper>
  );
};

export default AddressForm;
