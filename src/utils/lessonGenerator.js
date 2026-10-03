/**
 * Apportions totalMinutes among sections using the Hamilton-Hare Largest Remainder Method.
 * Guarantees that:
 * 1. sum(sectionMinutes) === totalMinutes
 * 2. each active section receives at least 1 minute
 * 3. all minutes are whole positive integers.
 */
export function allocateMinutes(totalMinutes, weights) {
  const k = weights.length;
  if (!totalMinutes || totalMinutes <= 0) {
    return [];
  }

  const cleanTotal = Math.round(totalMinutes);

  // If totalMinutes is less than the number of sections,
  // allocate 1 minute each to the first totalMinutes sections
  if (cleanTotal < k) {
    const res = new Array(k).fill(0);
    for (let i = 0; i < cleanTotal; i++) {
      res[i] = 1;
    }
    return res;
  }

  // Normalize weights
  const sumWeights = weights.reduce((a, b) => a + b, 0);
  const normWeights = weights.map((w) => w / sumWeights);

  // Each section gets at least 1 minute baseline
  const baseline = 1;
  const remaining = cleanTotal - k * baseline;

  // Distribute remaining minutes according to weights
  const floatShares = normWeights.map((w) => remaining * w);
  const floorShares = floatShares.map((s) => Math.floor(s));
  const remainders = floatShares.map((s, idx) => ({
    index: idx,
    remainder: s - floorShares[idx],
  }));

  const allocated = floorShares.reduce((a, b) => a + b, 0);
  const leftover = remaining - allocated;

  // Sort by remainder descending
  remainders.sort((a, b) => b.remainder - a.remainder || a.index - b.index);

  const finalAllocations = floorShares.map((s) => s + baseline);
  for (let i = 0; i < leftover; i++) {
    const targetIdx = remainders[i % k].index;
    finalAllocations[targetIdx] += 1;
  }

  return finalAllocations;
}

const FRAMEWORK_TEMPLATES = {
  direct_instruction: [
    {
      name: 'Hook & Prior Knowledge Activation',
      phase: 'Engage',
      defaultWeight: 0.15,
      objectiveTemplate: (topic) => `Connect prior learning to ${topic} via an engaging inquiry prompt or real-world problem.`,
      teacherActionTemplate: (topic, level) =>
        `Present a puzzling visual, relatable question, or 90-second case challenge connected to ${topic}. Pose a targeted check prompt for ${level} students.`,
      studentActionTemplate: () =>
        `Write down quick initial observations in notebooks; participate in a 60-second Think-Pair-Share with an elbow partner.`,
      formativeCheckTemplate: (topic) => `Cold call 2-3 pairs or collect 30-second thumb/index card signal on readiness for ${topic}.`,
      differentiation: {
        support: 'Provide sentence stems: "I noticed... because..." and a visual anchor chart.',
        extension: 'Ask students to formulate a counter-hypothesis or real-world complication.',
      },
    },
    {
      name: 'Direct Modeling & Concept Deconstruction',
      phase: 'I Do',
      defaultWeight: 0.25,
      objectiveTemplate: (topic) => `Model core principles, key vocabulary, and explicit step-by-step methodology for ${topic}.`,
      teacherActionTemplate: (topic) =>
        `Think aloud at the board: unpack primary mechanisms of ${topic}. Break down complex steps and visually highlight non-examples and common pitfalls.`,
      studentActionTemplate: () =>
        `Active dual-coding notes: copy the visual model or graphic organizer while annotating the teacher's procedural cues.`,
      formativeCheckTemplate: (topic) => `Pose an intentional "Spot the Error" check where the teacher deliberately demonstrates a mistake in ${topic}.`,
      differentiation: {
        support: 'Pre-filled guided notes with fill-in-the-blank key terms and highlighted steps.',
        extension: 'Prompt student to explain why step 2 must precede step 3 in alternate frameworks.',
      },
    },
    {
      name: 'Guided Practice & Collaborative Application',
      phase: 'We Do',
      defaultWeight: 0.30,
      objectiveTemplate: (topic) => `Apply the concepts of ${topic} through scaffolded partner tasks and real-time feedback loops.`,
      teacherActionTemplate: (topic) =>
        `Circulate systematically across the classroom with an observation clipboard. Offer targeted micro-interventions and prompt student justification.`,
      studentActionTemplate: () =>
        `Pairs work collaboratively on 2-3 scaffolded problem scenarios or analysis prompts, verbalizing their reasoning before writing final answers.`,
      formativeCheckTemplate: (topic) => `Quick whiteboard flash or simultaneous table-group response check for comprehension on ${topic}.`,
      differentiation: {
        support: 'Strategic peer pairing; step-by-step checklist card on desk for quick reference.',
        extension: 'Provide a "Challenge Problem" introducing an unusual edge case or compound variable.',
      },
    },
    {
      name: 'Independent Mastery & Synthesis',
      phase: 'You Do',
      defaultWeight: 0.20,
      objectiveTemplate: (topic) => `Demonstrate solo mastery of ${topic} through unassisted problem-solving or analysis.`,
      teacherActionTemplate: () =>
        `Maintain quiet focus environment; conduct targeted 2-minute pull-aside coaching for students identified during guided practice.`,
      studentActionTemplate: () =>
        `Work completely independently on 2-3 core practice items, applying self-checking criteria before submitting.`,
      formativeCheckTemplate: (topic) => `Review 5 random student submissions live to assess individual proficiency on ${topic}.`,
      differentiation: {
        support: 'Allow access to reference cheat-sheet or formula card with annotated examples.',
        extension: 'Create a synthetic scenario applying the topic to design an original solution.',
      },
    },
    {
      name: 'Closure & Formative Exit Ticket',
      phase: 'Evaluate',
      defaultWeight: 0.10,
      objectiveTemplate: (topic) => `Synthesize core takeaway for ${topic} and generate immediate diagnostic data for tomorrow's instruction.`,
      teacherActionTemplate: (topic) =>
        `Prompt students to summarize the central takeaway of ${topic} and collect individual exit slips at the door.`,
      studentActionTemplate: () =>
        `Complete a 2-question Exit Slip independently: 1 procedural calculation/question and 1 conceptual reflection sentence.`,
      formativeCheckTemplate: (topic) => `100% submission rate; sort exit slips into 3 piles: Mastery, Approaching, Needs Reteach.`,
      differentiation: {
        support: 'Choice of verbal summary to teacher or bullet-point format instead of paragraph.',
        extension: 'Write one question that builds beyond today’s lesson for future exploration.',
      },
    },
  ],

  five_e: [
    {
      name: 'Phase 1: Engage (Spark & Uncover)',
      phase: 'Engage',
      defaultWeight: 0.15,
      objectiveTemplate: (topic) => `Spark curiosity and surface existing mental models regarding ${topic}.`,
      teacherActionTemplate: (topic) =>
        `Present a discrepancy event, surprising data visualization, or real-world paradox centered around ${topic}.`,
      studentActionTemplate: () =>
        `Record predictions in their science/inquiry journals and defend initial stances in small table groups.`,
      formativeCheckTemplate: () => `Poll the room to chart distribution of initial student predictions.`,
      differentiation: {
        support: 'Visual graphic organizer linking prior everyday life experiences.',
        extension: 'Ask students to pinpoint the underlying variable causing the paradox.',
      },
    },
    {
      name: 'Phase 2: Explore (Hands-on Inquiry)',
      phase: 'Explore',
      defaultWeight: 0.25,
      objectiveTemplate: (topic) => `Investigate properties, patterns, and relationships in ${topic} through guided exploration.`,
      teacherActionTemplate: () =>
        `Facilitate student discovery by asking probing questions without directly giving away the formal answers.`,
      studentActionTemplate: () =>
        `Collaborate in groups of 3 to manipulate materials, analyze source texts, or test simulated parameters.`,
      formativeCheckTemplate: () => `Audit group data sheets and prompt justification for emerging patterns.`,
      differentiation: {
        support: 'Pre-structured investigation table with labeled columns and role cards.',
        extension: 'Task group with altering a secondary parameter to test system resilience.',
      },
    },
    {
      name: 'Phase 3: Explain (Formalize & Codify)',
      phase: 'Explain',
      defaultWeight: 0.25,
      objectiveTemplate: (topic) => `Introduce formal academic vocabulary and synthesize collective findings on ${topic}.`,
      teacherActionTemplate: (topic) =>
        `Bridge student observations to formal academic definitions, principles, and mathematical representations of ${topic}.`,
      studentActionTemplate: () =>
        `Present group explanations to the class; refine their personal definitions using formal academic terms.`,
      formativeCheckTemplate: (topic) => `Interactive vocabulary check: identify how terms map directly to the exploration phase.`,
      differentiation: {
        support: 'Bilingual / visual glossaries with pictorial representations.',
        extension: 'Synthesize how conflicting data from Phase 2 can be reconciled.',
      },
    },
    {
      name: 'Phase 4: Elaborate (Transfer & Deepen)',
      phase: 'Elaborate',
      defaultWeight: 0.20,
      objectiveTemplate: (topic) => `Apply new understanding of ${topic} to a novel, unfamiliar real-world context.`,
      teacherActionTemplate: () =>
        `Pose a transfer scenario that requires recombining today's knowledge with previous units.`,
      studentActionTemplate: () =>
        `Work in pairs to solve the transfer problem, explicitly citing the formal concepts defined in Phase 3.`,
      formativeCheckTemplate: (topic) => `Speed check: 1 representative from each pair presents their transfer rationale.`,
      differentiation: {
        support: 'Provide a partially completed analogical bridge comparing both contexts.',
        extension: 'Formulate an interdisciplinary critique or ethical/technological implication.',
      },
    },
    {
      name: 'Phase 5: Evaluate (Reflect & Assess)',
      phase: 'Evaluate',
      defaultWeight: 0.15,
      objectiveTemplate: (topic) => `Assess mastery of conceptual understanding and self-evaluate growth on ${topic}.`,
      teacherActionTemplate: () =>
        `Administer rubric-based formative assessment and prompt metacognitive reflection on preconceptions.`,
      studentActionTemplate: () =>
        `Complete self-assessment checklist and compare final understanding against the Engage prediction.`,
      formativeCheckTemplate: () => `Analyze student growth delta between Phase 1 predictions and Phase 5 evaluations.`,
      differentiation: {
        support: 'Self-assessment with illustrated descriptor scales.',
        extension: 'Construct a self-graded rubric evaluating alternative explanations.',
      },
    },
  ],

  workshop: [
    {
      name: 'Mini-Lesson & Target Demonstration',
      phase: 'Focus',
      defaultWeight: 0.20,
      objectiveTemplate: (topic) => `Introduce one precise strategy or skill for ${topic} with a tight mentor model.`,
      teacherActionTemplate: (topic) =>
        `Deliver a brisk, high-impact demonstration of the target strategy for ${topic} (under 10 minutes). Model authentic drafting or problem-solving.`,
      studentActionTemplate: () =>
        `Gather at the central workspace or focus screen; participate in active guided rehearsal for 2 minutes before independent release.`,
      formativeCheckTemplate: () => `Check student readiness through quick call-and-response or slate display.`,
      differentiation: {
        support: 'Strategy anchor chart posted prominently in the classroom.',
        extension: 'Challenge student to identify how this strategy shifts across different genres/sub-domains.',
      },
    },
    {
      name: 'Studio Work Time & Teacher Conferencing',
      phase: 'Work Time',
      defaultWeight: 0.60,
      objectiveTemplate: (topic) => `Engage in sustained, deliberate practice on ${topic} with individual coaching checkpoints.`,
      teacherActionTemplate: () =>
        `Conduct 3-4 individual or small-group 3-minute conferences. Record running notes, affirm strengths, and teach one actionable next step.`,
      studentActionTemplate: () =>
        `Work independently or in paired workshops on ongoing projects or problem sets, applying today's mini-lesson strategy.`,
      formativeCheckTemplate: () => `Conference logs documenting specific feedback delivered to target students.`,
      differentiation: {
        support: 'Targeted small group pull-out table with teacher guidance.',
        extension: 'Peer consultation station where advanced students provide constructive critique.',
      },
    },
    {
      name: 'Debrief, Showcase & Synthesis',
      phase: 'Debrief',
      defaultWeight: 0.20,
      objectiveTemplate: (topic) => `Reflect on how today's craft move enhanced work on ${topic} and name future goals.`,
      teacherActionTemplate: () =>
        `Highlight 2 student examples discovered during conferences; lead whole-group debrief on process insights and breakthroughs.`,
      studentActionTemplate: () =>
        `Share a 30-second breakthrough or hurdle with a neighbor; write a 1-sentence reflection on how strategy was utilized.`,
      formativeCheckTemplate: () => `Collect sticky note or digital wall post highlighting one key breakthrough.`,
      differentiation: {
        support: 'Sentence frame: "When I tried [strategy], it helped me solve..."',
        extension: 'Articulate an actionable goal for tomorrow’s independent work block.',
      },
    },
  ],

  socratic: [
    {
      name: 'Framing & Provocative Stance',
      phase: 'Framing',
      defaultWeight: 0.15,
      objectiveTemplate: (topic) => `Establish seminar norms and grapple with an opening interpretive dilemma regarding ${topic}.`,
      teacherActionTemplate: (topic) =>
        `Frame the central essential question on ${topic}. Review active listening norms and pose the initial catalyst prompt.`,
      studentActionTemplate: () =>
        `Review annotated text or source data; independently write a 2-minute position statement supported by at least one piece of evidence.`,
      formativeCheckTemplate: () => `Visual sweep ensuring all students have written their preliminary stance.`,
      differentiation: {
        support: 'Pre-annotated primary text with glossary margin notes and key quotes highlighted.',
        extension: 'Write two contrasting interpretations from opposing philosophical viewpoints.',
      },
    },
    {
      name: 'Text & Source Evidence Mining',
      phase: 'Analysis',
      defaultWeight: 0.25,
      objectiveTemplate: (topic) => `Examine textual evidence and analyze differing perspectives on ${topic}.`,
      teacherActionTemplate: () =>
        `Prompt students to ground claims in specific line citations or data points; mediate transition into circle discussion.`,
      studentActionTemplate: () =>
        `Pair with partner to test arguments and cross-examine evidence before opening whole-group dialogue.`,
      formativeCheckTemplate: () => `Listen to pair exchanges to gauge depth of evidentiary citations.`,
      differentiation: {
        support: 'Sentence stems for collegiate debate: "Building on that...", "Where in the text does it suggest..."',
        extension: 'Identify underlying unstated assumptions in the provided arguments.',
      },
    },
    {
      name: 'Collaborative Seminar Dialogue',
      phase: 'Dialogue',
      defaultWeight: 0.45,
      objectiveTemplate: (topic) => `Participate in student-led, evidence-based academic dialogue exploring complexities of ${topic}.`,
      teacherActionTemplate: () =>
        `Step back into silent observer role; map the discussion flow, track participant contributions, and only intervene if dialogue stalls.`,
      studentActionTemplate: () =>
        `Speak directly to peers without raising hands; actively listen, build upon arguments, respectfully challenge logic, and cite evidence.`,
      formativeCheckTemplate: () => `Sociogram tracking participation frequency and depth of analytical contributions.`,
      differentiation: {
        support: 'Designated "wingman" partner who can help formulate the spoken point before speaking.',
        extension: 'Challenge student to synthesize two seemingly contradictory arguments made during discussion.',
      },
    },
    {
      name: 'Individual Synthesis & Meta-Reflection',
      phase: 'Synthesis',
      defaultWeight: 0.15,
      objectiveTemplate: (topic) => `Synthesize how seminar dialogue altered or deepened personal perspective on ${topic}.`,
      teacherActionTemplate: () =>
        `Provide 5 minutes of focused silence for written synthesis and invite closing one-sentence reflections around the circle.`,
      studentActionTemplate: (topic) =>
        `Write a reflective paragraph answering: "How did today's seminar challenge or expand my original thinking on ${topic}?"`,
      formativeCheckTemplate: () => `Collect synthesis journals evaluating quality of evidence-based shifts in thinking.`,
      differentiation: {
        support: 'Option to sketch a mind-map showing connected arguments rather than prose.',
        extension: 'Propose a follow-up inquiry question for subsequent investigation.',
      },
    },
  ],
};

/**
 * Generates topic-aware metadata, misconceptions, vocabulary, and materials.
 */
export function generateLessonPlan(
  rawTopic = 'General Subject',
  classLevel = 'Middle School (6-8)',
  totalMinutes = 45,
  framework = 'direct_instruction'
) {
  const topic = (rawTopic && String(rawTopic).trim()) || 'Classroom Lesson Topic';
  const cleanMinutes = Math.max(1, Math.round(Number(totalMinutes)));

  const templates = FRAMEWORK_TEMPLATES[framework] || FRAMEWORK_TEMPLATES.direct_instruction;

  // If cleanMinutes is very small, adapt active section count so every active section has >= 1 min
  const activeCount = Math.min(templates.length, Math.max(1, cleanMinutes));
  const activeTemplates = templates.slice(0, activeCount);
  const weights = activeTemplates.map((t) => t.defaultWeight);

  const allocatedMins = allocateMinutes(cleanMinutes, weights);

  // Build lesson sections
  const sections = activeTemplates.map((t, index) => {
    const mins = allocatedMins[index];
    const pct = cleanMinutes > 0 ? Math.round((mins / cleanMinutes) * 100) : 0;
    return {
      id: `sec-${index + 1}`,
      name: t.name,
      phase: t.phase,
      minutes: mins,
      percentage: pct,
      objective: t.objectiveTemplate(topic, classLevel),
      teacherAction: t.teacherActionTemplate(topic, classLevel),
      studentAction: t.studentActionTemplate(topic, classLevel),
      formativeCheck: t.formativeCheckTemplate(topic),
      differentiation: t.differentiation,
    };
  });

  // Verify mathematical sum invariant
  const totalSum = sections.reduce((acc, s) => acc + s.minutes, 0);
  if (totalSum !== cleanMinutes && sections.length > 0) {
    const diff = cleanMinutes - totalSum;
    sections[0].minutes += diff;
  }

  // Topic-aware details
  const topicLower = topic.toLowerCase();
  let materials = [
    { id: 'mat-1', text: `Primary materials & guided notes for ${topic}`, checked: true },
    { id: 'mat-2', text: 'Interactive whiteboard or digital display screen', checked: true },
    { id: 'mat-3', text: 'Printed Exit Ticket slips (1 per student)', checked: true },
    { id: 'mat-4', text: 'Collaborative timer for pacing checkpoints', checked: false },
  ];

  let misconceptions = [
    `Students often confuse core terminology with everyday colloquial definitions in ${topic}.`,
    `Assuming understanding based on passive head-nodding rather than individual written evidence.`,
    `Over-focusing on procedural execution without grasping the underlying conceptual rationale.`,
  ];

  let vocabulary = [`Core Concept: ${topic}`, 'Methodology', 'Synthesis', 'Evidence', 'Application'];

  if (
    topicLower.includes('photosynthesis') ||
    topicLower.includes('bio') ||
    topicLower.includes('cell') ||
    topicLower.includes('science') ||
    topicLower.includes('plant')
  ) {
    materials = [
      { id: 'mat-1', text: 'Diagram handouts of cellular / biological processes', checked: true },
      { id: 'mat-2', text: 'Interactive digital simulation or lab apparatus', checked: true },
      { id: 'mat-3', text: 'Color-coded molecule/structure modeling cards', checked: false },
      { id: 'mat-4', text: 'Exit ticket diagnostic on input/output energy cycles', checked: true },
    ];
    misconceptions = [
      'Believing plants obtain their primary physical mass from soil rather than carbon dioxide from the air.',
      'Confusing cellular respiration with photosynthesis as opposite and mutually exclusive processes.',
      'Thinking sunlight is a chemical reactant rather than the energy catalyst driving the reaction.',
    ];
    vocabulary = ['Chloroplast', 'Light-Dependent Reactions', 'Calvin Cycle', 'ATP / NADPH', 'Stomata'];
  } else if (
    topicLower.includes('fraction') ||
    topicLower.includes('math') ||
    topicLower.includes('algebra') ||
    topicLower.includes('geometry') ||
    topicLower.includes('equation') ||
    topicLower.includes('calculus')
  ) {
    materials = [
      { id: 'mat-1', text: 'Individual student whiteboards & dry-erase markers', checked: true },
      { id: 'mat-2', text: `Curated problem set: 3 warm-up, 4 guided, 4 independent on ${topic}`, checked: true },
      { id: 'mat-3', text: 'Visual fraction strips / geometric manipulatives', checked: false },
      { id: 'mat-4', text: 'Exit ticket with 2 diagnostic computational items', checked: true },
    ];
    misconceptions = [
      'Applying additive thinking where multiplicative reasoning is required.',
      'Treating numerators and denominators as independent whole numbers rather than a unified proportional value.',
      'Omitting inverse operations when balancing equations across the equality symbol.',
    ];
    vocabulary = ['Variable', 'Inverse Operation', 'Equivalence', 'Coefficient', 'Proportionality'];
  } else if (
    topicLower.includes('history') ||
    topicLower.includes('war') ||
    topicLower.includes('revolution') ||
    topicLower.includes('civil') ||
    topicLower.includes('constitution') ||
    topicLower.includes('government')
  ) {
    materials = [
      { id: 'mat-1', text: 'Primary source excerpts with historical context annotations', checked: true },
      { id: 'mat-2', text: 'Comparative timeline and thematic historical map', checked: true },
      { id: 'mat-3', text: 'SOAPSTone or document analysis graphic organizers', checked: false },
      { id: 'mat-4', text: 'Exit ticket requiring thesis statement backed by 1 historical document', checked: true },
    ];
    misconceptions = [
      'Presentism: judging historical actors through contemporary 21st-century moral standards without historical context.',
      'Attributing complex historical movements to single individuals rather than systemic socio-economic factors.',
      'Conflating correlation with direct historical causation.',
    ];
    vocabulary = ['Primary Source', 'Sovereignty', 'Causation', 'Historiography', 'Contextualization'];
  } else if (
    topicLower.includes('writing') ||
    topicLower.includes('essay') ||
    topicLower.includes('poem') ||
    topicLower.includes('literature') ||
    topicLower.includes('reading') ||
    topicLower.includes('english')
  ) {
    materials = [
      { id: 'mat-1', text: 'Mentor text excerpt exemplifying targeted stylistic craft move', checked: true },
      { id: 'mat-2', text: 'Drafting notebooks or digital writing document', checked: true },
      { id: 'mat-3', text: 'Analytical rubric outlining criteria for mastery', checked: true },
      { id: 'mat-4', text: 'Peer feedback revision checklist with sentence starters', checked: false },
    ];
    misconceptions = [
      'Confusing plot summary with literary analysis and authorial craft commentary.',
      'Believing good writing happens in a single pass without iterative structural revision.',
      'Using decorative adjectives instead of concrete textual evidence.',
    ];
    vocabulary = ['Thesis Statement', 'Tone & Diction', 'Syntax', 'Textual Evidence', 'Metaphor'];
  }

  const essentialQuestion = `How does an in-depth understanding of ${topic} enable us to solve authentic challenges in ${classLevel}?`;
  const swbat = `Students will be able to analyze, explain, and accurately apply core concepts of ${topic} through independent demonstration with ≥ 80% accuracy on the exit ticket.`;
  const exitTicket = `Prompt: In 2-3 sentences, define the primary principle of ${topic} and demonstrate how you would apply it to solve a new scenario.`;

  return {
    id: `plan-${Date.now()}`,
    topic,
    classLevel,
    totalMinutes: cleanMinutes,
    framework,
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    essentialQuestion,
    swbat,
    materials,
    anticipatedMisconceptions: misconceptions,
    vocabulary,
    sections,
    exitTicket,
    teacherNotes: '',
  };
}
