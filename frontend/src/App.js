import React, { useState } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Tabs,
  Tab,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';
import AddressForm from './components/AddressForm';
import AddressResult from './components/AddressResult';
import RouteCalculator from './components/RouteCalculator';
import RouteDisplay from './components/RouteDisplay';
import { validateAddress, calculateRoute } from './services/api';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    success: { main: '#4caf50' },
  },
});

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [addressResult, setAddressResult] = useState(null);
  const [routeResult, setRouteResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleValidate = async (formData) => {
    setLoading(true);
    try {
      const response = await validateAddress(formData);
      setAddressResult(response);
    } catch (err) {
      setAddressResult({
        success: false,
        message: err.message || 'Failed to connect to server'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateRoute = async (formData) => {
    setLoading(true);
    setRouteResult(null);
    try {
      const response = await calculateRoute(formData);
      if (response.success) {
        setRouteResult(response.route);
      } else {
        setRouteResult({ error: response.message });
      }
    } catch (err) {
      setRouteResult({ 
        error: err.message || 'Failed to calculate route' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static" elevation={2}>
          <Toolbar>
            <LocalPostOfficeIcon sx={{ mr: 2, fontSize: 32 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                AI-Powered Postal Delivery System
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Maharashtra Address Validation & Hub Routing
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs 
              value={tabValue} 
              onChange={(e, v) => {
                setTabValue(v);
                setAddressResult(null);
                setRouteResult(null);
              }}
              centered
            >
              <Tab label="📍 Address Validation" />
              <Tab label="🗺️ Hub Routing" />
            </Tabs>
          </Box>

          {tabValue === 0 && (
            <>
              <AddressForm onValidate={handleValidate} loading={loading} />
              <AddressResult result={addressResult} />
            </>
          )}

          {tabValue === 1 && (
            <>
              <RouteCalculator onCalculate={handleCalculateRoute} loading={loading} />
              {routeResult && !routeResult.error && <RouteDisplay route={routeResult} />}
              {routeResult && routeResult.error && (
                <Box sx={{ maxWidth: 600, mx: 'auto', mt: 3 }}>
                  <Typography color="error">{routeResult.error}</Typography>
                </Box>
              )}
            </>
          )}

          <Box sx={{ textAlign: 'center', mt: 6, mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Built with React + Node.js + MongoDB | Dijkstra's Algorithm | Final Year Project
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
