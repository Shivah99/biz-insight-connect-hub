
const mongoose = require('mongoose');

const productServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  imageUrl: {
    type: String,
  },
});

const timeSeriesDataSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
});

const financialStatsSchema = new mongoose.Schema({
  revenue: [timeSeriesDataSchema],
  cagr: {
    type: Number,
    default: 0,
  },
  profitMargin: {
    type: Number,
    default: 0,
  },
  roi: {
    type: Number,
    default: 0,
  },
  customerRetentionRate: {
    type: Number,
    default: 0,
  },
});

const businessSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['Private', 'Corporation', 'Partnership', 'Sole Proprietorship', 'LLC', 'Nonprofit', 'Other'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    website: {
      type: String,
    },
    industry: {
      type: String,
      required: true,
    },
    foundedYear: {
      type: Number,
      required: true,
    },
    logoUrl: {
      type: String,
    },
    productsAndServices: [productServiceSchema],
    financialStats: {
      type: financialStatsSchema,
      default: () => ({}),
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Business = mongoose.model('Business', businessSchema);

module.exports = Business;
