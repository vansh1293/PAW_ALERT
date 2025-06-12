import mongoose ,{Document,Schema  } from 'mongoose';


export interface Rescues extends Document {
    description: string;
    location: {
        type: string;
        coordinates: [number, number];
    };
    imageUrl: string;
    date: Date;
    status: 'open' | 'in-progress' | 'closed';
    userId: mongoose.Types.ObjectId; // Reference to the User
}

const RescuesSchema: Schema<Rescues> = new Schema({
    description: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    imageUrl: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'closed'],
        default: 'open'
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

const RescuesModel = (mongoose.models.Rescues as mongoose.Model<Rescues>) || mongoose.model<Rescues>('Rescues', RescuesSchema);
export default RescuesModel;


