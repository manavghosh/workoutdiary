module.exports = [
"[project]/src/db/schema.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "exerciseCategoryEnum",
    ()=>exerciseCategoryEnum,
    "exerciseSets",
    ()=>exerciseSets,
    "exercises",
    ()=>exercises,
    "workoutExercises",
    ()=>workoutExercises,
    "workouts",
    ()=>workouts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/node_modules/drizzle-orm/pg-core/table.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/node_modules/drizzle-orm/pg-core/columns/text.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/node_modules/drizzle-orm/pg-core/columns/integer.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$numeric$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/node_modules/drizzle-orm/pg-core/columns/numeric.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/node_modules/drizzle-orm/pg-core/columns/timestamp.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$enum$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/node_modules/drizzle-orm/pg-core/columns/enum.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/node_modules/drizzle-orm/pg-core/columns/uuid.js [app-rsc] (ecmascript)");
;
const exerciseCategoryEnum = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$enum$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["pgEnum"])('exercise_category', [
    'strength',
    'cardio',
    'flexibility',
    'sports'
]);
const exercises = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["pgTable"])('exercises', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["uuid"])('id').primaryKey().notNull().defaultRandom(),
    name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])('name').notNull(),
    category: exerciseCategoryEnum('category').notNull(),
    description: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])('description'),
    createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])('created_by'),
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["timestamp"])('created_at', {
        withTimezone: true,
        mode: 'date'
    }).defaultNow().notNull()
});
const workouts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["pgTable"])('workouts', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["uuid"])('id').primaryKey().notNull().defaultRandom(),
    userId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])('user_id').notNull(),
    title: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])('title').notNull(),
    notes: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])('notes'),
    durationMinutes: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["integer"])('duration_minutes'),
    startedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["timestamp"])('started_at', {
        withTimezone: true,
        mode: 'date'
    }).defaultNow().notNull(),
    completedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["timestamp"])('completed_at', {
        withTimezone: true,
        mode: 'date'
    })
});
const workoutExercises = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["pgTable"])('workout_exercises', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["uuid"])('id').primaryKey().notNull().defaultRandom(),
    workoutId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["uuid"])('workout_id').notNull().references(()=>workouts.id, {
        onDelete: 'cascade'
    }),
    exerciseId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["uuid"])('exercise_id').notNull().references(()=>exercises.id),
    order: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["integer"])('order').notNull(),
    restSeconds: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["integer"])('rest_seconds')
});
const exerciseSets = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["pgTable"])('exercise_sets', {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["uuid"])('id').primaryKey().notNull().defaultRandom(),
    workoutExerciseId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["uuid"])('workout_exercise_id').notNull().references(()=>workoutExercises.id, {
        onDelete: 'cascade'
    }),
    setNumber: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["integer"])('set_number').notNull(),
    // Strength exercise fields
    weightLbs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$numeric$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["decimal"])('weight_lbs', {
        precision: 8,
        scale: 2
    }),
    reps: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["integer"])('reps'),
    // Cardio exercise fields
    durationSeconds: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$integer$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["integer"])('duration_seconds'),
    distanceMiles: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$numeric$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["decimal"])('distance_miles', {
        precision: 8,
        scale: 2
    }),
    notes: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])('notes')
});
}),
"[project]/src/lib/db.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "db",
    ()=>db
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$neon$2d$http$2f$driver$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/node_modules/drizzle-orm/neon-http/driver.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/node_modules/@neondatabase/serverless/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/schema.ts [app-rsc] (ecmascript)");
;
;
;
const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$neon$2d$http$2f$driver$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["drizzle"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["neon"])(process.env.DATABASE_URL), {
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
});
;
}),
"[project]/src/data/workouts.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "completeWorkout",
    ()=>completeWorkout,
    "createWorkout",
    ()=>createWorkout,
    "deleteWorkout",
    ()=>deleteWorkout,
    "getUserWorkoutsByDate",
    ()=>getUserWorkoutsByDate,
    "getWorkoutById",
    ()=>getWorkoutById,
    "getWorkoutWithExercises",
    ()=>getWorkoutWithExercises,
    "updateWorkout",
    ()=>updateWorkout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/db/schema.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/node_modules/drizzle-orm/sql/expressions/conditions.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/node_modules/drizzle-orm/sql/sql.js [app-rsc] (ecmascript)");
;
;
;
async function createWorkout(data) {
    const [workout] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].insert(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["workouts"]).values({
        userId: data.userId,
        title: data.title,
        notes: data.notes,
        durationMinutes: data.durationMinutes,
        startedAt: data.startedAt
    }).returning();
    return workout;
}
async function getUserWorkoutsByDate(userId, startDate, endDate) {
    // Build conditions array for user ID filter and date conditions
    const conditions = [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["workouts"].userId, userId)
    ];
    // If only startDate is provided (no endDate), set date range for that specific day
    if (startDate && !endDate) {
        const startOfDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0);
        const endOfDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 23, 59, 59, 999);
        conditions.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["gte"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["workouts"].startedAt, startOfDay), (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["lte"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["workouts"].startedAt, endOfDay));
    } else {
        // Add date range conditions if provided separately
        if (startDate) {
            conditions.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["gte"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["workouts"].startedAt, startDate));
        }
        if (endDate) {
            conditions.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["lte"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["workouts"].startedAt, endDate));
        }
    }
    // Return only essential workout information (no exercise/sets joins for performance)
    const workoutResults = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].select({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["workouts"].id,
        userId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["workouts"].userId,
        title: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["workouts"].title,
        notes: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["workouts"].notes,
        durationMinutes: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["workouts"].durationMinutes,
        startedAt: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["workouts"].startedAt,
        completedAt: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["workouts"].completedAt,
        exerciseCount: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`(
        SELECT count(*)
        FROM workout_exercises
        WHERE workout_exercises.workout_id = workouts.id
      )`.mapWith(Number).as('exerciseCount')
    }).from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["workouts"]).where(conditions.length > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["and"])(...conditions) : undefined).orderBy(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["workouts"].startedAt);
    // Convert UTC timestamps to local timezone for display
    return workoutResults.map((workout)=>({
            ...workout,
            startedAt: new Date(workout.startedAt),
            completedAt: workout.completedAt ? new Date(workout.completedAt) : null
        }));
}
async function getWorkoutById(workoutId, userId) {
    const [workout] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].select().from(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["workouts"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["workouts"].id, workoutId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["workouts"].userId, userId)));
    if (!workout) {
        return null;
    }
    // Convert timestamps to local timezone
    return {
        ...workout,
        startedAt: new Date(workout.startedAt),
        completedAt: workout.completedAt ? new Date(workout.completedAt) : null
    };
}
async function getWorkoutWithExercises(workoutId, userId) {
    const workout = await getWorkoutById(workoutId, userId);
    if (!workout) {
        return null;
    }
    // For now, return just the workout without exercises/sets to avoid SQL complexity
    // This can be expanded later when the exercise/sets functionality is needed
    return {
        workout,
        exercises: []
    };
}
async function updateWorkout(workoutId, userId, data) {
    // First verify user ownership
    const existingWorkout = await getWorkoutById(workoutId, userId);
    if (!existingWorkout) {
        return null;
    }
    // Update the workout
    const [updatedWorkout] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].update(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["workouts"]).set(data).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["workouts"].id, workoutId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["workouts"].userId, userId))).returning();
    if (!updatedWorkout) {
        return null;
    }
    // Convert timestamps to local timezone
    return {
        ...updatedWorkout,
        startedAt: new Date(updatedWorkout.startedAt),
        completedAt: updatedWorkout.completedAt ? new Date(updatedWorkout.completedAt) : null
    };
}
async function deleteWorkout(workoutId, userId) {
    // First verify user ownership
    const existingWorkout = await getWorkoutById(workoutId, userId);
    if (!existingWorkout) {
        return false;
    }
    // Delete the workout (cascade will delete related exercises and sets)
    const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["db"].delete(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["workouts"]).where((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["and"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["workouts"].id, workoutId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$expressions$2f$conditions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["eq"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$db$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["workouts"].userId, userId)));
    return result.rowCount > 0;
}
async function completeWorkout(workoutId, userId, durationMinutes) {
    return updateWorkout(workoutId, userId, {
        completedAt: new Date(),
        durationMinutes: durationMinutes
    });
}
}),
"[project]/src/app/workout/new/action.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40852a6e7f7ba660ab4874fb15c4d383ee779b415b":"createWorkoutAction"},"",""] */ __turbopack_context__.s([
    "createWorkoutAction",
    ()=>createWorkoutAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/src/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$workouts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/workouts.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/node_modules/@clerk/nextjs/dist/esm/app-router/server/auth.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/node_modules/date-fns/format.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
// Simple validation schema
const CreateWorkoutSchema = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    title: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Title is required').max(100),
    notes: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    startTime: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    workoutDate: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Date is required')
});
async function createWorkoutAction(data) {
    console.log('Action called with data:', data);
    try {
        // Validate input data
        const validatedData = CreateWorkoutSchema.parse(data);
        console.log('Validation passed:', validatedData);
        // Get authenticated user
        const { userId } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auth"])();
        console.log('User ID:', userId);
        if (!userId) {
            throw new Error('User not authenticated');
        }
        // Parse workout date and create proper datetime with timezone preservation
        // The workoutDate should be in YYYY-MM-DD format from the date picker
        let startedAt;
        if (validatedData.startTime) {
            // Combine date and time properly to preserve local timezone
            const [hours, minutes] = validatedData.startTime.split(':');
            const [year, month, day] = validatedData.workoutDate.split('-').map(Number);
            // Create date using local timezone (not UTC)
            // This ensures the date/time is interpreted in the user's local timezone
            startedAt = new Date(year, month - 1, day, parseInt(hours), parseInt(minutes), 0, 0);
            console.log('Local timezone components:', {
                year,
                month,
                day,
                hours,
                minutes
            });
            console.log('Created local datetime:', startedAt);
            console.log('Local datetime ISO:', startedAt.toISOString());
        } else {
            // If no time provided, use the date at noon in local timezone
            const [year, month, day] = validatedData.workoutDate.split('-').map(Number);
            startedAt = new Date(year, month - 1, day, 12, 0, 0, 0);
            console.log('Local date with default time:', startedAt);
            console.log('Local datetime ISO:', startedAt.toISOString());
        }
        console.log('Final datetime for DB (preserves local timezone):', startedAt.toISOString());
        // Call data helper function
        const workout = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$workouts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createWorkout"])({
            userId,
            title: validatedData.title,
            notes: validatedData.notes,
            startedAt
        });
        console.log('Workout created:', workout);
        console.log('Workout startedAt date:', workout.startedAt);
        // Format date for redirect
        const redirectDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$date$2d$fns$2f$format$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(workout.startedAt, 'yyyy-MM-dd');
        console.log('Formatted redirect date:', redirectDate);
        // Return success response with date for redirect
        return {
            success: true,
            workout,
            redirectDate
        };
    } catch (error) {
        console.error('Error in createWorkoutAction:', error);
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodError) {
            console.error('Zod errors:', error.issues);
            throw new Error(error.issues[0]?.message || 'Validation error');
        }
        // Handle other errors
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error message:', errorMessage);
        throw new Error(`Failed to create workout: ${errorMessage}`);
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createWorkoutAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createWorkoutAction, "40852a6e7f7ba660ab4874fb15c4d383ee779b415b", null);
}),
];

//# sourceMappingURL=src_e8933510._.js.map