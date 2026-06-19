import mongoose, { Schema, Document, Model, HydratedDocument } from 'mongoose'
import type { Destination } from '@/types'

export type DestinationDoc = HydratedDocument<Destination>;

const MAX_GALLERY_IMAGES = 6 // keep in sync with DestinationForm.tsx + the API routes

const DestinationSchema = new Schema<DestinationDoc>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    region: {
      type: String,
      enum: ['Kashmir', 'Nepal'],
      required: true,
      index: true,
    },
    categories: {
      type: [String],
      enum: ['Luxury', 'Adventure', 'Trekking', 'Nature', 'Camping', 'Honeymoon', 'Snow', 'Family'],
      required: true,
      index: true,
    },
    shortDescription: { type: String, required: true, maxlength: 280 },
    elevation: { type: Number, min: 0 },
    bestSeason: {
      type: [String],
      enum: ['Spring', 'Summer', 'Autumn', 'Winter'],
    },
    thumbnail: { type: String, required: true },   // Cloudinary URL
    heroImage: { type: String, required: true },   // Cloudinary URL
    gallery: {
      type: [String],
      default: [],
      validate: {
        validator: (arr: string[]) => arr.length <= MAX_GALLERY_IMAGES,
        message: `Gallery can have at most ${MAX_GALLERY_IMAGES} images`,
      },
    }, // Cloudinary URLs
    avgPackagePrice: { type: Number, required: true, min: 0 },
    avgStayPrice: { type: Number, required: true, min: 0 },
    avgTransportPrice: { type: Number, required: true, min: 0 },
    avgActivityPrice: { type: Number, required: true, min: 0 },
    popularActivities: { type: [String], default: [] },
    tags: { type: [String], default: [], index: true },
    popularity: { type: Number, default: 50, min: 0, max: 100 },
    featured: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Compound indexes for common query patterns
DestinationSchema.index({ region: 1, featured: -1 })
DestinationSchema.index({ region: 1, categories: 1, popularity: -1 })
DestinationSchema.index({ featured: 1, popularity: -1 })

// Text index for basic search
DestinationSchema.index({
  name: 'text',
  shortDescription: 'text',
  tags: 'text',
  popularActivities: 'text',
})

const DestinationModel: Model<DestinationDoc> =
  mongoose.models.Destination ||
  mongoose.model<DestinationDoc>('Destination', DestinationSchema)

export default DestinationModel