// Replace or patch the updateStreak method in src/models/User.js with a resilient version.
// Keep the rest of the User model intact. This snippet focuses only on updateStreak.

static async updateStreak(db, userId) {
  let lastLoginDate = null;
  let streak = 0;
  let bestStreak = 0;

  try {
    const res = await db.query(
      'SELECT last_login_date, streak, best_streak FROM user_progress WHERE user_id = $1',
      [userId]
    );
    if (res.rows.length) {
      lastLoginDate = res.rows[0].last_login_date;
      streak = res.rows[0].streak || 0;
      bestStreak = res.rows[0].best_streak || 0;
    }
  } catch (err) {
    if (err && err.code === '42703') {
      // Missing column: fall back to safer query that omits last_login_date
      console.warn(`updateStreak: missing column (falling back) for user ${userId}:`, err.message);
      const res2 = await db.query(
        'SELECT streak, best_streak FROM user_progress WHERE user_id = $1',
        [userId]
      );
      if (res2.rows.length) {
        streak = res2.rows[0].streak || 0;
        bestStreak = res2.rows[0].best_streak || 0;
      }
      // lastLoginDate remains null; logic below must handle null
    } else {
      throw err;
    }
  }

  // Business logic for adjusting streak (ensure it tolerates lastLoginDate === null)
  const now = new Date();
  if (lastLoginDate) {
    const lastDate = new Date(lastLoginDate);
    const lastUTC = Date.UTC(lastDate.getUTCFullYear(), lastDate.getUTCMonth(), lastDate.getUTCDate());
    const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const diffDays = Math.floor((todayUTC - lastUTC) / (24 * 60 * 60 * 1000));
    if (diffDays === 1) {
      streak = (streak || 0) + 1;
      if (streak > bestStreak) bestStreak = streak;
    } else if (diffDays > 1) {
      streak = 1;
    }
  }

  // Save back; attempt to update last_login_date but fall back if column missing
  try {
    await db.query(
      `UPDATE user_progress
       SET streak = $1,
           best_streak = $2,
           last_login_date = CURRENT_TIMESTAMP
       WHERE user_id = $3`,
      [streak, bestStreak, userId]
    );
  } catch (err) {
    if (err && err.code === '42703') {
      await db.query(
        `UPDATE user_progress
         SET streak = $1,
             best_streak = $2
         WHERE user_id = $3`,
        [streak, bestStreak, userId]
      );
    } else {
      throw err;
    }
  }

  return { streak, bestStreak };
}
