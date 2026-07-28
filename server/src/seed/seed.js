import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import pool from '../config/db.js';

dotenv.config({ quiet: true });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DEMO_PASSWORD = 'Briefsy@123';

const demoUsers = [
  { name: 'Asha Verma', email: 'asha.demo@briefsy.dev', domain_interest: 'technology' },
  { name: 'Marcus Lee', email: 'marcus.demo@briefsy.dev', domain_interest: 'business' },
  { name: 'Priya Nair', email: 'priya.demo@briefsy.dev', domain_interest: 'science' },
  { name: 'Jordan Blake', email: 'jordan.demo@briefsy.dev', domain_interest: 'sports' },
  { name: 'Sofia Torres', email: 'sofia.demo@briefsy.dev', domain_interest: 'entertainment' },
  { name: 'Ken Okafor', email: 'ken.demo@briefsy.dev', domain_interest: 'health' },
];

const fallbackArticles = {
  technology: [
    ['AI Assistants Are Quietly Becoming the New Browser Homepage', 'A wave of startups is betting that chat-based assistants, not search bars, will be where people start their day online.'],
    ['Chipmakers Race to Shrink Power Use as AI Data Centers Strain Grids', 'Energy efficiency is becoming as important as raw speed in the next generation of AI hardware.'],
    ['Open-Source Models Are Closing the Gap With Big Labs, New Benchmark Shows', 'Community-built models matched proprietary systems on several reasoning tasks for the first time this year.'],
    ['Foldable Laptops Move From Concept to Shelves', 'Manufacturers are betting flexible screens can revive a slowing laptop market.'],
    ['Quantum Computing Startups Attract Record Early-Stage Funding', 'Investors are pouring money into quantum research despite commercial products still being years away.'],
  ],
  business: [
    ["Retailers Lean Into 'Buy Now, Pay Later' as Consumer Spending Cools", 'Installment plans are showing up at checkout for everything from groceries to electronics.'],
    ['Central Banks Signal Caution as Inflation Data Sends Mixed Signals', 'Policymakers are weighing rate decisions carefully after a volatile quarter of economic indicators.'],
    ['Startup Layoffs Slow but Hiring Freezes Persist Across Tech Sector', 'Companies are stabilizing headcount even as they hold off on aggressive expansion.'],
    ['Shipping Costs Tick Up as Global Trade Routes Face New Bottlenecks', 'Logistics firms warn the ripple effects could reach store shelves within weeks.'],
    ['Small Businesses Adopt AI Tools Faster Than Expected, Survey Finds', 'Owners cite time savings on admin work as the biggest driver of adoption.'],
  ],
  sports: [
    ['Underdog Squad Stuns League Leaders in Late Comeback', 'A last-minute rally flipped a game that looked decided with minutes left on the clock.'],
    ["Star Player's Injury Update Shakes Up Playoff Picture", 'Coaches are reworking strategy after the news broke ahead of the postseason push.'],
    ['Youth Academies Are Reshaping How Clubs Scout Talent', 'Data-driven recruiting is changing who gets a shot at the top level.'],
    ['Record Attendance Signals a Comeback for Live Sports Viewing', 'Venues report their busiest season in years despite competition from streaming.'],
    ['New Rule Change Sparks Debate Among Fans and Analysts', "Supporters say it speeds up the game; critics argue it changes the sport's character."],
  ],
  science: [
    ['Researchers Map a New Layer of Ocean Life Using Deep-Sea Robots', 'The survey uncovered species previously unseen by human observers.'],
    ['Gene-Editing Trial Shows Early Promise for Rare Blood Disorder', 'Small-scale results have researchers cautiously optimistic ahead of larger trials.'],
    ['Telescope Data Hints at Unusual Atmosphere on Distant Exoplanet', 'Scientists say the readings warrant follow-up observation before drawing conclusions.'],
    ['Soil Microbes Could Hold a Key to More Resilient Crops, Study Finds', 'Field trials suggest certain microbial treatments help plants withstand drought stress.'],
    ['Physicists Report Progress Toward More Stable Fusion Reactions', 'The experiment sustained plasma for longer than previous attempts, though far from commercial viability.'],
  ],
  health: [
    ['Sleep Researchers Link Irregular Schedules to Long-Term Health Risks', 'The study followed participants over several years to track the effects of inconsistent sleep timing.'],
    ["New Guidelines Urge Rethinking How We Measure 'Healthy' Aging", 'Experts argue standard markers miss important quality-of-life factors.'],
    ['Mental Health Apps Face Scrutiny Over Data Privacy Practices', 'Regulators are asking tougher questions about how sensitive user data is handled.'],
    ['Walking Speed May Be a Simple Predictor of Long-Term Health, Researchers Say', 'A large cohort study found a correlation worth further investigation.'],
    ['Hospitals Pilot AI Tools to Cut Diagnostic Wait Times', 'Early results show faster triage without a clear tradeoff in accuracy so far.'],
  ],
  entertainment: [
    ['Streaming Platforms Bet Big on Interactive Storytelling Formats', 'New releases let viewers steer plot points, a format platforms hope keeps subscribers engaged longer.'],
    ['Indie Films Are Finding Bigger Audiences Through Social Media Buzz', 'Word-of-mouth clips are doing what marketing budgets used to.'],
    ["Veteran Director's Surprise Project Draws Early Festival Buzz", 'Details are scarce, but early reactions suggest a departure from familiar territory.'],
    ['Music Labels Test New Royalty Models for AI-Assisted Tracks', "The industry is trying to get ahead of questions around AI's role in songwriting."],
    ['Reboot Fatigue? Fans Push Back on Another Franchise Revival', 'Social media reaction has been more skeptical than nostalgic this time around.'],
  ],
};

const povTemplates = {
  supporting: [
    "This tracks with what I've been seeing — feels like a natural next step, not a surprise.",
    "Glad to see this getting attention, it's overdue and the direction seems right.",
    'Backing this take. The reasoning holds up when you look at the broader trend.',
    'Makes sense to me — the upside here looks bigger than the risks people are flagging.',
  ],
  critical: [
    'Not convinced. The headline is doing more work than the actual substance here.',
    "Feels overhyped — I'd wait for follow-up reporting before taking this at face value.",
    'The framing glosses over some real downsides that deserve more scrutiny.',
    "I've seen this pattern before and it didn't hold up long-term. Cautious on this one.",
  ],
  neutral: [
    'Could go either way honestly — depends a lot on execution over the next few months.',
    'Interesting development, but too early to say if it is a big deal or a footnote.',
    'Mixed feelings. Some parts seem promising, others feel like they need more evidence.',
    'Neither impressed nor worried — just tracking how this plays out.',
  ],
  personal: [
    "This one actually affects my day-to-day, so I've been following it closely.",
    'Reminds me of something I dealt with recently — hits differently when it is not abstract.',
    'As someone in this space, this lines up with what I have noticed lately.',
    "Not gonna lie, this changes how I'm thinking about my own plans this year.",
  ],
};

const povTypes = Object.keys(povTemplates);

async function ensureSchema() {
  const schema = fs.readFileSync(path.join(__dirname, '..', 'db', 'schema.sql'), 'utf-8');
  await pool.query(schema);
  console.log('Schema ensured.');
}

async function seedFallbackArticles() {
  let created = 0;

  for (const [category, items] of Object.entries(fallbackArticles)) {
    const { rows } = await pool.query('SELECT COUNT(*) FROM articles WHERE category = $1', [category]);

    if (Number(rows[0].count) > 0) continue;

    for (let i = 0; i < items.length; i++) {
      const [title, summary] = items[i];
      const publishedAt = new Date(Date.now() - i * 20 * 60 * 60 * 1000);

      const result = await pool.query(
        `INSERT INTO articles (title, summary, content, source, category, url, image_url, published_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (url) DO NOTHING
         RETURNING id`,
        [
          title,
          summary,
          summary,
          'Briefsy Sample Feed',
          category,
          `https://example.com/briefsy-seed/${category}-${i + 1}`,
          `https://placehold.co/640x360/png?text=${encodeURIComponent(category)}`,
          publishedAt,
        ]
      );

      if (result.rows.length > 0) created++;
    }
  }

  return created;
}

async function seedUsers() {
  const hashed = await bcrypt.hash(DEMO_PASSWORD, 10);
  const userIdsByDomain = {};

  for (const u of demoUsers) {
    const result = await pool.query(
      `INSERT INTO users (name, email, password, domain_interest)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
       RETURNING id, domain_interest`,
      [u.name, u.email, hashed, u.domain_interest]
    );
    userIdsByDomain[result.rows[0].domain_interest] = result.rows[0].id;
  }

  return userIdsByDomain;
}

async function getArticleIds(category, limit) {
  const result = await pool.query(
    `SELECT id FROM articles WHERE category = $1 ORDER BY published_at DESC NULLS LAST LIMIT $2`,
    [category, limit]
  );
  return result.rows.map((r) => r.id);
}

async function seedPovsAndVotes(userIdsByDomain) {
  const allUserIds = Object.values(userIdsByDomain).sort((a, b) => a - b);
  const totalUsers = allUserIds.length;
  let povsCreated = 0;
  let votesCreated = 0;

  for (const category of Object.keys(userIdsByDomain)) {
    // 20 matches the LIMIT used by the live category/personalized feed queries,
    // so seeded POVs stay visible even as the news-fetch cron adds fresher articles.
    const articleIds = await getArticleIds(category, 20);

    for (let articleIndex = 0; articleIndex < articleIds.length; articleIndex++) {
      const articleId = articleIds[articleIndex];
      const authorCount = Math.min(2, totalUsers);
      const authors = Array.from(
        { length: authorCount },
        (_, a) => allUserIds[(articleIndex + a) % totalUsers]
      );

      for (let authorPos = 0; authorPos < authors.length; authorPos++) {
        const authorId = authors[authorPos];

        const existing = await pool.query(
          `SELECT id FROM povs WHERE user_id = $1 AND article_id = $2`,
          [authorId, articleId]
        );

        if (existing.rows.length > 0) continue;

        const type = povTypes[(articleIndex + authorPos) % povTypes.length];
        const templates = povTemplates[type];
        const content = templates[(articleIndex + authorPos) % templates.length];

        const inserted = await pool.query(
          `INSERT INTO povs (user_id, article_id, pov_type, content)
           VALUES ($1, $2, $3, $4)
           RETURNING id`,
          [authorId, articleId, type, content]
        );

        povsCreated += 1;
        const povId = inserted.rows[0].id;

        const voters = allUserIds.filter((id) => !authors.includes(id));

        for (let voterPos = 0; voterPos < voters.length; voterPos++) {
          const voterId = voters[voterPos];
          const voteType = (articleIndex + voterPos) % 4 === 0 ? 'down' : 'up';

          const voteResult = await pool.query(
            `INSERT INTO pov_votes (user_id, pov_id, vote_type)
             VALUES ($1, $2, $3)
             ON CONFLICT (user_id, pov_id) DO NOTHING
             RETURNING id`,
            [voterId, povId, voteType]
          );

          if (voteResult.rows.length > 0) votesCreated += 1;
        }
      }
    }
  }

  return { povsCreated, votesCreated };
}

async function seedBookmarks(userIdsByDomain) {
  let created = 0;

  for (const [category, userId] of Object.entries(userIdsByDomain)) {
    const articleIds = await getArticleIds(category, 3);

    for (const articleId of articleIds) {
      const result = await pool.query(
        `INSERT INTO bookmarks (user_id, article_id)
         VALUES ($1, $2)
         ON CONFLICT (user_id, article_id) DO NOTHING
         RETURNING id`,
        [userId, articleId]
      );

      if (result.rows.length > 0) created += 1;
    }
  }

  return created;
}

async function main() {
  try {
    await ensureSchema();

    const articlesCreated = await seedFallbackArticles();
    const userIdsByDomain = await seedUsers();
    const { povsCreated, votesCreated } = await seedPovsAndVotes(userIdsByDomain);
    const bookmarksCreated = await seedBookmarks(userIdsByDomain);

    console.log('\nSeed complete:');
    console.log(`  Fallback articles created: ${articlesCreated}`);
    console.log(`  Demo users ensured: ${demoUsers.length}`);
    console.log(`  POVs created: ${povsCreated}`);
    console.log(`  Votes created: ${votesCreated}`);
    console.log(`  Bookmarks created: ${bookmarksCreated}`);
    console.log('\nDemo login (password is the same for all):');
    demoUsers.forEach((u) => console.log(`  ${u.email}`));
    console.log(`  password: ${DEMO_PASSWORD}`);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
