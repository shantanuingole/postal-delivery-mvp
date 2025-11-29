const express = require('express');
const router = express.Router();

// Sample hub network for Maharashtra
// In real system, this would be in database
const HUB_NETWORK = {
  'Mumbai GPO': {
    connections: {
      'Pune GPO': 150,
      'Nashik Road': 165
    },
    district: 'Mumbai'
  },
  'Pune GPO': {
    connections: {
      'Mumbai GPO': 150,
      'Solapur HO': 250,
      'Aurangabad GPO': 230,
      
      'Kolhapur HO': 230
    },
    district: 'Pune'
  },
  'Nagpur GPO': {
    connections: {
      'Wardha HO': 75,
      'Akola HO': 250,
      'Aurangabad GPO': 450
    },
    district: 'Nagpur'
  },
  'Wardha HO': {
    connections: {
      'Nagpur GPO': 75
    },
    district: 'Wardha'
  },
  'Akola HO': {
    connections: {
      'Nagpur GPO': 250,
      'Aurangabad GPO': 350
    },
    district: 'Akola'
  },
  'Aurangabad GPO': {
    connections: {
      'Pune GPO': 230,
      'Nashik Road': 200,
      'Akola HO': 350,
      'Nagpur GPO': 450
    },
    district: 'Aurangabad'
  },
  'Nashik Road': {
    connections: {
      'Mumbai GPO': 165,
      'Aurangabad GPO': 200,
      'Jalgaon HO': 210
    },
    district: 'Nashik'
  },
  'Solapur HO': {
    connections: {
      'Pune GPO': 250,
      'Kolhapur HO': 230
    },
    district: 'Solapur'
  },
  'Kolhapur HO': {
    connections: {
      'Pune GPO': 230,
      'Solapur HO': 230,
      'Sangli HO': 50
    },
    district: 'Kolhapur'
  },
  'Sangli HO': {
    connections: {
      'Kolhapur HO': 50
    },
    district: 'Sangli'
  },
  'Jalgaon HO': {
    connections: {
      'Nashik Road': 210,
      'Aurangabad GPO': 200
    },
    district: 'Jalgaon'
  },
  'Ahmednagar HO': {
    connections: {
      'Pune GPO': 120,
      'Aurangabad GPO': 120
    },
    district: 'Ahmednagar'
  }
};

// District to Hub mapping
const DISTRICT_TO_HUB = {
  'Mumbai': 'Mumbai GPO',
  'Pune': 'Pune GPO',
  'Nagpur': 'Nagpur GPO',
  'Wardha': 'Wardha HO',
  'Akola': 'Akola HO',
  'Aurangabad': 'Aurangabad GPO',
  'Nashik': 'Nashik Road',
  'Solapur': 'Solapur HO',
  'Kolhapur': 'Kolhapur HO',
  'Sangli': 'Sangli HO',
  'Jalgaon': 'Jalgaon HO',
  'Ahmednagar': 'Ahmednagar HO'
};

/**
 * Dijkstra's shortest path algorithm
 */
function dijkstraShortestPath(source, target) {
  const distances = {};
  const previous = {};
  const unvisited = new Set(Object.keys(HUB_NETWORK));

  // Initialize distances
  Object.keys(HUB_NETWORK).forEach(hub => {
    distances[hub] = Infinity;
    previous[hub] = null;
  });
  distances[source] = 0;

  while (unvisited.size > 0) {
    // Find node with minimum distance
    let current = null;
    let minDistance = Infinity;
    
    unvisited.forEach(hub => {
      if (distances[hub] < minDistance) {
        minDistance = distances[hub];
        current = hub;
      }
    });

    if (current === null || current === target) break;
    
    unvisited.delete(current);

    // Update distances to neighbors
    const neighbors = HUB_NETWORK[current].connections;
    for (let neighbor in neighbors) {
      if (unvisited.has(neighbor)) {
        const altDistance = distances[current] + neighbors[neighbor];
        
        if (altDistance < distances[neighbor]) {
          distances[neighbor] = altDistance;
          previous[neighbor] = current;
        }
      }
    }
  }

  // Reconstruct path
  const path = [];
  let curr = target;
  
  while (curr !== null) {
    path.unshift(curr);
    curr = previous[curr];
  }

  return {
    path,
    distance: distances[target],
    found: distances[target] !== Infinity
  };
}

/**
 * POST /api/routing/calculate
 * Calculate optimal hub-to-hub route
 */
router.post('/calculate', async (req, res) => {
  try {
    const { sourceDistrict, destinationDistrict, sourcePincode, destinationPincode } = req.body;

    console.log('Routing request:', { sourceDistrict, destinationDistrict, sourcePincode, destinationPincode });

    // Determine source and destination hubs
    let sourceHub, destHub;

    if (sourceDistrict && DISTRICT_TO_HUB[sourceDistrict]) {
      sourceHub = DISTRICT_TO_HUB[sourceDistrict];
    }

    if (destinationDistrict && DISTRICT_TO_HUB[destinationDistrict]) {
      destHub = DISTRICT_TO_HUB[destinationDistrict];
    }

    if (!sourceHub || !destHub) {
      return res.status(400).json({
        success: false,
        message: 'Could not determine hubs for given districts. Available districts: ' + Object.keys(DISTRICT_TO_HUB).join(', ')
      });
    }

    if (sourceHub === destHub) {
      return res.json({
        success: true,
        route: {
          source: { hub: sourceHub, district: sourceDistrict },
          destination: { hub: destHub, district: destinationDistrict },
          path: [sourceHub],
          distance: 0,
          estimatedTime: 0,
          message: 'Source and destination are in the same hub!'
        }
      });
    }

    // Calculate shortest path
    const result = dijkstraShortestPath(sourceHub, destHub);

    if (!result.found) {
      return res.json({
        success: false,
        message: 'No route found between these hubs'
      });
    }

    // Build detailed path with distances
    const detailedPath = result.path.map((hub, index) => {
      const step = {
        stepNumber: index + 1,
        hubName: hub,
        district: HUB_NETWORK[hub].district
      };

      if (index > 0) {
        const prevHub = result.path[index - 1];
        step.distanceFromPrevious = HUB_NETWORK[prevHub].connections[hub];
      }

      return step;
    });

    res.json({
      success: true,
      route: {
        source: { hub: sourceHub, district: sourceDistrict },
        destination: { hub: destHub, district: destinationDistrict },
        path: detailedPath,
        totalDistance: result.distance,
        estimatedTime: Math.round((result.distance / 40) * 60), // 40 km/hr average speed
        numberOfHops: result.path.length - 1
      }
    });

  } catch (error) {
    console.error('Routing error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during route calculation',
      error: error.message
    });
  }
});

/**
 * GET /api/routing/hubs
 * Get list of all available hubs
 */
router.get('/hubs', (req, res) => {
  const hubs = Object.keys(HUB_NETWORK).map(hub => ({
    name: hub,
    district: HUB_NETWORK[hub].district,
    connections: Object.keys(HUB_NETWORK[hub].connections).length
  }));

  res.json({
    success: true,
    count: hubs.length,
    hubs: hubs
  });
});

module.exports = router;
