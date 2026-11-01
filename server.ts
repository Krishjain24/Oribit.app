import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const HOST = '0.0.0.0';
const isProduction = process.env.NODE_ENV === 'production';

// Initialize SQLite Database stored in orbit.db
const db = new Database(path.join(__dirname, 'orbit.db'));

// Configure tables
db.exec(`
  CREATE TABLE IF NOT EXISTS waitlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    builder_role TEXT NOT NULL DEFAULT 'fullstack',
    company TEXT,
    use_case TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    priority_score INTEGER NOT NULL DEFAULT 5,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    inquiry_type TEXT NOT NULL DEFAULT 'demo',
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    source TEXT DEFAULT 'landing_footer',
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS agent_tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prompt TEXT NOT NULL,
    project_name TEXT NOT NULL,
    branch TEXT NOT NULL DEFAULT 'main',
    status TEXT NOT NULL DEFAULT 'completed',
    steps_json TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed pre-data if empty
const userCount = (db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }).count;
if (userCount === 0) {
  const insertUser = db.prepare('INSERT INTO users (email, full_name, role, is_active, created_at) VALUES (?, ?, ?, ?, ?)');
  insertUser.run('admin@orbit.dev', 'Orbit Administrator', 'admin', 1, '2026-01-15T09:00:00Z');
  insertUser.run('sarah.chen@hyperscale.io', 'Sarah Chen', 'user', 1, '2026-02-01T14:22:00Z');
  insertUser.run('marcus.vance@vortexp.tech', 'Marcus Vance', 'user', 1, '2026-02-18T11:05:00Z');
}

const waitlistCount = (db.prepare('SELECT COUNT(*) as count FROM waitlist').get() as { count: number }).count;
if (waitlistCount === 0) {
  const insertWaitlist = db.prepare(
    'INSERT INTO waitlist (email, full_name, builder_role, company, use_case, status, priority_score, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );
  insertWaitlist.run('elena.rostova@nexuslabs.co', 'Elena Rostova', 'fullstack', 'Nexus Labs', 'Autonomous code agent workflows across polyglot microservices', 'approved', 5, '2026-02-20T10:14:00Z');
  insertWaitlist.run('david.kim@streamline.design', 'David Kim', 'frontend', 'Streamline UI', 'Instant interactive component review alongside LLM builders', 'pending', 5, '2026-02-22T08:30:00Z');
  insertWaitlist.run('amara.okafor@hyperflow.ai', 'Amara Okafor', 'teams', 'HyperFlow Enterprise', 'Autonomous product sprint cycles and multi-agent coordination', 'pending', 10, '2026-02-24T16:45:00Z');
  insertWaitlist.run('jordan.lee@catalyst.build', 'Jordan Lee', 'fullstack', 'Catalyst Cloud', 'Full-stack prototyping with visual verification', 'invited', 5, '2026-02-25T11:10:00Z');
  insertWaitlist.run('sophia.alvarez@orbit.dev', 'Sophia Alvarez', 'teams', 'Voxel Studios', 'Coordinating multi-engineer design system migration with Orbit agents', 'pending', 10, '2026-02-28T14:20:00Z');
}

const inquiriesCount = (db.prepare('SELECT COUNT(*) as count FROM inquiries').get() as { count: number }).count;
if (inquiriesCount === 0) {
  const insertInquiry = db.prepare(
    'INSERT INTO inquiries (name, email, company, inquiry_type, message, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  insertInquiry.run('Rachel Sterling', 'rachel@summitcloud.org', 'Summit Cloud', 'demo', 'We are looking to pilot Orbit across our 45-person engineering team. Would love a 30-min walkthrough of multi-agent capabilities.', 'new', '2026-02-26T09:15:00Z');
  insertInquiry.run('Vikram Patel', 'v.patel@horizon-saas.com', 'Horizon SaaS', 'sales', 'Interested in enterprise tier, self-hosted security compliance and VPC isolation options.', 'in_review', '2026-02-27T13:40:00Z');
  insertInquiry.run('Maya Lin', 'maya@craftcode.design', 'CraftCode Studio', 'partnership', 'Inquiring about integrating Orbit agent workspace into our design-to-code design tokens pipeline.', 'contacted', '2026-02-28T17:00:00Z');
}

const subscriberCount = (db.prepare('SELECT COUNT(*) as count FROM subscribers').get() as { count: number }).count;
if (subscriberCount === 0) {
  const insertSub = db.prepare('INSERT INTO subscribers (email, source, is_active, created_at) VALUES (?, ?, ?, ?)');
  insertSub.run('subscriber@orbit.dev', 'landing_footer', 1, '2026-02-10T12:00:00Z');
  insertSub.run('builder.weekly@techreads.io', 'landing_footer', 1, '2026-02-15T08:30:00Z');
}

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // API ROUTES

  // 1. Waitlist APIs
  app.post('/api/v1/waitlist', (req: Request, res: Response) => {
    try {
      const { email, full_name, builder_role, company, use_case } = req.body;
      if (!email) {
        return res.status(400).json({ detail: 'Email is required.' });
      }

      const cleanEmail = email.toLowerCase().trim();
      const existing = db.prepare('SELECT * FROM waitlist WHERE email = ?').get(cleanEmail) as any;

      if (existing) {
        const queuePos = (db.prepare('SELECT COUNT(*) as pos FROM waitlist WHERE id <= ?').get(existing.id) as any).pos;
        return res.json({ ...existing, queue_position: queuePos });
      }

      const priority = builder_role === 'teams' ? 10 : 5;
      const result = db.prepare(`
        INSERT INTO waitlist (email, full_name, builder_role, company, use_case, status, priority_score, created_at)
        VALUES (?, ?, ?, ?, ?, 'pending', ?, CURRENT_TIMESTAMP)
      `).run(cleanEmail, full_name || null, builder_role || 'fullstack', company || null, use_case || null, priority);

      const newId = result.lastInsertRowid;
      const inserted = db.prepare('SELECT * FROM waitlist WHERE id = ?').get(newId) as any;
      const queuePos = (db.prepare('SELECT COUNT(*) as pos FROM waitlist WHERE id <= ?').get(newId) as any).pos;

      return res.status(201).json({ ...inserted, queue_position: queuePos });
    } catch (err: any) {
      return res.status(500).json({ detail: err.message || 'Failed to register waitlist entry.' });
    }
  });

  app.get('/api/v1/waitlist', (req: Request, res: Response) => {
    const { status } = req.query;
    let items;
    if (status) {
      items = db.prepare('SELECT * FROM waitlist WHERE status = ? ORDER BY id DESC').all(status);
    } else {
      items = db.prepare('SELECT * FROM waitlist ORDER BY id DESC').all();
    }
    return res.json(items);
  });

  app.patch('/api/v1/waitlist/:id/status', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    db.prepare('UPDATE waitlist SET status = ? WHERE id = ?').run(status, id);
    const updated = db.prepare('SELECT * FROM waitlist WHERE id = ?').get(id);
    return res.json(updated);
  });

  app.get('/api/v1/waitlist/export-csv', (_req: Request, res: Response) => {
    const items = db.prepare('SELECT * FROM waitlist ORDER BY id ASC').all() as any[];
    const headers = ['ID', 'Email', 'Name', 'Role', 'Company', 'Use Case', 'Status', 'Registered At'];
    const rows = items.map(item => [
      item.id,
      `"${(item.email || '').replace(/"/g, '""')}"`,
      `"${(item.full_name || '').replace(/"/g, '""')}"`,
      item.builder_role,
      `"${(item.company || '').replace(/"/g, '""')}"`,
      `"${(item.use_case || '').replace(/"/g, '""')}"`,
      item.status,
      item.created_at,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=orbit_waitlist.csv');
    return res.send(csvContent);
  });

  // 2. Inquiries APIs
  app.post('/api/v1/inquiries', (req: Request, res: Response) => {
    try {
      const { name, email, company, inquiry_type, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ detail: 'Name, email, and message are required.' });
      }

      const result = db.prepare(`
        INSERT INTO inquiries (name, email, company, inquiry_type, message, status, created_at)
        VALUES (?, ?, ?, ?, ?, 'new', CURRENT_TIMESTAMP)
      `).run(name.trim(), email.toLowerCase().trim(), company?.trim() || null, inquiry_type || 'demo', message.trim());

      const inserted = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(result.lastInsertRowid);
      return res.status(201).json(inserted);
    } catch (err: any) {
      return res.status(500).json({ detail: err.message || 'Failed to submit inquiry.' });
    }
  });

  app.get('/api/v1/inquiries', (req: Request, res: Response) => {
    const { status } = req.query;
    let items;
    if (status) {
      items = db.prepare('SELECT * FROM inquiries WHERE status = ? ORDER BY id DESC').all(status);
    } else {
      items = db.prepare('SELECT * FROM inquiries ORDER BY id DESC').all();
    }
    return res.json(items);
  });

  app.patch('/api/v1/inquiries/:id/status', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    db.prepare('UPDATE inquiries SET status = ? WHERE id = ?').run(status, id);
    const updated = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(id);
    return res.json(updated);
  });

  // 3. Newsletter APIs
  app.post('/api/v1/newsletter/subscribe', (req: Request, res: Response) => {
    try {
      const { email, source } = req.body;
      if (!email) {
        return res.status(400).json({ detail: 'Email is required.' });
      }

      const cleanEmail = email.toLowerCase().trim();
      const existing = db.prepare('SELECT * FROM subscribers WHERE email = ?').get(cleanEmail) as any;
      if (existing) {
        db.prepare('UPDATE subscribers SET is_active = 1 WHERE id = ?').run(existing.id);
        return res.json({ ...existing, is_active: 1 });
      }

      const result = db.prepare('INSERT INTO subscribers (email, source, is_active, created_at) VALUES (?, ?, 1, CURRENT_TIMESTAMP)').run(cleanEmail, source || 'landing_footer');
      const inserted = db.prepare('SELECT * FROM subscribers WHERE id = ?').get(result.lastInsertRowid);
      return res.status(201).json(inserted);
    } catch (err: any) {
      return res.status(500).json({ detail: err.message || 'Failed to subscribe.' });
    }
  });

  app.get('/api/v1/newsletter', (_req: Request, res: Response) => {
    const items = db.prepare('SELECT * FROM subscribers ORDER BY id DESC').all();
    return res.json(items);
  });

  // 4. Admin Stats & Auth
  app.post('/api/v1/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (
      (email === 'admin@orbit.dev' || email === 'admin') &&
      password === 'OrbitAdminPassword2026!'
    ) {
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get('admin@orbit.dev');
      return res.json({
        access_token: 'orbit_admin_jwt_token_2026',
        token_type: 'bearer',
        user,
      });
    }
    return res.status(401).json({ detail: 'Incorrect email or password. Use default credentials.' });
  });

  app.get('/api/v1/admin/stats', (_req: Request, res: Response) => {
    const total_users = (db.prepare('SELECT COUNT(*) as count FROM users').get() as any).count;
    const total_waitlist = (db.prepare('SELECT COUNT(*) as count FROM waitlist').get() as any).count;
    const pending_waitlist = (db.prepare("SELECT COUNT(*) as count FROM waitlist WHERE status = 'pending'").get() as any).count;
    const total_inquiries = (db.prepare('SELECT COUNT(*) as count FROM inquiries').get() as any).count;
    const new_inquiries = (db.prepare("SELECT COUNT(*) as count FROM inquiries WHERE status = 'new'").get() as any).count;
    const total_subscribers = (db.prepare('SELECT COUNT(*) as count FROM subscribers').get() as any).count;

    const roleRows = db.prepare('SELECT builder_role, COUNT(*) as count FROM waitlist GROUP BY builder_role').all() as any[];
    const builder_role_breakdown: Record<string, number> = { frontend: 0, fullstack: 0, teams: 0, other: 0 };
    roleRows.forEach(r => {
      builder_role_breakdown[r.builder_role] = r.count;
    });

    const inquiryRows = db.prepare('SELECT inquiry_type, COUNT(*) as count FROM inquiries GROUP BY inquiry_type').all() as any[];
    const inquiry_type_breakdown: Record<string, number> = { demo: 0, sales: 0, partnership: 0, general: 0 };
    inquiryRows.forEach(i => {
      inquiry_type_breakdown[i.inquiry_type] = i.count;
    });

    return res.json({
      total_users,
      total_waitlist,
      pending_waitlist,
      total_inquiries,
      new_inquiries,
      total_subscribers,
      total_projects: 3,
      total_agent_tasks: 12,
      builder_role_breakdown,
      inquiry_type_breakdown,
    });
  });

  app.get('/api/v1/admin/users', (_req: Request, res: Response) => {
    const users = db.prepare('SELECT * FROM users ORDER BY id ASC').all();
    return res.json(users);
  });

  // 5. Database Raw Inspector (inspect SQLite tables and records)
  app.get('/api/v1/database/raw', (_req: Request, res: Response) => {
    const waitlist = db.prepare('SELECT * FROM waitlist ORDER BY id DESC').all();
    const inquiries = db.prepare('SELECT * FROM inquiries ORDER BY id DESC').all();
    const subscribers = db.prepare('SELECT * FROM subscribers ORDER BY id DESC').all();
    const users = db.prepare('SELECT * FROM users ORDER BY id ASC').all();
    return res.json({
      db_file: 'orbit.db',
      waitlist,
      inquiries,
      subscribers,
      users,
    });
  });

  // 6. Agents Interactive Demo API
  app.post('/api/v1/agents/demo', (req: Request, res: Response) => {
    const { prompt } = req.body;
    const cleanPrompt = (prompt || '').trim();
    const lowerPrompt = cleanPrompt.toLowerCase();

    let steps;
    let files;
    let diff;
    let proj;

    if (
      lowerPrompt.includes('storefront') ||
      lowerPrompt.includes('shop') ||
      lowerPrompt.includes('product') ||
      lowerPrompt.includes('gallery')
    ) {
      steps = [
        { step_number: 1, title: 'Plan ready', description: 'Mapped the page structure and component boundaries', status: 'done', time_label: '2m', details: 'Parsed design tokens and product layout hierarchy.' },
        { step_number: 2, title: 'Building gallery', description: 'Updating 3 components with smooth transitions', status: 'active', time_label: 'now', details: 'Modifying ProductGallery.vue, ImageCarousel.tsx, and theme.css.' },
        { step_number: 3, title: 'Reviewing checks', description: 'Browser previews and layout responsiveness validated', status: 'pending', time_label: 'pending', details: 'Automated headless viewport tests across mobile and desktop.' },
      ];
      files = ['src/components/ProductGallery.tsx', 'src/components/ImageCarousel.tsx', 'src/styles/theme.css'];
      diff = '+142 lines, -38 lines across 3 files';
      proj = 'atlas / storefront-refresh';
    } else if (
      lowerPrompt.includes('auth') ||
      lowerPrompt.includes('login') ||
      lowerPrompt.includes('jwt') ||
      lowerPrompt.includes('user')
    ) {
      steps = [
        { step_number: 1, title: 'Security schema planned', description: 'Defined JWT claims, password hashing, and role policies', status: 'done', time_label: '1m', details: 'Generated user model with bcrypt and refresh tokens.' },
        { step_number: 2, title: 'Implementing endpoints', description: 'Writing auth router and session middleware', status: 'active', time_label: 'now', details: 'Created /auth/login, /auth/register, and /auth/me.' },
        { step_number: 3, title: 'Verification suite', description: 'Running unit tests for token expiration and edge cases', status: 'pending', time_label: 'pending', details: 'Checked unauthorized handling, password strength, and token reuse.' },
      ];
      files = ['src/auth/jwt.ts', 'src/models/user.ts', 'tests/auth.test.ts'];
      diff = '+210 lines, -0 lines across 3 files';
      proj = 'orbit / auth-subsystem';
    } else {
      steps = [
        { step_number: 1, title: 'Plan mapped', description: `Analyzed requirements for '${cleanPrompt.slice(0, 45)}...'`, status: 'done', time_label: '1m', details: 'Synthesized implementation path and identified target modules.' },
        { step_number: 2, title: 'Executing implementation', description: 'Applying edits and synchronizing architecture', status: 'active', time_label: 'now', details: 'Running code transforms across frontend and backend modules.' },
        { step_number: 3, title: 'Running checks', description: 'Verifying tests, linting, and live preview rendering', status: 'pending', time_label: 'pending', details: 'Performing health checks and contract verification.' },
      ];
      files = ['src/core/workspace.ts', 'src/components/View.tsx', 'tests/view.spec.ts'];
      diff = '+94 lines, -20 lines across 3 files';
      const cleanSlug = cleanPrompt.slice(0, 18).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
      proj = `orbit / ${cleanSlug || 'workspace'}`;
    }

    return res.json({
      prompt: cleanPrompt,
      project_name: proj,
      branch: 'main',
      steps,
      files_affected: files,
      diff_summary: diff,
      status: 'ready',
    });
  });

  // 7. Download 1-Click Launchers
  app.get('/api/v1/download/start-windows', (_req: Request, res: Response) => {
    return res.download(path.join(__dirname, 'start.bat'), 'start.bat');
  });

  app.get('/api/v1/download/start-mac', (_req: Request, res: Response) => {
    return res.download(path.join(__dirname, 'start.sh'), 'start.sh');
  });

  // Mount Vite or serve static build
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.use(async (req: Request, res: Response, next) => {
      if (req.method !== 'GET' || req.path.startsWith('/api')) {
        return next();
      }
      try {
        const url = req.originalUrl;
        const template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        const html = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`[Orbit Full-Stack] Server running on http://${HOST}:${PORT} (connected to SQLite orbit.db)`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
