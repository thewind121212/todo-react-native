import { type SQLiteDatabase } from "expo-sqlite";

export async function checkIfTableExist(db: SQLiteDatabase, table: string) {

    const istableExist = await db.getAllAsync(`SELECT name FROM sqlite_master WHERE type='table' AND name='${table}'`);
    if (istableExist.length > 0) {
        return true;
    }

    return false
}


export async function checkCountTable(db: SQLiteDatabase, table: string) {

    const count = await db.getAllAsync<{ count: number }>(`SELECT COUNT(*) as count FROM ${table}`);
    if (count.length > 0) {
        return count[0]?.count!;
    }

    return 0
}



export async function migrateDbIfNeeded(db: SQLiteDatabase) {






    //first migration

    //create main_tasks table 
    if (!await checkIfTableExist(db, 'main_tasks')) {
        await db.execAsync(`
PRAGMA journal_mode = 'wal';
CREATE TABLE main_tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  color TEXT NOT NULL,
  type TEXT CHECK (type IN ('habit', 'task')) NOT NULL,
  create_date DATETIME DEFAULT (DATETIME('now', 'localtime')),
  update_date DATETIME DEFAULT (DATETIME('now', 'localtime')),
  due_day DATE,
  CHECK (
    (type = 'task' AND due_day IS NOT NULL)
    OR
    (type = 'habit' AND due_day IS NULL)
  )
);
`);

if (await checkCountTable(db, 'main_tasks') === 0) {
            await db.execAsync(`INSERT INTO main_tasks (title, color, type, due_day) VALUES
      ('Morning Meditation', '#4CAF50', 'habit', NULL),
      ('Evening Journaling', '#FF748B', 'habit', NULL),
      ('Daily Workout', '#FFA500', 'habit', NULL),
      ('Gratitude Practice', '#6A5ACD', 'habit', NULL),
      ('Reading Habit', '#1E90FF', 'habit', NULL),
      ('Submit Project Proposal', '#FF5733', 'task', '2025-01-15'),
      ('Prepare Budget Plan', '#FFD700', 'task', '2025-01-20'),
      ('Team Meeting', '#00BFFF', 'task', '2025-01-10'),
      ('Design Review', '#FF8C00', 'task', '2025-01-18'),
      ('Write Blog Post', '#7CFC00', 'task', '2025-01-22');`)
        }
    }



    if (!await checkIfTableExist(db, 'tasks')) {
        await db.execAsync(`
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  completed INTEGER DEFAULT 0, 
  priority INTEGER NOT NULL DEFAULT 0 CHECK (priority IN (0, 1, 2)), 
  main_task_id INTEGER NOT NULL,
  create_date DATETIME DEFAULT (DATETIME('now', 'localtime')),
  update_date DATETIME DEFAULT (DATETIME('now', 'localtime')),
  FOREIGN KEY (main_task_id) REFERENCES main_tasks (id) ON DELETE CASCADE
);
`);


    }

    if (await checkCountTable(db, 'tasks') === 0) {

        await db.execAsync(`
        INSERT INTO tasks (title, completed, priority, main_task_id) VALUES
        ('Meditate for 10 minutes', 0, 1, 1),
        ('Focus on breathing techniques', 0, 0, 1),
        ('Try mindfulness exercise', 0, 2, 1),
        ('Visualize the day ahead', 0, 1, 1),
        ('Write about the day\'\'s highlights', 0, 1, 2), -- Escaped apostrophe here
        ('List three things I am grateful for', 0, 0, 2),
        ('Reflect on one challenge faced', 0, 2, 2),
        ('Plan the next day', 0, 1, 2),
        ('Do 20 push-ups', 0, 1, 3),
        ('Run for 15 minutes', 0, 2, 3),
        ('Stretch after workout', 0, 0, 3),
        ('Try a new workout routine', 0, 1, 3),
        ('List 5 things I am thankful for', 0, 1, 4),
        ('Call someone to express gratitude', 0, 2, 4),
        ('Write a thank-you note', 0, 0, 4),
        ('Spend time appreciating nature', 0, 1, 4),
        ('Read a new book chapter', 0, 1, 5),
        ('Summarize key takeaways', 0, 2, 5),
        ('Spend 30 minutes reading', 0, 0, 5),
        ('Explore a new genre', 0, 1, 5),
        ('Gather project requirements', 0, 1, 6),
        ('Prepare project outline', 0, 2, 6),
        ('Draft initial proposal', 0, 0, 6),
        ('Review proposal with team', 0, 1, 6),
        ('List all project expenses', 0, 1, 7),
        ('Calculate estimated costs', 0, 2, 7),
        ('Prepare initial budget', 0, 0, 7),
        ('Review budget with manager', 0, 1, 7),
        ('Prepare meeting agenda', 0, 1, 8),
        ('Send meeting invites', 0, 0, 8),
        ('Take meeting minutes', 0, 2, 8),
        ('Share meeting summary', 0, 1, 8),
        ('Review wireframes', 0, 1, 9),
        ('Provide design feedback', 0, 2, 9),
        ('Finalize design updates', 0, 0, 9),
        ('Present final designs', 0, 1, 9),
        ('Research blog topic', 0, 1, 10),
        ('Draft blog content', 0, 2, 10),
        ('Edit blog for clarity', 0, 0, 10),
        ('Publish blog post', 0, 1, 10);

            `)
    }




}