const express = require('express');
const router = express.Router();
const Pincode = require('../models/Pincode');
const { fuzzyMatchLocality } = require('../utils/fuzzyMatch');

// POST /api/address/validate
router.post('/validate', async (req, res) => {
  try {
    const { address, pincode, district } = req.body;

    console.log('Received request:', { address, pincode, district }); // DEBUG

    // Validate input
    if (!address && !pincode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either address or PIN code'
      });
    }

    // CASE 1: PIN CODE PROVIDED
    if (pincode) {
      const pincodeData = await Pincode.findOne({ pincode: pincode });
      
      if (pincodeData) {
        return res.json({
          success: true,
          confidence: 100,
          correctedAddress: {
            officeName: pincodeData.officeName,
            pincode: pincodeData.pincode,
            district: pincodeData.district,
            state: pincodeData.state,
            officeType: pincodeData.officeType
          },
          message: 'PIN code validated successfully'
        });
      } else {
        return res.json({
          success: false,
          message: `Invalid PIN code: ${pincode} not found in database`
        });
      }
    }

    // CASE 2: ADDRESS PROVIDED - Fuzzy matching
    if (address) {
      let query = {};
      
      if (district) {
        query.district = new RegExp(district, 'i');
      }

      const allPincodes = await Pincode.find(query);
      
      console.log(`Found ${allPincodes.length} pincodes for district ${district}`); // DEBUG

      if (allPincodes.length === 0) {
        return res.json({
          success: false,
          message: district 
            ? `No post offices found in district: ${district}`
            : 'No post offices found in database'
        });
      }

      const localities = allPincodes.map(p => p.officeName);
      const matchResult = fuzzyMatchLocality(address, localities, 70);

      console.log('Fuzzy match result:', matchResult); // DEBUG

      if (matchResult.match) {
        const matchedPincode = allPincodes.find(
          p => p.officeName === matchResult.match
        );

        return res.json({
          success: true,
          confidence: matchResult.score,
          correctedAddress: {
            officeName: matchedPincode.officeName,
            pincode: matchedPincode.pincode,
            district: matchedPincode.district,
            state: matchedPincode.state,
            officeType: matchedPincode.officeType
          },
          alternatives: matchResult.alternatives.map(alt => {
            const altRecord = allPincodes.find(p => p.officeName === alt.name);
            return altRecord ? {
              officeName: altRecord.officeName,
              pincode: altRecord.pincode,
              district: altRecord.district,
              confidence: alt.score
            } : null;
          }).filter(a => a !== null),
          message: matchResult.score > 90 
            ? 'High confidence match' 
            : 'Possible match - please verify'
        });
      } else {
        return res.json({
          success: false,
          message: 'Could not match address. Please check spelling.',
          alternatives: []
        });
      }
    }

  } catch (error) {
    console.error('Address validation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during address validation',
      error: error.message
    });
  }
});

// GET /api/address/search/:query
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }

    const results = await Pincode.find({
      $text: { $search: query }
    })
    .limit(10)
    .select('officeName pincode district state officeType');

    return res.json({
      success: true,
      count: results.length,
      results: results
    });

  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during search',
      error: error.message
    });
  }
});

module.exports = router;
