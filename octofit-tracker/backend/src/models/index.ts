import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
  },
  { timestamps: true },
)

const teamSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
)

const activitySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    activityType: { type: String, required: true },
    durationMinutes: { type: Number, min: 1, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

const leaderboardSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    score: { type: Number, min: 0, required: true },
  },
  { timestamps: true },
)

const workoutSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    exercises: { type: [String], default: [] },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  },
  { timestamps: true },
)

export const User = mongoose.models.User ?? mongoose.model('User', userSchema)
export const Team = mongoose.models.Team ?? mongoose.model('Team', teamSchema)
export const Activity = mongoose.models.Activity ?? mongoose.model('Activity', activitySchema)
export const Leaderboard = mongoose.models.Leaderboard ?? mongoose.model('Leaderboard', leaderboardSchema)
export const Workout = mongoose.models.Workout ?? mongoose.model('Workout', workoutSchema)