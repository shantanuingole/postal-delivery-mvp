const mongoose = require('mongoose');

const pincodeSchema = new mongoose.Schema({
  pincode: {
    type: String,
    required: true,
    index: true
  },
  officeName: {
    type: String,
    required: true
  },
  
  district: {
    type: String,
    required: true,
    index: true

    
  },
  state: {
    type: String,
    default: 'Maharashtra'
  },
  officeType: {
    type: String,
    enum: ['B.O', 'S.O', 'H.O'],
    default: 'S.O'
  }
}, {
  timestamps: true
});

// Text index for search
pincodeSchema.index({ 
  officeName: 'text', 
  district: 'text' 
});

module.exports = mongoose.model('Pincode', pincodeSchema);
