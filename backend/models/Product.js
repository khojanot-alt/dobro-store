import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Mahsulot nomi kiritilishi shart'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Mahsulot narxi kiritilishi shart'],
      min: [0, 'Narx manfiy bo\'la olmaydi'],
    },
    category: {
      type: String,
      enum: ['mouse', 'keyboard', 'headset', 'monitor', 'gamepad', 'other'],
      default: 'other',
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    image: {
      type: String,
      default: '',
    },
    popular: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;