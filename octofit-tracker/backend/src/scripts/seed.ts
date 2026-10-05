import mongoose from 'mongoose';
import { Activity, Leaderboard, Team, User, Workout } from '../models/index.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');
    console.log('Seed the octofit_db database with test data');

    const userSamples = [
      { username: 'alex.morgan', email: 'alex.morgan@example.com', displayName: 'Alex Morgan' },
      { username: 'jamie.chen', email: 'jamie.chen@example.com', displayName: 'Jamie Chen' },
      { username: 'sam.rivera', email: 'sam.rivera@example.com', displayName: 'Sam Rivera' },
      { username: 'taylor.kim', email: 'taylor.kim@example.com', displayName: 'Taylor Kim' },
      { username: 'casey.patel', email: 'casey.patel@example.com', displayName: 'Casey Patel' },
    ];
    const userIds = new Map<string, mongoose.Types.ObjectId>();

    for (const userSample of userSamples) {
      const user = await User.findOneAndUpdate(
        { username: userSample.username },
        { $set: userSample },
        { new: true, upsert: true, runValidators: true },
      );

      if (!user) throw new Error(`Failed to seed user ${userSample.username}`);
      userIds.set(user.username, user._id);
    }

    const teamSamples = [
      { name: 'Trail Blazers', usernames: ['alex.morgan', 'jamie.chen'] },
      { name: 'Sunrise Sprinters', usernames: ['sam.rivera', 'taylor.kim'] },
      { name: 'Peak Performers', usernames: ['casey.patel', 'alex.morgan'] },
    ];

    for (const teamSample of teamSamples) {
      const members = teamSample.usernames.map((username) => {
        const userId = userIds.get(username);
        if (!userId) throw new Error(`Missing seeded user ${username}`);
        return userId;
      });

      await Team.findOneAndUpdate(
        { name: teamSample.name },
        { $set: { name: teamSample.name, members } },
        { new: true, upsert: true, runValidators: true },
      );
    }

    const activitySamples = [
      { username: 'alex.morgan', activityType: 'running', durationMinutes: 35, date: new Date('2026-10-01T07:00:00Z') },
      { username: 'jamie.chen', activityType: 'cycling', durationMinutes: 50, date: new Date('2026-10-01T08:00:00Z') },
      { username: 'sam.rivera', activityType: 'swimming', durationMinutes: 40, date: new Date('2026-10-02T07:30:00Z') },
      { username: 'taylor.kim', activityType: 'strength training', durationMinutes: 45, date: new Date('2026-10-02T17:00:00Z') },
      { username: 'casey.patel', activityType: 'hiking', durationMinutes: 90, date: new Date('2026-10-03T09:00:00Z') },
      { username: 'alex.morgan', activityType: 'yoga', durationMinutes: 30, date: new Date('2026-10-04T08:00:00Z') },
    ];

    for (const activitySample of activitySamples) {
      const userId = userIds.get(activitySample.username);
      if (!userId) throw new Error(`Missing seeded user ${activitySample.username}`);

      await Activity.updateOne(
        { user: userId, activityType: activitySample.activityType, date: activitySample.date },
        { $set: { ...activitySample, user: userId } },
        { upsert: true, runValidators: true },
      );
    }

    const leaderboardSamples = [
      { username: 'alex.morgan', teamName: 'Trail Blazers', score: 1280 },
      { username: 'jamie.chen', teamName: 'Trail Blazers', score: 1145 },
      { username: 'sam.rivera', teamName: 'Sunrise Sprinters', score: 1090 },
      { username: 'taylor.kim', teamName: 'Sunrise Sprinters', score: 980 },
      { username: 'casey.patel', teamName: 'Peak Performers', score: 930 },
    ];

    for (const leaderboardSample of leaderboardSamples) {
      const userId = userIds.get(leaderboardSample.username);
      if (!userId) throw new Error(`Missing seeded user ${leaderboardSample.username}`);

      const team = await Team.findOne({ name: leaderboardSample.teamName }).select('_id');
      if (!team) throw new Error(`Missing seeded team ${leaderboardSample.teamName}`);

      await Leaderboard.findOneAndUpdate(
        { user: userId },
        { $set: { user: userId, team: team._id, score: leaderboardSample.score } },
        { new: true, upsert: true, runValidators: true },
      );
    }

    const workoutSamples = [
      {
        name: 'Easy Run',
        description: 'A steady aerobic run for building endurance.',
        exercises: ['5-minute warm-up walk', '25-minute easy run', '5-minute cool-down'],
        difficulty: 'beginner',
      },
      {
        name: 'Bodyweight Strength',
        description: 'A balanced full-body strength session.',
        exercises: ['Squats: 3 x 12', 'Push-ups: 3 x 10', 'Reverse lunges: 3 x 10 each side', 'Plank: 3 x 30 seconds'],
        difficulty: 'intermediate',
      },
      {
        name: 'Cycling Intervals',
        description: 'Short efforts to improve cycling power.',
        exercises: ['10-minute easy ride', '6 x 2-minute hard effort with 2-minute recovery', '10-minute cool-down'],
        difficulty: 'advanced',
      },
      {
        name: 'Mobility Reset',
        description: 'A gentle recovery session focused on mobility.',
        exercises: ['Cat-cow: 10 reps', "World's greatest stretch: 5 each side", 'Hip bridges: 3 x 12', "Child's pose: 60 seconds"],
        difficulty: 'beginner',
      },
    ];

    for (const workoutSample of workoutSamples) {
      await Workout.findOneAndUpdate(
        { name: workoutSample.name },
        { $set: workoutSample },
        { new: true, upsert: true, runValidators: true },
      );
    }

    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
