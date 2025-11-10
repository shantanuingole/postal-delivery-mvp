import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Chip,
  Divider,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const AddressResult = ({ result }) => {
  if (!result) return null;

  const { success, confidence, correctedAddress, alternatives, message } = result;

  // Determine confidence color
  const getConfidenceColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'primary';
    return 'warning';
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {success ? (
          <CheckCircleIcon color="success" sx={{ mr: 1, fontSize: 32 }} />
        ) : (
          <WarningIcon color="warning" sx={{ mr: 1, fontSize: 32 }} />
        )}
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {success ? 'Address Validated ✓' : 'Validation Failed'}
        </Typography>
      </Box>

      {/* Message Alert */}
      <Alert severity={success ? 'success' : 'warning'} sx={{ mb: 3 }}>
        {message}
      </Alert>

      {/* Success Case */}
      {success && correctedAddress && (
        <>
          {/* Confidence Score */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Confidence Score
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ flexGrow: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={confidence}
                  color={getConfidenceColor(confidence)}
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
              <Typography variant="h6" color={getConfidenceColor(confidence) + '.main'}>
                {confidence}%
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Corrected Address Card */}
          <Card variant="outlined" sx={{ mb: 2, bgcolor: 'success.light', bgcolor: 'rgba(76, 175, 80, 0.1)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                <LocationOnIcon color="primary" />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {correctedAddress.officeName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {correctedAddress.district}, {correctedAddress.state}
                  </Typography>
                  {correctedAddress.officeType && (
                    <Chip 
                      label={correctedAddress.officeType} 
                      size="small" 
                      sx={{ mt: 1, mr: 1 }} 
                    />
                  )}
                  <Chip
                    label={`PIN: ${correctedAddress.pincode}`}
                    color="primary"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Alternative Suggestions */}
          {alternatives && alternatives.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Alternative Matches:
              </Typography>
              <List dense>
                {alternatives.map((alt, index) => (
                  <ListItem 
                    key={index}
                    sx={{ 
                      bgcolor: 'background.paper',
                      mb: 1,
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <ListItemText
                      primary={alt.officeName || alt.name}
                      secondary={
                        <Box component="span">
                          {alt.district && `${alt.district} • `}
                          {alt.pincode && `PIN: ${alt.pincode} • `}
                          Confidence: {alt.score || alt.confidence}%
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
                
              </List>
            </>
          )}
        </>
      )}
    </Paper>
  );
};

export default AddressResult;
