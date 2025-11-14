export type AccessType = 'FREE' | 'FREEMIUM' | 'STUDENT_DISCOUNT';

export interface AITool {
  name: string;
  description: string;
  link: string;
  access: AccessType;
  examplePrompt: string;
  useCase: string;
}

export interface FieldTools {
  field: string;
  slug: string;
  blurb: string;
  tools: AITool[];
}

export const aiFields: FieldTools[] = [
  {
    field: 'Biology/Life Sciences',
    slug: 'biology-life-sciences',
    blurb: 'Protein prediction, lab prep, and evidence-based research helpers for life science majors.',
    tools: [
      {
        name: 'AlphaFold 3',
        description: 'Predict 3D protein structures with near-experimental accuracy.',
        link: 'https://alphafoldserver.com',
        access: 'FREE',
        examplePrompt: 'Upload a protein sequence to generate its predicted structure.',
        useCase: 'Understanding disease mechanisms, drug design pipelines.',
      },
      {
        name: 'NotebookLM',
        description: 'AI research assistant that synthesizes uploaded papers and notes.',
        link: 'https://notebooklm.google.com',
        access: 'FREE',
        examplePrompt: 'Upload 3 biology papers and ask it to compare methodologies.',
        useCase: 'Fast literature reviews, connecting findings across PDFs.',
      },
      {
        name: 'Consensus',
        description: 'AI-powered search engine for peer-reviewed research papers.',
        link: 'https://consensus.app',
        access: 'FREEMIUM',
        examplePrompt: 'Does caffeine improve cognitive function?',
        useCase: 'Finding scientific evidence for new hypotheses.',
      },
      {
        name: 'Elicit',
        description: 'Automates literature reviews by extracting insights from papers.',
        link: 'https://elicit.com',
        access: 'FREEMIUM',
        examplePrompt: 'What are the main findings on CRISPR gene editing?',
        useCase: 'Synthesizing research and generating experiment ideas.',
      },
    ],
  },
  {
    field: 'Computer Science',
    slug: 'computer-science',
    blurb: 'Code copilots, search companions, and UI builders for dev workflows.',
    tools: [
      {
        name: 'Cursor',
        description: 'AI-first code editor that understands your entire codebase.',
        link: 'https://cursor.sh',
        access: 'FREEMIUM',
        examplePrompt: "Ask it: 'Add error handling to all API calls.'",
        useCase: 'Speeding up refactors and debugging.',
      },
      {
        name: 'v0',
        description: 'Generates production-ready React components from descriptions.',
        link: 'https://v0.dev',
        access: 'FREEMIUM',
        examplePrompt: 'Create a responsive pricing card with three tiers.',
        useCase: 'Rapid UI prototyping and benchmarking designs.',
      },
      {
        name: 'Perplexity',
        description: 'AI search with real-time citations tuned for technical research.',
        link: 'https://perplexity.ai',
        access: 'FREEMIUM',
        examplePrompt: "What's the difference between REST and GraphQL APIs?",
        useCase: 'Staying current with frameworks and research.',
      },
      {
        name: 'Replit Agent',
        description: 'Builds entire applications from natural language prompts.',
        link: 'https://replit.com',
        access: 'FREEMIUM',
        examplePrompt: 'Build a todo app with Firebase backend.',
        useCase: 'Learning new stacks and prototyping quickly.',
      },
      {
        name: 'Phind',
        description: 'Developer-focused AI search with runnable examples.',
        link: 'https://phind.com',
        access: 'FREE',
        examplePrompt: 'How do I implement OAuth in Next.js?',
        useCase: 'Debugging and comparing implementation patterns.',
      },
    ],
  },
  {
    field: 'Theater & Performing Arts',
    slug: 'theater-performing-arts',
    blurb: 'Storyboarding, staging, and post-production helpers for performances.',
    tools: [
      {
        name: 'RunwayML',
        description: 'AI video generation and editing for stage concepts and backdrops.',
        link: 'https://runwayml.com',
        access: 'FREEMIUM',
        examplePrompt: "Generate: 'A mystical forest backdrop with moving fog.'",
        useCase: 'Set design visualization and dynamic projection content.',
      },
      {
        name: 'ElevenLabs',
        description: 'Ultra-realistic voice AI and sound effects generation.',
        link: 'https://elevenlabs.io',
        access: 'STUDENT_DISCOUNT',
        examplePrompt: 'Clone a voice or generate character dialogue.',
        useCase: 'Voice acting, sound design, and accessibility tracks.',
      },
      {
        name: 'Descript',
        description: 'Edit audio/video by editing text transcripts.',
        link: 'https://descript.com',
        access: 'FREEMIUM',
        examplePrompt: 'Upload a rehearsal recording and remove filler words.',
        useCase: 'Cutting trailers, polishing narration, fast edits.',
      },
      {
        name: 'Synthesia',
        description: 'Create AI avatar videos from text scripts.',
        link: 'https://synthesia.io',
        access: 'FREEMIUM',
        examplePrompt: 'Generate a video of an avatar explaining blocking.',
        useCase: 'Educational explainers or casting announcements.',
      },
      {
        name: 'CapCut',
        description: 'Free video editor with AI auto-captions and effects.',
        link: 'https://capcut.com',
        access: 'FREE',
        examplePrompt: 'Upload a performance clip and add auto-generated captions.',
        useCase: 'Social content creation and accessibility captions.',
      },
    ],
  },
  {
    field: 'Visual Arts & Design',
    slug: 'visual-arts-design',
    blurb: 'Illustration, typography, and layout copilots for portfolios and shows.',
    tools: [
      {
        name: 'Leonardo.ai',
        description: 'AI art with custom model training tuned to your style.',
        link: 'https://leonardo.ai',
        access: 'FREEMIUM',
        examplePrompt: 'Generate a cyberpunk cityscape in watercolor style.',
        useCase: 'Concept art and maintaining cohesive style guides.',
      },
      {
        name: 'Ideogram',
        description: 'Generative art that can finally render legible typography.',
        link: 'https://ideogram.ai',
        access: 'FREEMIUM',
        examplePrompt: "Create a poster with the text 'ART SHOW 2025'.",
        useCase: 'Poster design, type treatments, merch previews.',
      },
      {
        name: 'Remove.bg',
        description: 'Instant AI background removal with batch processing.',
        link: 'https://remove.bg',
        access: 'FREEMIUM',
        examplePrompt: 'Upload any image to remove its background.',
        useCase: 'Product photos, quick edits, mockups.',
      },
      {
        name: 'Canva Magic Studio',
        description: 'All-in-one design platform with AI image generation and editing.',
        link: 'https://canva.com',
        access: 'FREEMIUM',
        examplePrompt: 'Generate a social media post template for a club event.',
        useCase: 'Social campaigns, pitch decks, branding kits.',
      },
      {
        name: 'Vectorizer.AI',
        description: 'Converts rasters to scalable vector art automatically.',
        link: 'https://vectorizer.ai',
        access: 'FREEMIUM',
        examplePrompt: 'Upload a logo to convert it to SVG.',
        useCase: 'Logo refreshes and print-ready art.',
      },
    ],
  },
  {
    field: 'Business & Economics',
    slug: 'business-economics',
    blurb: 'Deck builders, research copilots, and spreadsheet crunchers.',
    tools: [
      {
        name: 'Claude',
        description: 'Great for complex analysis, writing, and modeling.',
        link: 'https://claude.ai',
        access: 'FREEMIUM',
        examplePrompt: "Analyze this company's quarterly report and identify trends.",
        useCase: 'Data storytelling, executive summaries, memos.',
      },
      {
        name: 'Julius AI',
        description: 'Specialized data analysis with instant visualizations.',
        link: 'https://julius.ai',
        access: 'FREEMIUM',
        examplePrompt: 'Upload a dataset and ask for a trend analysis.',
        useCase: 'Lightweight BI, charts, automated writeups.',
      },
      {
        name: 'Gamma',
        description: 'AI presentation builder that creates slides from prompts.',
        link: 'https://gamma.app',
        access: 'FREEMIUM',
        examplePrompt: 'Create a pitch deck about sustainable fashion.',
        useCase: 'Pitch decks, quick presentations, report refreshes.',
      },
      {
        name: 'Perplexity',
        description: 'AI search with citations tuned for market research.',
        link: 'https://perplexity.ai',
        access: 'FREEMIUM',
        examplePrompt: 'What are current trends in e-commerce?',
        useCase: 'Competitive analysis and sourcing credible data.',
      },
    ],
  },
  {
    field: 'Humanities & Social Sciences',
    slug: 'humanities-social',
    blurb: 'Source hunters, argument helpers, and lecture transcription buddies.',
    tools: [
      {
        name: 'NotebookLM',
        description: 'Synthesizes your research papers into summaries and discussions.',
        link: 'https://notebooklm.google.com',
        access: 'FREE',
        examplePrompt: 'Upload 3 philosophy papers and compare arguments.',
        useCase: 'Literature reviews and outlining essays.',
      },
      {
        name: 'Elicit',
        description: 'Automates academic literature reviews with citations.',
        link: 'https://elicit.com',
        access: 'FREEMIUM',
        examplePrompt: 'What factors influence voter turnout?',
        useCase: 'Research synthesis and source gathering.',
      },
      {
        name: 'Consensus',
        description: 'Search engine focused on peer-reviewed academic research.',
        link: 'https://consensus.app',
        access: 'FREEMIUM',
        examplePrompt: 'Does social media increase political polarization?',
        useCase: 'Finding credible evidence fast.',
      },
      {
        name: 'Claude',
        description: 'Great for essay outlining, argument analysis, and nuanced writing.',
        link: 'https://claude.ai',
        access: 'FREEMIUM',
        examplePrompt: "Help me outline an essay on Foucault's concept of power.",
        useCase: 'Essay planning, editing, study guides.',
      },
      {
        name: 'Otter.ai',
        description: 'Real-time lecture transcription with searchable notes.',
        link: 'https://otter.ai',
        access: 'STUDENT_DISCOUNT',
        examplePrompt: 'Record a lecture and get searchable transcription.',
        useCase: 'Interview capture, lecture notes, accessibility.',
      },
    ],
  },
  {
    field: 'General / Not Sure',
    slug: 'general',
    blurb: 'Starter kit of tools if you just want to explore what AI can do.',
    tools: [
      {
        name: 'Claude',
        description: 'High-reasoning model for writing, coding, and analysis.',
        link: 'https://claude.ai',
        access: 'FREEMIUM',
        examplePrompt: "Explain quantum computing like I'm five.",
        useCase: 'Research, writing, coding, brainstorming.',
      },
      {
        name: 'Perplexity',
        description: 'Citation-backed AI search with current info.',
        link: 'https://perplexity.ai',
        access: 'FREEMIUM',
        examplePrompt: "What's the latest research on climate change?",
        useCase: 'Quick answers with sources.',
      },
      {
        name: 'NotebookLM',
        description: 'Works with your documents—upload PDFs and get a study guide.',
        link: 'https://notebooklm.google.com',
        access: 'FREE',
        examplePrompt: 'Upload study materials and generate a study guide.',
        useCase: 'Exam prep, class summaries, flashcard seeds.',
      },
      {
        name: 'Gamma',
        description: 'Creates beautiful presentations from short prompts.',
        link: 'https://gamma.app',
        access: 'FREEMIUM',
        examplePrompt: 'Make a presentation about renewable energy.',
        useCase: 'Last-minute decks, posters, workshop slides.',
      },
      {
        name: 'Otter.ai',
        description: 'Transcribes lectures and meetings in real time.',
        link: 'https://otter.ai',
        access: 'STUDENT_DISCOUNT',
        examplePrompt: 'Record any lecture for searchable notes.',
        useCase: 'Note-taking and studying.',
      },
    ],
  },
];

export const advancedTools = [
  {
    name: 'BenevolentAI',
    description: 'Drug discovery AI platform (research access only).',
    link: 'https://www.benevolent.com/',
  },
  {
    name: 'Evo 2',
    description: 'Open-source protein prediction suite for advanced researchers.',
    link: 'https://www.evolutionaryscale.ai/',
  },
  {
    name: 'Midjourney v6',
    description: 'Top-tier AI art engine available via paid Discord subscription.',
    link: 'https://www.midjourney.com/',
  },
];
