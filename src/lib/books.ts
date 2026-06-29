// Recommended books — manually curated, monetized via Amazon Associates.
//
// Each entry carries:
//   - asin       : 10-char Amazon ID (the bit after /dp/ in any product URL)
//   - title/author/description : the short pitch shown on the listing page
//   - bestFor    : one-line "who should read this"
//   - keyTopics  : 3–5 quick-scan topic chips on the detail page
//   - review     : the longer take (markdown) shown on /books/[asin]
//   - level      : optional difficulty badge
//   - coverUrl   : optional real cover image; synthetic gradient cover if omitted
//
// The affiliate tag is appended at render time from NEXT_PUBLIC_AMAZON_AFFILIATE_TAG.

export type BookCategory = 'aws' | 'system-design' | 'software-engineering' | 'career';

export const BOOK_CATEGORIES: { key: BookCategory; label: string; blurb: string }[] = [
  {
    key: 'aws',
    label: 'AWS & Cloud',
    blurb: 'Hands-on guides for the services I write about most.',
  },
  {
    key: 'system-design',
    label: 'System Design',
    blurb: 'The architecture canon — distributed systems, scale, trade-offs.',
  },
  {
    key: 'software-engineering',
    label: 'Software Engineering',
    blurb: 'Craft, code quality, and how to actually ship software well.',
  },
  {
    key: 'career',
    label: 'Career',
    blurb: 'Navigating senior, staff, and leadership tracks in tech.',
  },
];

export type BookLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Book {
  asin: string;
  title: string;
  author: string;
  description: string;
  category: BookCategory;
  level?: BookLevel;
  coverUrl?: string;
  bestFor?: string;
  keyTopics?: string[];
  review?: string;
}

// Starter list — verify each ASIN against your Amazon Associates dashboard
// before treating any one as canonical (ASINs change for new editions).
export const BOOKS: Book[] = [
  {
    asin: '1492092606',
    title: 'AWS Cookbook',
    author: 'John Culkin & Mike Zazon',
    category: 'aws',
    level: 'intermediate',
    coverUrl: 'https://m.media-amazon.com/images/I/81HwE7+ogfL._SL1500_.jpg',
    description:
      'Recipe-driven walkthrough of the workflows you actually hit in production — IAM cross-account, VPC peering, S3 replication, the lot. Great as a working reference, not a sit-down read.',
    bestFor: 'Engineers past their first AWS year who need a fast recipe reference.',
    keyTopics: ['IAM', 'S3', 'Lambda', 'CDK', 'Cross-account access'],
    review: `This is the book I open most often, and not the one I read cover-to-cover. The structure tells you why: each chapter is a category — IAM, Compute, Storage, Networking — and each section is a *recipe* with a problem, a solution sketch, working CLI/CDK code, and a "what's happening here" callout. Three to five pages a recipe, applicable the same hour.

What I keep coming back to: the IAM cross-account recipes. Anyone who has tried to grant a Lambda in account A access to an S3 bucket in account B has felt the pain. The cookbook walks the resource-policy + trust-relationship dance step by step in a way the official docs never quite manage.

What is weaker: the data-services chapters are thinner than I would expect (DynamoDB especially), and a handful of the CDK snippets have drifted into deprecated patterns. Cross-reference current AWS docs before pasting into production.

**Read it if** you are more than a year past your first \`aws configure\` and tired of dead-end Google searches. It earns its keep on the shelf.`,
  },
  {
    asin: '1617295426',
    title: 'Serverless Architectures on AWS, 2nd Edition',
    author: 'Peter Sbarski',
    category: 'aws',
    level: 'intermediate',
    coverUrl: 'https://m.media-amazon.com/images/I/71n5LQ24ivL._SL1500_.jpg',
    description:
      'The book that made Lambda click for me. Walks through event-driven patterns end to end — API Gateway, DynamoDB streams, Step Functions — without the marketing fluff.',
    bestFor: 'Anyone building their first production serverless system on Lambda.',
    keyTopics: ['Lambda', 'API Gateway', 'SNS/SQS', 'Step Functions', 'EventBridge'],
    review: `The book that finally made Lambda click for me. Most serverless content treats Lambda as "compute, but smaller." This one treats it as a fundamentally different architecture — events as the unit of work, cost-per-millisecond as the constraint, cold starts as a trade-off — and walks you through the patterns that follow.

The first third is mental-model setup, including the most honest "should I use serverless at all" framing I have read. The second third is the architecture catalog: API + DynamoDB, SNS/SQS fanout, scheduled jobs, Step Functions state machines, EventBridge for async glue. Each pattern comes with concrete Node.js code, a diagram, and — crucially — the failure modes spelled out. Retries, dead-letter queues, idempotency. Most serverless books skip those. This one does not.

What is dated: a few console screenshots, some IAM examples that would not pass a 2024 review. The architectures themselves are still right.

**Read it if** you are past "what is Lambda" and want to know how to actually build a real system on it.`,
  },
  {
    asin: '1449373321',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    category: 'system-design',
    coverUrl: 'https://m.media-amazon.com/images/I/81EMzJIWjtL._SL1500_.jpg',
    level: 'advanced',
    description:
      'The single most important book on distributed systems for working engineers. Replication, partitioning, consistency, consensus — explained so the trade-offs stick. Re-read it every couple of years.',
    bestFor: 'Mid-level and senior engineers who work with any persistent data.',
    keyTopics: ['Replication', 'Partitioning', 'Consistency', 'Transactions', 'Stream processing'],
    review: `The single most important book on distributed systems I have read, and I re-read parts of it every couple of years. If you build software that stores or moves data — any data, at any scale — this should be on your shelf.

It is organized by concern, not by technology, which is why it is still relevant a decade later. Encoding formats, replication, partitioning, transactions, consistency models, batch vs. stream processing. Each chapter takes one idea (say, leader-based vs. leaderless replication) and walks the trade-offs through real systems: Postgres, Cassandra, Kafka, Spark.

What sets it apart: Kleppmann shows you the *failure modes*. He does not just say "Cassandra uses last-write-wins" — he shows you what happens to your data when two replicas disagree about who wrote what. After Chapter 5 you understand why eventual consistency is hard. After Chapter 7 you understand why exactly-once delivery is a lie.

It is thick. Plan two months of evenings. You will come out speaking the same vocabulary as the engineers who built the systems you depend on — which is the actual reason to read it.

**Read it if** you are more than three years in and have not already. There is no substitute.`,
  },
  {
    asin: '1492034029',
    title: 'Building Microservices, 2nd Edition',
    author: 'Sam Newman',
    category: 'system-design',
    coverUrl: 'https://m.media-amazon.com/images/I/81fIWMyn6JL._SL1500_.jpg',
    level: 'intermediate',
    description:
      'Honest, current take on when microservices are worth it and when they make everything worse. The deployment + observability chapters alone justify the cost.',
    bestFor: 'Teams considering — or actively running — a microservices architecture.',
    keyTopics: ['Service boundaries', 'Data ownership', 'Observability', 'Deployment', 'Distributed tracing'],
    review: `The first edition (2015) was a manifesto. The second (2021) is a more sober follow-up — Newman has watched a decade of microservices deployments, many of them disasters, and the book is now as much about *when not to use them* as about how to build them.

He is still pro-microservices, but the case is honest now: worth it when you have organizational scale (multiple teams that need independent deployment), not when you are a five-person team chasing a buzzword. The first three chapters are the most revised; they are the read I would recommend to anyone considering breaking up a monolith.

The middle is tactical: service boundaries, sync vs. async communication, data ownership (the hardest part of microservices, and the chapter on it is excellent), deployment, observability. The observability chapter alone is worth the cost — distributed tracing is no longer optional, and Newman walks through what you actually need.

The mental model — services own data, communicate over well-defined contracts, deploy independently — is durable advice that survives whatever the next platform fad is.

**Read it if** you are about to split a monolith, or trying to convince a team not to.`,
  },
  {
    asin: 'B08CMF2CQF',
    title: 'System Design Interview — Volume 1',
    author: 'Alex Xu',
    category: 'system-design',
    coverUrl: 'https://m.media-amazon.com/images/I/51vZ6t5W4gL._SL1499_.jpg',
    level: 'beginner',
    description:
      'Interview-focused but doubles as a fast on-ramp to the design vocabulary — rate limiters, consistent hashing, key-value stores. Skim it before any senior interview.',
    bestFor: 'Engineers preparing for senior+ system design interview loops.',
    keyTopics: ['Scaling patterns', 'Caching', 'Load balancing', 'Sharding', 'Queues'],
    review: `The most efficient way to load the standard system-design vocabulary before a senior+ interview. Fifteen chapters, each one a single problem (rate limiter, key-value store, news feed, distributed queue), each walked through the structure interviewers want — clarify requirements, sketch high-level, drill into the bottleneck, scale up.

It is not a substitute for Kleppmann. DDIA is the deep treatment. This is the cheat sheet. But the cheat sheet matters because interviews are about the *form* of the answer as much as the content.

Where it is strongest: the "scale a single-server design to global scale" pattern. Xu repeats it across multiple chapters — start with one box, find the bottleneck, add a cache, add a load balancer, then a CDN, then sharding, then replication — and by chapter four it is muscle memory. That muscle memory is what gets you through 45 minutes at a whiteboard.

Where it is weaker: a few technology callouts have aged (the Kafka chapter is closer to 2017 Kafka than 2024 Kafka), and some "consistency" handling is loose. Read Kleppmann afterward for the foundations.

**Read it if** you have a senior+ interview loop coming up. Cover-to-cover in a week. Not a long-term reference.`,
  },
  {
    asin: '0135957052',
    title: 'The Pragmatic Programmer, 20th Anniversary',
    author: 'David Thomas & Andrew Hunt',
    category: 'software-engineering',
    coverUrl: 'https://m.media-amazon.com/images/I/911WvX7M98L._SL1500_.jpg',
    level: 'beginner',
    description:
      'The closest thing the field has to a code of conduct. The revised edition trimmed the dated parts; what is left is durable advice on craft, design, and career discipline.',
    bestFor: 'Engineers in their first three years of professional code (or in their tenth, as a refresher).',
    keyTopics: ['Orthogonality', 'DRY', 'Decoupling', 'Code quality', 'Career discipline'],
    review: `The book pushed onto every junior engineer in their first six months, and most of them do not read it. They should. This is the closest thing the field has to a code of conduct — opinionated guidelines that survive generations of language and framework churn.

The 20th anniversary edition trimmed the dated parts (CVS, Perl examples) and added material on concurrency and ethics. What is left is durable: orthogonality, the broken-window theory of code rot, "the source code is the design," programming by coincidence, decoupling. The chapter on DRY is the one most people misquote — DRY is about knowledge, not lines of code. Read that one chapter and you will stop having that argument.

It is a fast read, three or four evenings. The value is not in any single tip but in the accumulated mindset. You start noticing when your own code is brittle. You start asking "why are we duplicating this knowledge in three places?" instead of accepting it.

**Read it if** you have been writing software for less than three years. **Re-read it if** you have been at it for more than ten — you will notice how much your team has stopped doing.`,
  },
  {
    asin: '1492082791',
    title: 'Software Engineering at Google',
    author: 'Titus Winters, Tom Manshreck, Hyrum Wright',
    category: 'software-engineering',
    coverUrl: 'https://m.media-amazon.com/images/I/81bSa9px6qL._SL1500_.jpg',
    level: 'advanced',
    description:
      'The closest you will get to a peek inside one engineering org without working there. Best chapters: code review, dependency management, large-scale changes.',
    bestFor: 'Engineers in growing codebases past the small-team stage.',
    keyTopics: ['Code review', 'Dependency management', 'Testing culture', 'Large-scale change'],
    review: `The closest you will get to a look inside one of the largest engineering orgs without working there. It is not a how-to — Google's tools and scale are unique — but the principles behind the tools are transferable, and that is the value.

Standout chapters: code review (one reviewer is enough, blocking on style is anti-productive, design discussion belongs elsewhere); dependency management (the "diamond dependency problem" framing alone is worth the cost); and Large-Scale Changes — how do you make a breaking change across 50,000 callers without breaking everything? Their answer is process-heavy and unromantic, but it is the only one that works.

The testing chapters are strong, particularly the "Beyoncé Rule" framing (if you liked it then you shoulda put a test on it). They are aimed at infrastructure-scale codebases; smaller teams may find them aspirational.

What is overhyped: the chapters on culture and process can read like PR if you are cynical about big-tech idealizations. Take the principles, leave the self-mythology.

**Read it if** you work in a codebase growing past the "everyone knows everyone" stage and want to know what patterns hold at scale.`,
  },
  {
    asin: '1098118731',
    title: 'The Staff Engineer’s Path',
    author: 'Tanya Reilly',
    category: 'career',
    coverUrl: 'https://m.media-amazon.com/images/I/813cTBVF1hL._SL1500_.jpg',
    level: 'intermediate',
    description:
      'The clearest map I have read of the staff+ engineering track — how to operate at scope, write the docs that move orgs, and stay technical past senior. Required reading once you stop wanting management.',
    bestFor: 'Senior engineers weighing the manager vs. staff track decision.',
    keyTopics: ['Technical strategy', 'Design docs', 'Sponsorship', 'Organizational influence'],
    review: `The clearest map I have read of the staff+ engineering track — what it means to operate at scope without becoming a manager. Reilly (Squarespace staff, ex-Google) writes like a peer who has already navigated the terrain you are staring at.

The framing is three sections: Big Picture (knowing what to work on), Execution (driving large efforts), Levelling Up (growing yourself and others). The strongest is Big Picture — particularly the discussion of how to spend your "social capital," the credibility you have built, on the bets worth making. Most senior engineers I have watched fail at staff did not pick their bets; they got pulled into every interesting problem and ran out of capacity.

Execution nails the unsexy parts: writing the design doc that aligns three teams, navigating politics without becoming political, the difference between mentoring and sponsoring. Read the "your title is not your job" chapter once and your relationship with the title changes.

It pairs naturally with Will Larson's *Staff Engineer*. Reilly is the operational manual; Larson is the careers manual.

**Read it if** you are senior and weighing manager vs. staff. Read it before deciding.`,
  },
];

const AFFILIATE_TAG = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || '';

export function affiliateUrl(asin: string): string {
  const base = `https://www.amazon.com/dp/${asin}`;
  return AFFILIATE_TAG ? `${base}?tag=${AFFILIATE_TAG}` : base;
}

export function isValidBookCategory(value: string | undefined): value is BookCategory {
  return BOOK_CATEGORIES.some((c) => c.key === value);
}

export function getBooks(category?: BookCategory | 'all'): Book[] {
  if (!category || category === 'all') return BOOKS;
  return BOOKS.filter((b) => b.category === category);
}

export function getBookByAsin(asin: string): Book | undefined {
  return BOOKS.find((b) => b.asin === asin);
}

// Same-category first; if there aren't enough, top up from other categories so
// the "related" rail is never sparse on a small catalog.
export function relatedBooks(book: Book, limit = 3): Book[] {
  const same = BOOKS.filter((b) => b.asin !== book.asin && b.category === book.category);
  if (same.length >= limit) return same.slice(0, limit);
  const others = BOOKS.filter((b) => b.asin !== book.asin && b.category !== book.category);
  return [...same, ...others].slice(0, limit);
}

// Stable gradient per ASIN — covers look intentional without external assets.
const COVER_GRADIENTS = [
  'linear-gradient(135deg, #1e3a8a 0%, #5b21b6 100%)',
  'linear-gradient(135deg, #0c4a6e 0%, #0f766e 100%)',
  'linear-gradient(135deg, #7c2d12 0%, #b45309 100%)',
  'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
  'linear-gradient(135deg, #4c1d95 0%, #831843 100%)',
  'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
];

export function coverGradient(asin: string): string {
  let hash = 0;
  for (let i = 0; i < asin.length; i++) {
    hash = (hash * 31 + asin.charCodeAt(i)) >>> 0;
  }
  return COVER_GRADIENTS[hash % COVER_GRADIENTS.length];
}
