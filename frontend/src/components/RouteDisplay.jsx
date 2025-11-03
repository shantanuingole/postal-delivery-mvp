import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Chip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TimerIcon from '@mui/icons-material/Timer';
import RouteIcon from '@mui/icons-material/Route';

const RouteDisplay = ({ route }) => {
  if (!route) return null;

  const { source, destination, path, totalDistance, estimatedTime, numberOfHops } = route;

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 700, mx: 'auto', mt: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <LocalShippingIcon color="primary" sx={{ mr: 1, fontSize: 32 }} />
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Optimal Delivery Route
        </Typography>
      </Box>

      {/* Route Summary */}
      <Card variant="outlined" sx={{ mb: 3, bgcolor: 'rgba(25, 118, 210, 0.05)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              icon={<RouteIcon />}
              label={`Distance: ${totalDistance} km`}
              color="primary"
            />
            <Chip
              icon={<TimerIcon />}
              label={`Est. Time: ${Math.floor(estimatedTime / 60)}h ${estimatedTime % 60}m`}
              color="secondary"
            />
            <Chip
              label={`${numberOfHops} ${numberOfHops === 1 ? 'Hub' : 'Hubs'}`}
              variant="outlined"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Route Path */}
      <Stepper orientation="vertical" activeStep={path.length}>
        {path.map((step, index) => (
          <Step key={index} active={true} completed={index < path.length - 1}>
            <StepLabel
              StepIconProps={{
                sx: { fontSize: 32 }
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {index === 0 ? '🏁 Start' : index === path.length - 1 ? '🎯 Destination' : `Hub ${index}`}
                </Typography>
                <Typography variant="body1" color="text.primary">
                  {step.hubName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {step.district} District
                </Typography>
              </Box>
            </StepLabel>
            <StepContent>
              {step.distanceFromPrevious && (
                <Alert 
                  severity="info" 
                  icon={<RouteIcon />}
                  sx={{ mt: 1 }}
                >
                  {step.distanceFromPrevious} km from previous hub
                </Alert>
              )}
            </StepContent>
          </Step>
        ))}
      </Stepper>

      {/* Algorithm Info */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary">
          <strong>Algorithm:</strong> Dijkstra's Shortest Path • 
          <strong> Optimization:</strong> Minimizes total distance • 
          <strong> Avg Speed:</strong> 40 km/h
        </Typography>
      </Box>
    </Paper>
  );
};

export default RouteDisplay;
