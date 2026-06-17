const { kv } = require('@vercel/kv');
const { requireAuth } = require('./_lib/auth');

const KV_KEY = 'golyne_services';

function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function emptyDefaults() {
  return {
    icon: '✨',
    color: '#a855f7',
    color2: '#22d3ee',
    name: 'New Service',
    tagline: '',
    badge: '',
    heroTitle: 'New Service',
    description: '',
    startingFrom: '',
    priceNote: '',
    quickFeatures: [],
    included: [],
    steps: [],
    results: [],
    faqs: []
  };
}

const SEED = [
  {
    id: 'website', order: 1, icon: '🌐', color: '#a855f7', color2: '#22d3ee',
    name: 'Website Development',
    tagline: 'Lightning-fast, mobile-first websites that look stunning and rank on Google. Custom designs in 3–5 days.',
    badge: 'Web Development',
    heroTitle: 'Lightning-Fast\nWebsites That\nActually Convert',
    description: "We design and develop custom websites that don't just look stunning — they rank on Google and turn visitors into paying customers. No templates, no drag-and-drop builders. Every site is hand-crafted for your business.",
    startingFrom: '₹6,000', priceNote: 'One-time project fee',
    quickFeatures: ['Delivered in 3–5 business days', 'SEO-ready from day one', 'Mobile-first design', 'Free revisions before launch'],
    included: [
      { icon: '🎨', title: 'Custom UI Design', desc: 'A fully unique design crafted around your brand — colors, fonts, and layout chosen specifically for your business and audience.' },
      { icon: '📱', title: '100% Mobile Responsive', desc: 'Your website looks and performs perfectly on every screen size — from mobile phones to large desktops.' },
      { icon: '⚡', title: '95+ PageSpeed Score', desc: 'Blazing-fast load times that improve user experience and signal Google to rank you higher in search results.' },
      { icon: '🔍', title: 'On-Page SEO', desc: 'We handle title tags, meta descriptions, schema markup, image optimization, and site structure — everything Google needs.' },
      { icon: '🗂️', title: 'CMS Integration', desc: 'Update your own content with ease using a built-in content management system. No tech skills required.' },
      { icon: '🔒', title: 'SSL + Hosting Setup', desc: 'Secure HTTPS setup, domain connection, and hosting configuration — your site is live and protected from day one.' }
    ],
    steps: [
      { title: 'Share your brief', desc: 'Tell us what your business does, who your customers are, and any designs you like. A 10-minute chat or quick form works.' },
      { title: 'Get a free mockup', desc: 'We design a full homepage mockup at no cost. You see exactly what your site will look like before anything is built.' },
      { title: 'Approve & build', desc: "Once you're happy with the design, we build the full site. Development typically takes 3–5 business days." },
      { title: 'Review & go live', desc: 'You get a staging link to review everything. After your final approval, we push it live with your domain.' }
    ],
    results: [{ num: '3–5', label: 'Days to go live' }, { num: '95+', label: 'PageSpeed score' }, { num: '2×', label: 'Avg. conversion lift' }, { num: '100%', label: 'Mobile optimized' }],
    faqs: [
      { q: 'Do you use page builders like WordPress or Wix?', a: 'We primarily build in clean HTML/CSS/JS or React. We can work in WordPress if you need a CMS. We never use Wix or Squarespace — they limit performance and SEO.' },
      { q: 'What do I need to provide to get started?', a: 'Just your brand colors and logo (if you have them), a brief about your business, and any reference websites you like. We handle the rest.' },
      { q: 'Can I update the website content myself after it\'s done?', a: "Yes. If you want a CMS, we'll set up an easy editor so you can change text, images, and blog posts without touching any code." },
      { q: 'What happens after the site is live?', a: 'We include 1 month of free support post-launch. After that, we offer affordable monthly maintenance plans.' }
    ]
  },
  {
    id: 'mobile', order: 2, icon: '📱', color: '#22d3ee', color2: '#a855f7',
    name: 'Mobile App Development',
    tagline: 'Android & iOS apps for real business needs — booking systems, loyalty programs, delivery apps and more.',
    badge: 'Mobile Apps',
    heroTitle: 'Apps Your\nCustomers Will\nActually Use',
    description: 'From booking systems to loyalty programs to full-scale delivery apps — we build native Android and iOS applications that solve real business problems. Designed for your users, built to scale.',
    startingFrom: '₹12,000', priceNote: 'Project-based pricing',
    quickFeatures: ['Android & iOS native builds', 'Backend API included', 'App Store deployment handled', 'Post-launch support included'],
    included: [
      { icon: '📲', title: 'Native Android & iOS', desc: 'We build for both platforms — either as two native apps or a cross-platform build using React Native, depending on your budget.' },
      { icon: '🛠️', title: 'Backend API Development', desc: 'A robust server-side backend that handles authentication, data storage, notifications, and business logic.' },
      { icon: '🔔', title: 'Push Notifications', desc: 'Engage your users with targeted push notifications — order updates, promotions, reminders, and more.' },
      { icon: '💳', title: 'Payment Integration', desc: 'Seamless checkout using Razorpay, Stripe, PayU, or UPI — complete with order management and payment receipts.' },
      { icon: '🏬', title: 'App Store Deployment', desc: 'We handle the Google Play and Apple App Store submission process end to end, including screenshots and compliance.' },
      { icon: '📈', title: 'Analytics & Crash Reporting', desc: 'Built-in analytics so you understand how users interact with your app, and crash reporting to catch issues early.' }
    ],
    steps: [
      { title: 'Discovery call', desc: "We understand your app idea, your users, and the specific features you need. We also advise on what's feasible within your budget." },
      { title: 'UI/UX Design', desc: 'Our designers create full interactive mockups in Figma. You see every screen before a line of code is written.' },
      { title: 'Development sprint', desc: "We build your app in focused sprints, sharing progress updates weekly so you're always in the loop." },
      { title: 'QA & launch', desc: 'Rigorous testing on real devices before submission to the Play Store and App Store. We handle the review process.' }
    ],
    results: [{ num: '4–6', label: 'Week delivery' }, { num: '2', label: 'Platforms covered' }, { num: '99.9%', label: 'Uptime target' }, { num: '5★', label: 'Avg app rating' }],
    faqs: [
      { q: 'Will you build for both Android and iOS?', a: 'Yes. We typically use React Native for cost-effective cross-platform development, or native Swift/Kotlin if performance is critical.' },
      { q: 'How long does app development take?', a: 'A standard app with 8–15 screens and core features takes 4–6 weeks. Complex apps may take longer.' },
      { q: 'Do I own the source code?', a: 'Absolutely. Once the project is complete and paid for, you receive full source code ownership. No lock-in.' },
      { q: "Can you update the app after it's launched?", a: 'Yes. We offer monthly maintenance retainers for feature additions, OS updates, and bug fixes.' }
    ]
  },
  {
    id: 'seo', order: 3, icon: '🔍', color: '#f59e0b', color2: '#22d3ee',
    name: 'SEO Optimization',
    tagline: 'Get found on Google organically. We optimize your site to rank for keywords your customers are searching.',
    badge: 'SEO Optimization',
    heroTitle: 'Page 1 on Google.\nOrganic Traffic\nThat Compounds.',
    description: "We optimize your website to rank for the keywords your customers are actually searching. Our SEO strategies are built on technical excellence, quality content, and real link-building — not shortcuts that get penalized.",
    startingFrom: '₹5,000', priceNote: 'Per month — minimum 3 months',
    quickFeatures: ['Full technical SEO audit', 'Keyword research included', 'Monthly reports with real data', 'No black-hat tactics'],
    included: [
      { icon: '🔑', title: 'Keyword Research', desc: 'We find the exact phrases your customers search — high-intent keywords with real buying signals — and build your strategy around them.' },
      { icon: '🧪', title: 'Technical SEO Audit', desc: 'We fix crawl errors, broken links, duplicate content, site speed issues, Core Web Vitals, and anything holding you back in rankings.' },
      { icon: '📝', title: 'On-Page Optimization', desc: 'Title tags, meta descriptions, header structure, internal linking, image alt tags, and schema markup — optimized on every page.' },
      { icon: '✍️', title: 'Content Strategy', desc: 'We identify content gaps on your site and either write blog posts and landing pages or guide your team on what to create.' },
      { icon: '🔗', title: 'Link Building', desc: 'We earn high-quality backlinks from relevant websites through outreach, guest posting, and digital PR.' },
      { icon: '📊', title: 'Monthly Ranking Report', desc: "A clear report every month showing your keyword rankings, organic traffic growth, and what we're focusing on next." }
    ],
    steps: [
      { title: 'SEO audit', desc: "We run a full technical and content audit to identify exactly what's holding your site back from ranking." },
      { title: 'Strategy & quick wins', desc: 'We build a 3-month roadmap and tackle the highest-impact fixes first — often delivering visible results within 4–6 weeks.' },
      { title: 'Ongoing optimization', desc: 'Each month: new content, updated on-page signals, fresh backlinks, and technical improvements.' },
      { title: 'Report & refine', desc: "Monthly report with ranking movement, traffic data, and next month's plan. Fully transparent, always." }
    ],
    results: [{ num: '4–6', label: 'Weeks to first results' }, { num: '3×', label: 'Avg organic traffic lift' }, { num: 'Page 1', label: 'Our goal for you' }, { num: '0', label: 'Black-hat tactics' }],
    faqs: [
      { q: 'How long does SEO take to show results?', a: "You'll typically see ranking improvements within 4–8 weeks for lower-competition keywords, and 3–6 months for competitive terms." },
      { q: 'Do you guarantee page 1 rankings?', a: 'No ethical SEO agency can guarantee specific rankings. We guarantee consistent effort, transparent reporting, and a proven strategy.' },
      { q: 'Will you create content for my site?', a: 'Yes. We can write blog posts, landing pages, and FAQs as part of your plan.' },
      { q: 'Can I see what you\'re doing each month?', a: 'Absolutely. You receive a detailed monthly report showing keyword positions, traffic data, work completed, and our plan for next month.' }
    ]
  },
  {
    id: 'ads', order: 4, icon: '📣', color: '#f472b6', color2: '#a855f7',
    name: 'Paid Ads (Google & Meta)',
    tagline: 'High-converting campaigns on Google and Meta. We target the right audience and deliver 3–8x ROAS.',
    badge: 'Paid Advertising',
    heroTitle: 'Google & Meta Ads\nThat Actually\nDeliver ROAS',
    description: 'We manage high-converting ad campaigns on Google Search, YouTube, Facebook, and Instagram. Precision targeting, obsessive optimization, and transparent reporting — we treat your ad spend like it\'s our own money.',
    startingFrom: '₹6,000', priceNote: 'Per month management fee (ad spend extra)',
    quickFeatures: ['Google Search, Display & YouTube', 'Facebook & Instagram Ads', 'A/B testing every campaign', 'Weekly performance updates'],
    included: [
      { icon: '🎯', title: 'Audience Research & Targeting', desc: 'We build detailed audience profiles based on your ideal customer — demographics, interests, behaviors, and search intent.' },
      { icon: '🖌️', title: 'Ad Copywriting & Creatives', desc: 'We write compelling ad copy and design scroll-stopping creatives for every placement. You approve before anything goes live.' },
      { icon: '🧬', title: 'A/B Testing', desc: 'We continuously test headlines, images, CTAs, and audiences. Winners scale, losers stop. Your ROAS improves every week.' },
      { icon: '📡', title: 'Conversion Tracking Setup', desc: 'Proper pixel setup, UTM tracking, and Google Tag Manager configuration so we know exactly which ads are driving revenue.' },
      { icon: '🔁', title: 'Retargeting Campaigns', desc: "We re-engage visitors who didn't convert the first time — often the highest-ROI ads in your entire account." },
      { icon: '📬', title: 'Weekly Reports', desc: 'Every week: spend, impressions, clicks, leads, and ROAS. Clear numbers, no fluff.' }
    ],
    steps: [
      { title: 'Account & funnel audit', desc: "If you're running ads already, we audit your account for waste and missed opportunities. If not, we start fresh." },
      { title: 'Campaign build', desc: 'We set up your campaigns, ad groups, creatives, audiences, and tracking — ready for launch in 5–7 business days.' },
      { title: 'Launch & monitor', desc: 'Campaigns go live. We monitor performance daily in the first two weeks, adjusting bids and budgets in real time.' },
      { title: 'Optimize & scale', desc: 'Monthly deep-dive: kill underperformers, increase budget on winners, expand into new audiences.' }
    ],
    results: [{ num: '3–8×', label: 'Average ROAS' }, { num: '5–7', label: 'Days to launch' }, { num: 'Weekly', label: 'Performance reports' }, { num: '↓40%', label: 'Avg cost per lead' }],
    faqs: [
      { q: "What's the minimum ad spend I should budget?", a: 'We recommend a minimum of ₹15,000/month in ad spend for Google Ads and ₹10,000/month for Meta Ads.' },
      { q: 'Do you handle creatives and copywriting?', a: 'Yes. Our team writes ad copy and designs static and video creatives. For video ads, we\'ll need raw footage from you.' },
      { q: 'Can I see the ad account myself?', a: 'Always. Your ad account is yours. We set everything up under your Google/Meta account so you have full visibility and ownership.' },
      { q: 'How quickly will I see results?', a: 'Google Search ads can generate leads within days of launch. Meta ads often take 1–2 weeks to exit the learning phase.' }
    ]
  },
  {
    id: 'social', order: 5, icon: '📸', color: '#a855f7', color2: '#f472b6',
    name: 'Social Media Marketing',
    tagline: 'Content creation, daily posting, reels, stories and community management. We grow your audience.',
    badge: 'Social Media',
    heroTitle: 'Social Media That\nBuilds an Audience\nWhile You Work',
    description: 'We handle everything — content strategy, daily posts, reels, stories, and community engagement. You run your business; we grow your brand online with a consistent, quality presence that turns followers into customers.',
    startingFrom: '₹8,000', priceNote: 'Per month',
    quickFeatures: ['Daily posts + stories + reels', 'Custom content calendar', 'Community management', 'Monthly growth report'],
    included: [
      { icon: '🗓️', title: 'Content Calendar', desc: 'A monthly content plan built around your business goals, upcoming promotions, and audience interests — approved by you before we post.' },
      { icon: '🎬', title: 'Reels & Video Content', desc: 'Short-form video content designed for maximum reach — scripted, edited, and optimized for Instagram and YouTube Shorts algorithms.' },
      { icon: '🖼️', title: 'Graphic Design', desc: 'On-brand graphics for every post, story, and carousel — consistent visual identity that makes your profile look professional.' },
      { icon: '💬', title: 'Community Management', desc: 'We respond to comments and DMs within business hours, handle reviews, and keep your audience engaged and growing.' },
      { icon: '#️⃣', title: 'Hashtag & SEO Strategy', desc: 'Platform-specific hashtag research and profile optimization to maximize organic discovery and reach on every post.' },
      { icon: '📈', title: 'Monthly Growth Report', desc: 'Follower growth, reach, engagement rate, and top-performing content — with recommendations for the month ahead.' }
    ],
    steps: [
      { title: 'Brand onboarding', desc: 'We learn your brand voice, study your competitors, and align on what content style fits your audience and goals.' },
      { title: 'Month 1 calendar', desc: 'We present a full month of planned content for your approval — posts, reels, stories, and caption directions.' },
      { title: 'Create & schedule', desc: "Content is designed, written, and scheduled. Everything goes through your approval before it's posted." },
      { title: 'Engage & report', desc: "We manage day-to-day engagement and send you a monthly performance report with what's working and what we're changing." }
    ],
    results: [{ num: '+340%', label: 'Avg follower growth' }, { num: '30+', label: 'Posts per month' }, { num: '5×', label: 'Avg engagement lift' }, { num: 'Daily', label: 'Active management' }],
    faqs: [
      { q: 'Which platforms do you manage?', a: 'We primarily manage Instagram, Facebook, and LinkedIn. YouTube Shorts management is available as an add-on.' },
      { q: 'Can I still post on my own accounts?', a: "Of course. We work alongside you. We'll just coordinate so your personal posts align with the content calendar." },
      { q: 'Do you provide the video footage for reels?', a: 'For product or location-specific reels, we\'ll need raw footage from you. We handle scripting, editing, music, captions, and optimization.' },
      { q: 'How long until I see follower growth?', a: 'Most clients see meaningful growth within 60–90 days of consistent posting. Social media is a compounding channel.' }
    ]
  },
  {
    id: 'automation', order: 6, icon: '⚙️', color: '#22d3ee', color2: '#a855f7',
    name: 'Business Automation',
    tagline: 'Automate lead outreach, follow-ups, WhatsApp campaigns, and more. Save hours every day and scale faster.',
    badge: 'Business Automation',
    heroTitle: 'Automate the\nRepetitive. Scale\nWithout Headcount.',
    description: 'Stop spending hours on follow-ups, lead outreach, and manual tasks. We build automation systems that work for you 24/7 — WhatsApp campaigns, email sequences, CRM workflows, and more.',
    startingFrom: '₹20,000', priceNote: 'One-time setup fee',
    quickFeatures: ['WhatsApp & email automation', 'CRM setup and integration', 'Lead follow-up sequences', 'Custom workflow development'],
    included: [
      { icon: '💬', title: 'WhatsApp Automation', desc: 'Automated WhatsApp messages for lead follow-ups, appointment reminders, order updates, and promotional campaigns.' },
      { icon: '📧', title: 'Email Sequences', desc: 'Drip campaigns, welcome series, re-engagement sequences, and transactional emails — all automated and personalized at scale.' },
      { icon: '🗃️', title: 'CRM Integration', desc: 'We set up or integrate your CRM (HubSpot, Zoho, Notion, Airtable, etc.) and connect it to your lead sources and communication tools.' },
      { icon: '🌱', title: 'Lead Nurturing Flows', desc: 'Multi-step workflows that automatically qualify, nurture, and route leads based on their behaviour.' },
      { icon: '🔌', title: 'Tool & API Integrations', desc: 'We connect your tools — website, forms, WhatsApp, email, calendar, payment gateway — so data flows automatically.' },
      { icon: '🧩', title: 'Custom Workflow Design', desc: 'Every automation is mapped, documented, and tested before going live. You get a visual workflow diagram and full documentation.' }
    ],
    steps: [
      { title: 'Workflow audit', desc: 'We map out your current manual processes and identify which tasks are best suited for automation with the highest ROI.' },
      { title: 'Automation design', desc: 'We design the automation flows and present them visually for your approval before building anything.' },
      { title: 'Build & integrate', desc: 'We build and connect all your tools. Each automation is tested thoroughly before we flip the switch.' },
      { title: 'Handover & training', desc: 'We walk you through how everything works and provide documentation so your team can manage it independently.' }
    ],
    results: [{ num: '10+', label: 'Hours saved per week' }, { num: '24/7', label: 'Always working' }, { num: '50+', label: 'Daily auto-messages' }, { num: '↑3×', label: 'Lead response speed' }],
    faqs: [
      { q: 'Do I need any technical knowledge to manage the automations?', a: 'No. We build and test everything, then provide simple training and documentation. Most automations run completely hands-off.' },
      { q: 'Which tools can you automate?', a: 'We work with WhatsApp (official Business API), Gmail, Outlook, Mailchimp, Zoho, HubSpot, Notion, Airtable, Google Sheets, Razorpay, WooCommerce, Shopify, and more.' },
      { q: 'Is WhatsApp bulk messaging allowed?', a: 'Yes — using the official WhatsApp Business API. This is fully compliant and avoids any risk of account bans. We handle the API setup.' },
      { q: 'Can automations be modified after setup?', a: 'Yes. We offer a monthly support retainer for tweaks, additions, and troubleshooting. Most small changes handled in 24–48 hours.' }
    ]
  },
  {
    id: 'leads', order: 7, icon: '🧲', color: '#f472b6', color2: '#22d3ee',
    name: 'Lead Generation',
    tagline: 'We find your ideal customers, enrich their contact data, and deliver qualified leads to your inbox daily.',
    badge: 'Lead Generation',
    heroTitle: 'Qualified Leads\nDelivered to Your\nInbox Daily.',
    description: 'We find your ideal customers, verify their contact information, and deliver ready-to-contact leads every day. Stop chasing cold, unqualified prospects — get leads that match exactly who you want to sell to.',
    startingFrom: '₹10,000', priceNote: 'Per month',
    quickFeatures: ['B2B & B2C lead sourcing', 'Verified email & phone data', 'LinkedIn prospecting included', 'Weekly lead delivery'],
    included: [
      { icon: '🎯', title: 'Ideal Customer Profile', desc: 'We work with you to define exactly who your ideal customer is — industry, company size, job title, location, and buying signals.' },
      { icon: '🗄️', title: 'Database Building', desc: 'We source leads from LinkedIn Sales Navigator, industry databases, and web scraping — filtered to match your ICP with precision.' },
      { icon: '✅', title: 'Contact Verification', desc: 'Every email address and phone number is verified for deliverability before it reaches you — no bounces, no dead numbers.' },
      { icon: '💼', title: 'LinkedIn Outreach', desc: 'Personalized connection requests and message sequences on LinkedIn to warm up high-value prospects before your sales team reaches out.' },
      { icon: '✉️', title: 'Cold Email Campaigns', desc: 'Carefully crafted cold email sequences sent from warmed-up domains — designed for opens, replies, and booked calls.' },
      { icon: '📋', title: 'Enriched Lead Sheets', desc: 'Leads delivered weekly in a clean spreadsheet or CRM-ready format — name, company, title, email, phone, LinkedIn, and additional context.' }
    ],
    steps: [
      { title: 'Define your ICP', desc: 'We map out exactly who your ideal customer is — the more specific, the better the lead quality.' },
      { title: 'Build the pipeline', desc: 'We start sourcing and verifying leads that match your criteria. First batch delivered within 5 business days.' },
      { title: 'Weekly delivery', desc: 'Fresh leads delivered every week in your preferred format — spreadsheet, CRM, or directly to your inbox.' },
      { title: 'Optimize targeting', desc: 'Based on your feedback on lead quality, we refine targeting every month to continuously improve match rate.' }
    ],
    results: [{ num: '100+', label: 'Leads per month' }, { num: '95%', label: 'Email deliverability' }, { num: '5 days', label: 'First batch turnaround' }, { num: '↑40%', label: 'Avg reply rate' }],
    faqs: [
      { q: 'How many leads can I expect per month?', a: 'It depends on your target market size. Most clients receive 100–300 verified leads per month.' },
      { q: 'Are the leads exclusive to me?', a: "Yes. Every lead we source for you is exclusively yours. We don't resell or share lead lists between clients in the same industry." },
      { q: 'Do you reach out to leads on my behalf?', a: 'Yes. Our LinkedIn outreach and cold email services include personalized outreach from your brand, so you get warm replies.' },
      { q: 'What industries do you specialise in?', a: "We've generated leads for real estate, SaaS, consulting, manufacturing, e-commerce, healthcare, and education." }
    ]
  },
  {
    id: 'analytics', order: 8, icon: '📊', color: '#f59e0b', color2: '#10b981',
    name: 'Analytics & Reporting',
    tagline: "Clear monthly reports showing exactly what's working, what we're doing next, and how your business is growing.",
    badge: 'Analytics & Reporting',
    heroTitle: "Know Exactly\nWhat's Working\nand What's Not.",
    description: 'We set up complete analytics infrastructure for your business and deliver clear monthly reports that turn raw data into decisions. No vanity metrics — just insights that tell you where to invest next.',
    startingFrom: '₹5,000', priceNote: 'Per month',
    quickFeatures: ['GA4 & Search Console setup', 'Custom dashboard creation', 'Monthly strategy report', 'Conversion tracking included'],
    included: [
      { icon: '📊', title: 'GA4 & Analytics Setup', desc: 'Proper Google Analytics 4 setup with custom events, goals, and funnels — configured correctly so your data is reliable.' },
      { icon: '🔎', title: 'Google Search Console', desc: 'Search Console setup and monitoring to track your organic keyword rankings, click-through rates, and technical site health.' },
      { icon: '🖥️', title: 'Custom Dashboard', desc: 'A single live dashboard in Looker Studio that shows all your key metrics in one place — updated in real time.' },
      { icon: '🎯', title: 'Conversion Tracking', desc: 'We track form submissions, calls, purchases, and micro-conversions — so you know exactly which channels are driving revenue.' },
      { icon: '🧠', title: 'Monthly Strategy Report', desc: 'A plain-English monthly report covering what happened, why it happened, and what to do next. Designed for business owners.' },
      { icon: '🎓', title: 'Analytics Training', desc: 'We teach you and your team how to read the reports and make data-driven decisions without relying on us for every question.' }
    ],
    steps: [
      { title: 'Audit existing setup', desc: "We check what's already tracking correctly (often very little) and fix it before building on a broken foundation." },
      { title: 'Implement tracking', desc: 'We set up GA4, GTM, pixels, conversion tracking, and your custom dashboard — usually within 5 business days.' },
      { title: 'Baseline report', desc: 'We deliver a baseline report showing where you stand today — traffic, conversions, top channels, and biggest opportunities.' },
      { title: 'Monthly reporting cadence', desc: 'Every month: performance review, anomaly explanations, and a clear set of recommendations for the next 30 days.' }
    ],
    results: [{ num: '100%', label: 'Data accuracy' }, { num: '1', label: 'Dashboard for everything' }, { num: 'Monthly', label: 'Strategy reviews' }, { num: '↑25%', label: 'Avg decision speed' }],
    faqs: [
      { q: 'Do I need any existing analytics setup?', a: "No. We start from scratch if needed. If you already have GA4 or other tools set up, we'll audit and fix any tracking issues." },
      { q: 'Which tools do you use for reporting?', a: 'We primarily use Google Analytics 4, Google Search Console, Looker Studio, and Meta Pixel. We can also integrate with HubSpot, Shopify, or your custom CRM.' },
      { q: 'Will I be able to understand the reports?', a: "That's the whole point. Our reports are written for business owners, not analysts. We explain what the numbers mean in plain language." },
      { q: 'Can you connect data from multiple channels?', a: 'Yes. We can pull data from your website, ads accounts, social media, and e-commerce platform into a single unified dashboard.' }
    ]
  }
];

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      let list = await kv.get(KV_KEY);
      if (!list || !Array.isArray(list) || list.length === 0) {
        list = SEED;
        await kv.set(KV_KEY, list);
      }
      res.status(200).json(list);
      return;
    }

    // All write operations require a valid admin session token
    if (!requireAuth(req)) {
      res.status(401).json({ error: 'Unauthorized. Please log in again.' });
      return;
    }

    let list = await kv.get(KV_KEY);
    if (!list || !Array.isArray(list)) list = SEED;

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body || '{}'); } catch { body = {}; }
      }
      body = body || {};

      if (!body.name || !String(body.name).trim()) {
        res.status(400).json({ error: 'A service name is required.' });
        return;
      }

      let id = slugify(body.id || body.name);
      if (!id) {
        res.status(400).json({ error: 'Could not generate a valid ID from that name.' });
        return;
      }
      if (list.some(s => s.id === id)) {
        res.status(409).json({ error: `A service with the ID "${id}" already exists. Choose a different name or ID.` });
        return;
      }

      const maxOrder = list.reduce((m, s) => Math.max(m, Number(s.order) || 0), 0);
      const newService = { ...emptyDefaults(), ...body, id, order: body.order || maxOrder + 1 };

      list.push(newService);
      await kv.set(KV_KEY, list);
      res.status(201).json(newService);
      return;
    }

    if (req.method === 'PUT') {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body || '{}'); } catch { body = {}; }
      }
      body = body || {};

      const id = body.id;
      if (!id) {
        res.status(400).json({ error: 'Missing service id.' });
        return;
      }
      const idx = list.findIndex(s => s.id === id);
      if (idx === -1) {
        res.status(404).json({ error: 'Service not found.' });
        return;
      }
      list[idx] = { ...list[idx], ...body, id };
      await kv.set(KV_KEY, list);
      res.status(200).json(list[idx]);
      return;
    }

    if (req.method === 'DELETE') {
      const id = req.query && req.query.id;
      if (!id) {
        res.status(400).json({ error: 'Missing service id in query string (?id=...).' });
        return;
      }
      const next = list.filter(s => s.id !== id);
      if (next.length === list.length) {
        res.status(404).json({ error: 'Service not found.' });
        return;
      }
      await kv.set(KV_KEY, next);
      res.status(200).json({ success: true });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('services API error:', err);
    res.status(500).json({
      error: 'Server error. If this is your first deploy, make sure Vercel KV is connected to this project.',
      detail: String((err && err.message) || err)
    });
  }
};
