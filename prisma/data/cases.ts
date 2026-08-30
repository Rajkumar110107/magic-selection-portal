export interface CaseQuestion {
  orderNumber: number;
  questionText: string;
  newInformation?: string | null;
  competencyTested?: string;
  guidance?: string;
}

export interface CaseStudyData {
  code: string;
  title: string;
  shortDescription: string;
  background: string;
  currentSituation: string;
  stakeholders: string[];
  knownInformation: string[];
  constraints: string[];
  hiddenDetails: string;
  initialChallenge: string;
  finalDecisionChallenge: string;
  assessmentCompetencies: string[];
  difficultyLevel: string;
  version: number;
  context: string;
  questions: CaseQuestion[];
}

export interface CapabilityAreaCases {
  area: string;
  hiddenRole: string;
  cases: CaseStudyData[];
}

export const caseStudies: CapabilityAreaCases[] = [
  // =========================================================================
  // 1. STRATEGIC THINKING (Hidden Role: Mastermind)
  // =========================================================================
  {
    area: "Strategic Thinking",
    hiddenRole: "Mastermind",
    cases: [
      {
        code: "ST-A",
        title: "Case A: The Hyper-Growth Crisis & Core Volunteer Burnout",
        shortDescription: "A tech club triples its membership in one semester, causing severe volunteer fatigue, degraded project quality, and leadership paralysis.",
        background: "Over the last academic semester, the Google Developer Student Club expanded rapidly from 60 to 220 active registered students due to heavy campus promotions. However, the core team structure remained sized for 50 people: 5 core leads and 8 student volunteers. To maintain momentum, the executive board launched five concurrent initiatives: weekly open-source workshops, a campus hackathon, an industry webinar series, peer tutoring circles, and a club mobile app.",
        currentSituation: "Attendance at weekly workshops has dropped by 65% over the past month. The 8 volunteers are logging 25+ hours weekly on club logistics on top of their academic coursework. Two core technical leads have threatened to resign ahead of mid-term examinations. Meanwhile, 140 first-year members express frustration in Discord channels, citing lack of hands-on mentorship, disorganised communication, and cancelled peer sessions.",
        stakeholders: [
          "Core Leadership (5 leads facing burnout and academic penalties)",
          "Junior Volunteers (8 students overwhelmed by administrative overload)",
          "First-Year Members (140 students expecting guided mentorship)",
          "Department Faculty Advisor (evaluating club viability and lab privileges)",
          "Campus Placement Cell (expecting tangible student project portfolios)"
        ],
        knownInformation: [
          "Current active core team capacity: ~40 total hours per week across all leads.",
          "Estimated effort required for current active initiatives: ~110 hours per week.",
          "Club budget balance: $450 remaining for the semester with zero corporate sponsorships locked.",
          "Discord member sentiment analysis shows 70% of new members feel completely disconnected from core projects."
        ],
        constraints: [
          "Mid-term exams begin in 18 days; core team availability will drop by another 50%.",
          "The department requires at least one flagship public event per semester to retain lab booking rights.",
          "Budget cannot be increased until next fiscal year."
        ],
        hiddenDetails: "The club's expansion was driven by vanity registration metrics rather than sustainable operational capacity. Many first-years possess basic skills to become sub-leads if empowered, but current leads micromanage out of fear of quality degradation.",
        initialChallenge: "Formulate an immediate triage and restructuring strategy that halts core burnout without killing club momentum or losing department support.",
        finalDecisionChallenge: "Deliver a sustainable multi-tier operating model and prioritized roadmap for the remaining semester under constrained volunteer hours.",
        assessmentCompetencies: ["Systems Thinking", "Workload Prioritization", "Organizational Scaling", "Crisis Triage", "Sustainable Resource Management"],
        difficultyLevel: "HIGH / CHALLENGING",
        version: 1,
        context: "The club grew from 60 to 220 members, launching 5 simultaneous initiatives with only 8 volunteers. Workshop attendance collapsed by 65%, two core leads are threatening resignation due to burnout, and mid-term exams loom in 18 days. You must strategically restructure priorities, balance short-term survival against long-term vitality, and manage stakeholder expectations.",
        questions: [
          {
            orderNumber: 1,
            questionText: "Based on the background, analyze the primary structural breakdown that occurred during the club's rapid expansion.",
            competencyTested: "Root Cause Diagnosis",
            guidance: "Evaluate whether the candidate identifies the imbalance between member growth and organizational capacity rather than blaming individual leads."
          },
          {
            orderNumber: 2,
            questionText: "What is the single most critical risk facing the club over the next 3 weeks if no changes are made?",
            competencyTested: "Risk Identification",
            guidance: "Candidate should pinpoint total operational collapse due to lead resignations coinciding with midterm exams."
          },
          {
            orderNumber: 3,
            questionText: "What critical data or behavioral insights would you gather from the 140 first-year members before making structural decisions?",
            competencyTested: "Information Gathering & Assumptions",
            guidance: "Candidate should probe beyond attendance numbers to assess skill distribution, intent (learning vs certificate), and willingness to volunteer."
          },
          {
            orderNumber: 4,
            questionText: "You have 5 ongoing initiatives (workshops, hackathon, webinars, peer tutoring, club app) but only 40 weekly hours of team capacity. Rank which initiatives you will pause, scale down, or protect, and justify the trade-offs.",
            competencyTested: "Strategic Prioritization & Trade-offs",
            guidance: "Look for ruthless prioritization, clear rationale tied to constraints (faculty lab requirement vs member value), and elimination of low-ROI vanity projects."
          },
          {
            orderNumber: 5,
            questionText: "How will you manage the differing expectations of the exhausted core team versus the dissatisfied first-year cohort during this transition?",
            competencyTested: "Stakeholder Alignment & Empathy",
            guidance: "Candidate should articulate distinct communication strategies and transparent boundary-setting for both groups."
          },
          {
            orderNumber: 6,
            questionText: "Outline a concrete 3-step immediate action plan to be executed within the next 48 hours to stabilize the core team.",
            competencyTested: "Operational Decision-Making",
            guidance: "Look for actionable, immediate de-escalation steps (e.g. workload freeze, emergency team standup, transparent community announcement)."
          },
          {
            orderNumber: 7,
            questionText: "Constraint Update: The Faculty Advisor states that cancelling either the Hackathon or the Industry Webinar will result in losing priority access to the Computer Lab next semester. How does this alter your prioritization?",
            competencyTested: "Constraint Navigation",
            guidance: "Candidate must creatively adapt the delivery model (e.g., partnering, co-hosting, converting to async) without re-imposing burnout."
          },
          {
            orderNumber: 8,
            questionText: "New Development: A survey reveals that 75% of first-years joined exclusively for placement resume points and have zero interest in peer tutoring, but 25 highly motivated students want to step up as junior coordinators.",
            newInformation: "Survey findings: 75% of new members seek credentials over deep engagement, while 25 talented students are eager to take on junior operational roles immediately.",
            competencyTested: "Strategic Agility & Talent Leverage",
            guidance: "Candidate should recognize the opportunity to build a decentralized delegation hierarchy rather than continuing top-down execution."
          },
          {
            orderNumber: 9,
            questionText: "In light of this new information, how do you pivot the club's member engagement strategy and volunteer delegation pipeline?",
            competencyTested: "Strategic Adaptation",
            guidance: "Candidate should propose a structured sub-lead onboarding system to absorb operational load while right-sizing expectations for passive members."
          },
          {
            orderNumber: 10,
            questionText: "Present your comprehensive strategic blueprint for the club's operating structure, detailing governance, initiative roadmap, and sustainability metrics for the next 6 months.",
            competencyTested: "Holistic Strategic Synthesis",
            guidance: "Assess long-term systems thinking, governance sustainability, realistic capacity planning, and risk mitigation."
          }
        ]
      },
      {
        code: "ST-B",
        title: "Case B: The Flagship Tech Symposium Deficit & Commercial Sponsor Dilemma",
        shortDescription: "With 3 weeks until the annual campus tech symposium, the title sponsor defaults, leaving a 60% budget deficit and tempting an ethically compromised bailout.",
        background: "The annual 'InnovateX Tech Symposium' is the premier inter-college tech conclave, expecting 600 attendees, 12 keynote speakers, and 4 track hackathons. Total committed expenses stand at $3,500 (auditorium booking, AV equipment, speaker accommodation, and prize pool). Three weeks prior to the event, the title sponsor ('Apex Cloud Systems') suffered corporate restructuring and officially withdrew their $2,200 committed sponsorship.",
        currentSituation: "The organizing committee is in emergency sessions. Fixed non-refundable deposits of $1,200 are already paid. A local unregulated crypto-gambling platform ('BitPlay') approaches the lead organizer offering an immediate $2,500 cash sponsorship. However, they demand primary branding on all student delegate kits, a 30-minute mandatory auditorium stage pitch promoting their referral tokens, and access to the attendee email list.",
        stakeholders: [
          "Symposium Organizing Leads (personally signed the venue booking agreements)",
          "Registered Students (400 already registered expecting high-profile tech keynotes)",
          "University Ethics Board & Faculty Dean (zero tolerance for predatory promotion)",
          "Guest Speakers (prominent industry engineers who agreed based on academic credibility)",
          "Potential Alternative Micro-Sponsors (local tech startups willing to contribute $200-$300 each)"
        ],
        knownInformation: [
          "Current secured treasury: $1,300. Committed vendor liabilities: $3,500. Net shortfall: $2,200.",
          "University regulations strictly prohibit charging student entry fees or sharing student PII.",
          "Cancellation penalty for the auditorium: forfeiture of $800 deposit plus a one-year venue ban.",
          "15 local alumni-run startups could potentially contribute $150-$300 if pitched within 48 hours."
        ],
        constraints: [
          "Only 21 days remain until event day; collateral printing deadlines close in 6 days.",
          "Personal liability: Student leads signed the vendor contracts in their personal capacity.",
          "Institutional policy: Any commercial sponsor promoting speculative assets risks club derecognition."
        ],
        hiddenDetails: "Accepting BitPlay's offer solves the immediate financial deficit but guarantees severe disciplinary action from the University and reputational ruin with keynote speakers. The team has not explored lean restructuring of event costs.",
        initialChallenge: "Analyze the financial and reputational crisis, establishing immediate boundaries regarding acceptable revenue models.",
        finalDecisionChallenge: "Formulate a multi-source financial recovery and lean event redesign plan that preserves the integrity of the symposium.",
        assessmentCompetencies: ["Ethical Decision-Making", "Financial Risk Management", "Crisis Restructuring", "Contingency Planning", "Strategic Negotiation"],
        difficultyLevel: "HIGH / CHALLENGING",
        version: 1,
        context: "Three weeks before an inter-college symposium with $3,500 in liabilities, the $2,200 title sponsor backs out. A dubious crypto platform offers to cover the entire deficit in exchange for aggressive student marketing and attendee email data. You must balance financial survival, personal liability of student organizers, and institutional ethics.",
        questions: [
          {
            orderNumber: 1,
            questionText: "What are the core strategic trade-offs between accepting the commercial bailout versus pursuing emergency lean restructuring?",
            competencyTested: "Strategic Trade-off Analysis",
            guidance: "Candidate must contrast short-term financial solvency against long-term ethical, institutional, and reputational existential risks."
          },
          {
            orderNumber: 2,
            questionText: "Identify the hidden operational and reputational assumptions the organizing team is currently making about this event.",
            competencyTested: "Assumptions & Blindspot Analysis",
            guidance: "Look for recognition that expenses might be artificially inflated and that cancellation/downsizing is treated as a worse evil than ethics violation."
          },
          {
            orderNumber: 3,
            questionText: "How would you systematically audit the $3,500 budget to separate non-negotiable operational requirements from discretionary expenses?",
            competencyTested: "Cost-Benefit & Financial Pruning",
            guidance: "Evaluate candidate's ability to ruthlessly trim variable costs (swag, elaborate catering, massive cash prize pool) down to essential AV and speaker hospitality."
          },
          {
            orderNumber: 4,
            questionText: "Whose interests must take highest priority in your financial contingency plan: the student organizers' personal liability, the attendees' experience, or the university's institutional code of conduct?",
            competencyTested: "Stakeholder Prioritization",
            guidance: "Candidate should establish clear ethical boundaries while proposing mitigation for personal liability risks."
          },
          {
            orderNumber: 5,
            questionText: "What is your explicit, definitive decision regarding BitPlay's $2,500 sponsorship offer? Justify your stance with concrete risk rationale.",
            competencyTested: "Principled Decision-Making",
            guidance: "Candidate must firmly reject the unethical proposal or articulate non-negotiable red lines that make the offer unviable."
          },
          {
            orderNumber: 6,
            questionText: "Design a 72-hour alternative revenue generation strategy leveraging alumni, micro-sponsorships, and community crowdfunding.",
            competencyTested: "Strategic Revenue Engineering",
            guidance: "Look for practical tiered sponsor packages, alumni network outreach, and rapid sales execution mechanisms."
          },
          {
            orderNumber: 7,
            questionText: "Constraint Update: An emergency meeting with the college Dean reveals the college can match 50% of whatever verified startup sponsorship you raise within 5 days, capped at $1,000. How do you capitalize on this matching grant?",
            competencyTested: "Leverage & Opportunity Capitalization",
            guidance: "Candidate should use the institutional match as a high-urgency selling point in pitches to potential micro-sponsors."
          },
          {
            orderNumber: 8,
            questionText: "New Development: Two keynote speakers discover the sponsor withdrawal rumors and threaten to drop out unless guaranteed their travel/hospitality arrangements within 48 hours.",
            newInformation: "Speaker Alert: Two marquee industry keynotes demand written confirmation of travel and hotel logistics within 48 hours, or they will cancel their attendance.",
            competencyTested: "High-Pressure Stakeholder Containment",
            guidance: "Candidate must secure key relationships with transparent communication, prioritizing speaker commitments without leaking internal panic."
          },
          {
            orderNumber: 9,
            questionText: "How do you restructure the symposium's operational schedule and speaker commitments to maintain high perceived value while operating on a trimmed budget?",
            competencyTested: "Adaptive Event Architecture",
            guidance: "Look for innovative formats (hybrid tracks, virtual keynotes, community hackathon showcases) that sustain quality without high expenditure."
          },
          {
            orderNumber: 10,
            questionText: "Provide your final comprehensive execution playbook for delivering InnovateX successfully, including emergency cash-flow milestones and post-event risk audits.",
            competencyTested: "Comprehensive Strategic Execution",
            guidance: "Assess holistic synthesis, cash-flow timelines, accountability checks, and governance safeguards against future sponsor defaults."
          }
        ]
      },
      {
        code: "ST-C",
        title: "Case C: Legacy Web Track vs. Generative AI Pivot & Mentor Bottleneck",
        shortDescription: "A sharp divide emerges between incoming students demanding an aggressive Generative AI pivot and senior mentors defending the foundational Web Development curriculum.",
        background: "For four years, the tech club's flagship educational curriculum has been a full-stack Web Development track (MERN/Next.js) with proven placement outcomes, established syllabus materials, and 6 experienced senior student mentors. This year, incoming 2nd-year members and general applicants overwhelmingly (82%) demand a complete shift to Generative AI, LLM fine-tuning, and Agentic AI workflows.",
        currentSituation: "The 6 senior mentors are proficient in web architecture but have only superficial knowledge of AI math, CUDA optimization, or PyTorch. A vocal faction of 2nd years threatens to split off and create a rival 'Campus AI Society' if the club does not dedicate 100% of its workshop bandwidth and lab time to AI. However, the club has only enough lab capacity and administrative approval to run one primary technical track this semester.",
        stakeholders: [
          "Senior Mentors (6 final-year leads proficient in Web Dev, protective of curriculum quality)",
          "2nd-Year Cohort (80+ students eager for cutting-edge AI skills for upcoming internships)",
          "Faculty Lab In-Charge (controls high-performance GPU lab with strict usage quotas)",
          "Alumni Network (working in industry, providing guest reviews and referral hiring)",
          "Club Executive Committee (must decide curriculum allocation without fracturing community)"
        ],
        knownInformation: [
          "Web Dev track has 90% completion rate historically and 30+ alumni mentors available on weekends.",
          "AI track currently has zero structured curriculum, zero vetted project repositories, and no verified student mentors.",
          "Campus GPU lab has only 12 workstations with RTX GPUs, severely bottlenecking hands-on AI model training.",
          "Industry hiring trends show high demand for both full-stack engineers and AI-integrated application developers."
        ],
        constraints: [
          "Curriculum must be finalized and submitted to the department academic dean in 7 days.",
          "Senior mentors will refuse to teach topics where they cannot guarantee technical depth.",
          "A splinter club would split faculty funding and double administrative reporting requirements."
        ],
        hiddenDetails: "The 2nd years' demand for 'AI' is largely driven by hype; few have mastered foundational data structures or Python. Simultaneously, the senior mentors' resistance is partly rooted in insecurity about having their authority challenged.",
        initialChallenge: "Deconstruct the false dichotomy between pure Web Development and pure Generative AI, designing a sustainable strategic bridge.",
        finalDecisionChallenge: "Architect an integrated educational and mentorship model that upskills the community while maintaining pedagogical rigor.",
        assessmentCompetencies: ["Curriculum Strategy", "Conflict Transformation", "Capacity Building", "Pedagogical Roadmapping", "Organizational Cohesion"],
        difficultyLevel: "HIGH / CHALLENGING",
        version: 1,
        context: "82% of incoming members demand the club pivot completely to Generative AI, threatening a splinter club. However, the 6 experienced mentors only know Web Development, and the club has no vetted AI curriculum or GPU capacity. You must strategically navigate this curriculum transition without sacrificing technical quality or alienating either faction.",
        questions: [
          {
            orderNumber: 1,
            questionText: "What are the fundamental long-term risks of either capitulating entirely to the AI hype or stubbornly sticking 100% to the legacy Web track?",
            competencyTested: "Strategic Dilemma Analysis",
            guidance: "Evaluate candidate's ability to see failure modes on both extremes: curriculum chaos with no mentors vs. total irrelevance and student defection."
          },
          {
            orderNumber: 2,
            questionText: "How do you assess the actual learning readiness and prerequisites of the 2nd-year cohort before agreeing to advanced AI coursework?",
            competencyTested: "Diagnostic Evaluation",
            guidance: "Candidate should propose diagnostic skills assessments and progressive prerequisites rather than taking student self-assessments at face value."
          },
          {
            orderNumber: 3,
            questionText: "What hidden psychological and professional factors are driving the senior mentors' intense resistance to the proposed curriculum changes?",
            competencyTested: "Underlying Motivation Diagnosis",
            guidance: "Look for empathy and recognition of mentor vulnerability (fear of incompetence, loss of prestige, workload of learning on the fly)."
          },
          {
            orderNumber: 4,
            questionText: "How would you design an integrated curriculum roadmap that synthesizes AI application development with robust full-stack engineering (e.g. AI-enabled Web Apps)?",
            competencyTested: "Curriculum & Product Strategy",
            guidance: "Candidate should formulate an innovative hybrid architecture (Fullstack + LLM APIs / RAG) leveraging existing mentor strengths while fulfilling AI demand."
          },
          {
            orderNumber: 5,
            questionText: "What is your explicit plan to upskill the 6 senior mentors so they can confidently guide modern, AI-integrated software projects?",
            competencyTested: "Capacity Building & Enablement",
            guidance: "Look for structured 'train-the-trainer' modules, external alumni pairings, and collaborative co-learning frameworks."
          },
          {
            orderNumber: 6,
            questionText: "Make a decisive ruling on the semester syllabus structure and resource allocation between Web and AI tracks. Detail the schedule distribution.",
            competencyTested: "Resource Allocation Decision",
            guidance: "Assess clarity of weekly schedule, lab hour distribution, and concrete project milestones."
          },
          {
            orderNumber: 7,
            questionText: "Constraint Update: The Faculty Lab In-Charge announces that GPU workstations can only be accessed for 4 hours every Saturday morning. How does this technical bottleneck shape your project architecture?",
            competencyTested: "Technical Constraint Adaptation",
            guidance: "Candidate should pivot from heavy local model training to lightweight cloud APIs, quantized local models, or CPU-friendly inference stacks."
          },
          {
            orderNumber: 8,
            questionText: "New Development: An AI startup founded by college alumni offers to provide free weekly guest lectures on LLM agents, but demands the club promote their paid internship bootcamps.",
            newInformation: "Alumni Startup Offer: An alumni-founded AI startup offers free expert guest lectures but requires promoting their paid corporate training bootcamp to club members.",
            competencyTested: "External Partnership Governance",
            guidance: "Candidate must establish clear boundary guidelines to extract educational value without turning the club into a commercial sales funnel."
          },
          {
            orderNumber: 9,
            questionText: "How do you negotiate with the startup to secure mentorship value while safeguarding members from predatory commercial marketing?",
            competencyTested: "Negotiation & Influence",
            guidance: "Candidate should propose strict MOUs, separating guest technical masterclasses from promotional pitching and vetting bootcamp scholarship spots."
          },
          {
            orderNumber: 10,
            questionText: "Deliver your final strategic vision and governance plan to present to both the senior mentors and the 2nd-year leads during the joint all-hands meeting.",
            competencyTested: "Strategic Vision Alignment",
            guidance: "Evaluate narrative cohesion, unified club mission, shared ownership, and measurable success criteria for the semester."
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 2. DECISION-MAKING & REPRESENTATION (Hidden Role: Advocate)
  // =========================================================================
  {
    area: "Decision-Making & Representation",
    hiddenRole: "Advocate",
    cases: [
      {
        code: "DM-A",
        title: "Case A: High-Stakes Industry Project Allocation: Proven Elite vs. Ambitious Novices",
        shortDescription: "A tier-1 corporate partner awards the club a high-visibility paid consulting project. The executive committee is deadlocked between allocating it to a seasoned, arrogant elite team or a motivated, diverse novice group.",
        background: "A prestigious national fintech enterprise reached out to the student club to develop a production-ready Open Banking dashboard and developer sandbox. The project comes with a $3,000 project grant, direct recruitment fast-tracks for top contributors, and campus-wide prestige. The executive committee must assign the project to one of two candidate teams formed during the internal selection sprint.",
        currentSituation: "Team Alpha consists of 4 final-year competitive programmers who previously won national hackathons. They are technically brilliant but notorious for insular collaboration, poor documentation, and dismissive behavior toward junior peers. Team Beta comprises 5 diverse 2nd and 3rd-year students who demonstrated exceptional teamwork, meticulous sprint documentation, and high enthusiasm, but lack production backend experience. If Team Alpha gets the project, delivery success is guaranteed, but no institutional learning occurs. If Team Beta gets it, they face steep technical hurdles with a 30% estimated risk of missing the milestone delivery deadline.",
        stakeholders: [
          "Fintech Corporate Client (demands strict milestone delivery and production reliability)",
          "Team Alpha (expects the project as their rightful entitlement based on raw technical merit)",
          "Team Beta (believes club projects should prioritize growth, inclusion, and skill building)",
          "Club President & Faculty Sponsor (concerned about long-term corporate partnership relations)",
          "General Club Membership (watching closely to see if meritocracy or favoritism governs opportunities)"
        ],
        knownInformation: [
          "Contract timeline: 8 weeks with bi-weekly client sprint demos.",
          "Corporate partner explicitly warned that failure to deliver Milestone 2 on Week 4 will cancel the partnership permanently.",
          "Team Alpha's lead stated in writing: 'If we are forced to pair with junior members, we will decline the project entirely.'",
          "Team Beta has spent 40 hours building a preliminary architectural mock-up that impressed the faculty advisor."
        ],
        constraints: [
          "The client will only interface with a single cohesive team structure; they will not accept disjointed split sub-teams.",
          "Decision must be finalized and signed off by 5:00 PM tomorrow.",
          "No club lead can directly write code for the project due to conflict of interest guidelines."
        ],
        hiddenDetails: "Team Alpha intends to use the project primarily as a resume trophy and has already begun interviewing for full-time jobs, meaning their dedication will evaporate once personal offers arrive. Team Beta contains a silent technical star who lacks confidence but learns at 3x the speed of peers.",
        initialChallenge: "Evaluate the competing philosophies of guaranteed external delivery versus egalitarian student development.",
        finalDecisionChallenge: "Deliver an authoritative, principled project governance decision and defend it transparently before both teams and the client.",
        assessmentCompetencies: ["Ethical Decision-Making", "Stakeholder Representation", "Risk Calibration", "Merit vs Growth Balancing", "Transparent Governance"],
        difficultyLevel: "HIGH / CHALLENGING",
        version: 1,
        context: "A lucrative $3,000 corporate fintech project must be awarded to either Team Alpha (hyper-competent, toxic, flight-risk) or Team Beta (cohesive, diverse novices, delivery risk). Client demands zero delays on pain of contract termination. You must balance organizational credibility, fair student representation, and operational risk.",
        questions: [
          {
            orderNumber: 1,
            questionText: "What is the core philosophical and organizational dilemma at the heart of this project allocation dispute?",
            competencyTested: "Dilemma Articulation",
            guidance: "Candidate should articulate the tension between client reliability/external prestige and club mission/inclusive talent development."
          },
          {
            orderNumber: 2,
            questionText: "Identify the critical blindspots and unexamined risks associated with awarding the project exclusively to Team Alpha.",
            competencyTested: "Risk & Blindspot Discovery",
            guidance: "Look for recognition of Team Alpha's flight risk, toxic precedent, lack of knowledge transfer, and poor community culture."
          },
          {
            orderNumber: 3,
            questionText: "What specific objective criteria should the executive committee use to evaluate both teams beyond raw technical capability and subjective enthusiasm?",
            competencyTested: "Evaluation Framework Design",
            guidance: "Candidate should propose balanced scorecards (documentation, velocity, reliability, communication discipline, long-term commitment)."
          },
          {
            orderNumber: 4,
            questionText: "How will your decision impact the broader club culture and future participation of junior members in competitive opportunities?",
            competencyTested: "Cultural & Systemic Impact Analysis",
            guidance: "Evaluate candidate's understanding of symbolic leadership decisions and their lasting effect on community trust."
          },
          {
            orderNumber: 5,
            questionText: "State your definitive decision: Who receives the primary mandate to build the fintech project, and under what specific governance conditions?",
            competencyTested: "Decisive Problem Resolution",
            guidance: "Assess courage to make a firm decision accompanied by robust operational checks and risk contingencies."
          },
          {
            orderNumber: 6,
            questionText: "Design a hybrid supervision or mentorship mechanism to de-risk technical delivery while ensuring strict accountability.",
            competencyTested: "Governance & Risk Mitigation",
            guidance: "Look for code review boards, external alumni technical advisory, and staged milestone gates."
          },
          {
            orderNumber: 7,
            questionText: "Constraint Update: The client adds a requirement that the core architecture must use a legacy proprietary SDK that neither team has ever encountered. How does this level the playing field?",
            competencyTested: "Dynamic Constraint Management",
            guidance: "Candidate should recognize that learning agility and documentation discipline (Team Beta's strengths) now outweigh static prior knowledge."
          },
          {
            orderNumber: 8,
            questionText: "New Development: You discover that Team Alpha privately attempted to bypass the club leadership and pitch the corporate client directly as an independent contractor group.",
            newInformation: "Ethical Violation: Team Alpha sent a private email to the fintech client offering to execute the contract off-campus without club oversight.",
            competencyTested: "Integrity & Disciplinary Judgment",
            guidance: "Candidate must evaluate this gross breach of trust, determine appropriate sanctions, and protect the club's institutional relationship."
          },
          {
            orderNumber: 9,
            questionText: "How do you handle the disciplinary response to Team Alpha's backchannel pitching while preventing a public scandal that could spook the client?",
            competencyTested: "Crisis Containment & Ethics",
            guidance: "Candidate should execute firm, professional disqualification/disciplinary action while maintaining calm client confidence."
          },
          {
            orderNumber: 10,
            questionText: "Draft the official communication announcement to the student body explaining the project award, criteria applied, and how future industry opportunities will be allocated.",
            competencyTested: "Transparent Representation & Public Advocacy",
            guidance: "Evaluate clarity, fairness, ethical transparency, and inspirational tone that reinforces community values."
          }
        ]
      },
      {
        code: "DM-B",
        title: "Case B: Hackathon Rule Infraction & Medical Emergency Fairness Dilemma",
        shortDescription: "The winning team of a major hackathon had 5 members instead of the strictly mandated 4, but claims the 5th member was added due to a sudden hospital emergency.",
        background: "The annual inter-college 'CodeStorm Hackathon' concluded with 45 participating teams competing for a $1,000 prize pool and corporate internship interviews. The official competition rulebook, acknowledged in writing by all participants, explicitly stated: 'Teams must consist of strictly 3 to 4 participants. Any team with more than 4 active members will face immediate disqualification.'",
        currentSituation: "At the closing ceremony, external industry judges unanimously awarded 1st Place to 'Team Vertex' for an exceptional IoT disaster-response application. One hour after the announcement, the 2nd Place team ('Team Sentinel') filed a formal petition backed by git commit logs showing that Team Vertex had 5 registered GitHub contributors. Team Vertex's captain passionately argues that their 4th member suffered an acute appendicitis attack at 2:00 AM and was hospitalized, prompting them to bring in a replacement classmate at 3:00 AM without prior organizer approval to avoid forfeiting 18 hours of work.",
        stakeholders: [
          "Team Vertex (1st Place recipients, claim genuine humanitarian emergency)",
          "Team Sentinel (2nd Place team, followed every rule strictly, demanding disqualification of Vertex)",
          "External Judges (senior tech leads who judged Vertex's prototype purely on technical merit)",
          "Organizing Committee (responsible for rule enforcement and hackathon integrity)",
          "Corporate Prize Sponsor (watching for institutional professionalism and fair play)"
        ],
        knownInformation: [
          "Team Vertex did not notify organizers of the emergency substitution until confronted after the awards.",
          "Hospital discharge documentation confirms the hospitalized member was indeed admitted at 2:15 AM.",
          "Git repository analysis shows the replacement 5th member contributed 42% of the backend codebase between 3:30 AM and 8:00 AM.",
          "The prize money ($600 1st prize) has not yet been disbursed, but the physical trophy was presented on stage."
        ],
        constraints: [
          "Official verdict must be delivered within 24 hours before press releases and sponsor reports are published.",
          "The rulebook contains no explicit clause regarding emergency substitutions during the hackathon window.",
          "External judges refuse to reconvene to re-evaluate all 45 projects from scratch."
        ],
        hiddenDetails: "Team Sentinel's captain was aware of Vertex's substitution at 4:00 AM during the hackathon but intentionally waited until after the awards were announced to maximize public disruption and force an automatic win.",
        initialChallenge: "Disentangle the ethical conflict between strict rule-of-law adherence and compassionate contextual exception.",
        finalDecisionChallenge: "Formulate a fair, transparent arbitration ruling that maintains competitive integrity without cruelty.",
        assessmentCompetencies: ["Equitable Arbitration", "Policy Interpretation", "Conflict Mediation", "Restorative Justice", "Institutional Credibility"],
        difficultyLevel: "HIGH / CHALLENGING",
        version: 1,
        context: "The 1st place hackathon winner broke the 4-person team size limit by adding a 5th contributor at 3 AM due to a medical emergency. The 2nd place team filed git evidence demanding instant disqualification. You must decide whether to enforce strict disqualification, uphold the win, or find an equitable arbitration path.",
        questions: [
          {
            orderNumber: 1,
            questionText: "What is the core conflict between procedural justice (strict rule enforcement) and substantive justice (contextual fairness) in this dispute?",
            competencyTested: "Justice & Legal Reasoning",
            guidance: "Candidate must deeply explore the tension between setting dangerous precedents vs recognizing genuine human emergencies."
          },
          {
            orderNumber: 2,
            questionText: "Analyze the significance of the git evidence showing the 5th member wrote 42% of the backend code versus a minor cosmetic contribution.",
            competencyTested: "Evidence & Proportionality Analysis",
            guidance: "Look for critical recognition that the substitute provided substantial unfair competitive bandwidth during peak hackathon hours."
          },
          {
            orderNumber: 3,
            questionText: "How do you evaluate Team Vertex's failure to notify organizers at 2:00 AM before making the unilateral substitution?",
            competencyTested: "Procedural Compliance Assessment",
            guidance: "Candidate should recognize that emergency circumstances do not excuse bypassing official communication channels."
          },
          {
            orderNumber: 4,
            questionText: "What are the systemic risks to future club competitions if Team Vertex is allowed to retain 1st Place without penalty?",
            competencyTested: "Precedent & Systemic Risk",
            guidance: "Candidate should analyze future moral hazard, loss of participant trust, and accusations of organizer favoritism."
          },
          {
            orderNumber: 5,
            questionText: "State your definitive verdict regarding the 1st Place title, the prize money distribution, and corporate internship recommendations.",
            competencyTested: "Arbitration Ruling",
            guidance: "Look for a nuanced, balanced ruling (e.g., technical recognition without official 1st place ranking, or joint resolution with structured prize division)."
          },
          {
            orderNumber: 6,
            questionText: "How will you conduct the private resolution meeting with the captains of both Team Vertex and Team Sentinel to prevent public toxicity?",
            competencyTested: "Conflict Mediation Strategy",
            guidance: "Candidate should outline de-escalation techniques, empathetic listening, and firm boundary enforcement."
          },
          {
            orderNumber: 7,
            questionText: "Constraint Update: The corporate sponsor states they only have budget to interview ONE team for fast-track internships. How do you resolve the internship nomination?",
            competencyTested: "Resource Scarcity Resolution",
            guidance: "Candidate should propose an objective merit review, interview splitting, or petitioning the sponsor for additional slots."
          },
          {
            orderNumber: 8,
            questionText: "New Development: Screenshots emerge in a public Discord server showing Team Sentinel members celebrating their 'trap' and mocking the hospitalized student.",
            newInformation: "Bad Faith Conduct: Leaked Discord chat logs prove Team Sentinel knew about the hospitalization in real time and intentionally weaponized the rulebook maliciously.",
            competencyTested: "Contextual Ethics & Bad Faith Evaluation",
            guidance: "Candidate must evaluate how unsportsmanlike conduct and bad faith behavior factor into organizational justice."
          },
          {
            orderNumber: 9,
            questionText: "How does the revelation of Team Sentinel's malicious conduct impact your treatment of their formal petition and overall standing?",
            competencyTested: "Holistic Moral Judgment",
            guidance: "Candidate should balance legal standing with behavioral standards, upholding values of sportsmanship alongside rules."
          },
          {
            orderNumber: 10,
            questionText: "Draft the comprehensive competition policy amendment for 'Emergency Substitutions and Force Majeure' to be permanently incorporated into future rulebooks.",
            competencyTested: "Institutional Policy Design",
            guidance: "Evaluate clarity, comprehensive edge-case handling, clear emergency protocol, and robust organizer review workflows."
          }
        ]
      },
      {
        code: "DM-C",
        title: "Case C: Institutional Administrative Mandate vs. Student Community Autonomy",
        shortDescription: "College administration orders the student tech club to scrap its student-led curriculum and build a mandatory administrative surveillance app under threat of lab eviction.",
        background: "The Google Developer Student Club has operated for three years as an autonomous student community focusing on open-source software, cloud computing, and peer hackathons. The club was granted dedicated occupancy in Room 304 (the campus Innovation Lab). A newly appointed Associate Dean of Student Affairs calls an urgent meeting with the club leadership.",
        currentSituation: "The Associate Dean issues a directive: the club must immediately suspend its planned semester workshops and allocate all technical leads and lab machines to develop a proprietary 'Campus Smart Attendance & Biometric Movement Tracker'. The application will track student geo-location, enforce class attendance through facial recognition, and log library entry/exit. The Dean explicitly states: 'If the prototype is not completed within 6 weeks, Room 304 will be reassigned to the department faculty lounge, and club funding will be permanently terminated.'",
        stakeholders: [
          "College Administration / Associate Dean (demanding obedience and immediate compliance)",
          "General Student Body (vehemently opposed to student surveillance, fearing privacy violations)",
          "Club Technical Leads (refusing on ethical grounds to build surveillance tools targeting peers)",
          "Club Executive Board (faced with the existential loss of lab space, funding, and official status)",
          "Faculty Club Advisor (caught between administrative hierarchy and student welfare)"
        ],
        knownInformation: [
          "The club constitution states the organization's primary objective is student empowerment in technology.",
          "Loss of Room 304 would eliminate physical workspace for 40 active student project builders.",
          "Building the app without strict data governance would violate national student privacy regulations.",
          "The administration lacks the internal budget to hire a commercial software development agency ($25,000 market cost)."
        ],
        constraints: [
          "Direct public defiance will trigger immediate administrative sanctions and disciplinary probation for student leads.",
          "Blind compliance will destroy the club's credibility and cause a mass student boycott.",
          "6-week deadline with zero financial compensation provided to student developers."
        ],
        hiddenDetails: "The Associate Dean is under intense pressure from the University Syndicate to modernize campus attendance but was given zero budget. He sees the student tech club as free developer labor to save his own administrative performance appraisal.",
        initialChallenge: "Deconstruct the power imbalance, ethical dilemmas, and existential risks of administrative coercion.",
        finalDecisionChallenge: "Architect a high-stakes diplomatic and technical counter-proposal that protects student privacy, preserves lab access, and satisfies administrative objectives.",
        assessmentCompetencies: ["Advocacy & Negotiation", "Ethical Integrity", "Institutional Diplomacy", "Creative Problem Solving", "Constitutional Governance"],
        difficultyLevel: "HIGH / CHALLENGING",
        version: 1,
        context: "The Associate Dean orders the tech club to build a mandatory facial-recognition student tracking app in 6 weeks or lose its dedicated innovation lab. Student leads refuse on ethical grounds, while the student body opposes surveillance. You must navigate this severe power imbalance and find a viable diplomatic solution.",
        questions: [
          {
            orderNumber: 1,
            questionText: "What are the primary ethical, legal, and community implications of student developers building a surveillance application for the administration?",
            competencyTested: "Ethical & Legal Analysis",
            guidance: "Candidate must identify privacy laws, consent violations, conflicts of interest, and community betrayal."
          },
          {
            orderNumber: 2,
            questionText: "Analyze the Associate Dean's underlying incentives, pressures, and constraints beyond his authoritarian demands.",
            competencyTested: "Stakeholder Empathy & Motivation Discovery",
            guidance: "Candidate should recognize the Dean's lack of budget, pressure from university leadership, and need for measurable attendance modernization."
          },
          {
            orderNumber: 3,
            questionText: "What leverage does the student club possess in this negotiation despite the apparent power asymmetry?",
            competencyTested: "Strategic Leverage Identification",
            guidance: "Look for recognition that the administration has zero internal tech capability, cannot afford commercial vendors ($25k), and needs student expertise."
          },
          {
            orderNumber: 4,
            questionText: "Why is an outright hostile confrontation or public social media campaign a high-risk strategic blunder for the club at this stage?",
            competencyTested: "Strategic Risk Evaluation",
            guidance: "Candidate should analyze escalation hazards (disciplinary suspension, club derecognition, permanent loss of physical assets)."
          },
          {
            orderNumber: 5,
            questionText: "Formulate a concrete, diplomatic counter-proposal to present to the Associate Dean during the follow-up meeting.",
            competencyTested: "Diplomatic Solution Architecture",
            guidance: "Look for creative pivot: privacy-first, decentralized open-source attendance (e.g. BLE beacon / QR self-check-in with strict zero PII retention) aligned with student hackathons."
          },
          {
            orderNumber: 6,
            questionText: "How will you structure the technical architecture of the counter-proposal to guarantee absolute student privacy and compliance with data protection laws?",
            competencyTested: "Technical Privacy Governance",
            guidance: "Candidate should detail privacy-preserving architectures (local hashing, role-based access, automated data purges, no facial biometric tracking)."
          },
          {
            orderNumber: 7,
            questionText: "Constraint Update: The Dean rejects any proposal that does not give department heads an automated daily attendance dashboard. How do you integrate this requirement without biometric tracking?",
            competencyTested: "Constraint-Driven Redesign",
            guidance: "Candidate should provide aggregated, anonymized reporting metrics derived from basic classroom check-ins."
          },
          {
            orderNumber: 8,
            questionText: "New Development: A senior faculty member from the Computer Science Department privately offers to co-sponsor the club's counter-proposal as an official academic research project.",
            newInformation: "Faculty Ally: A respected CS Department Professor agrees to co-sign the counter-proposal, turning the project into an accredited student R&D capstone with ethical oversight.",
            competencyTested: "Coalition Building & Institutional Advocacy",
            guidance: "Candidate should leverage this academic alliance to elevate the club's institutional standing and shield student leaders."
          },
          {
            orderNumber: 9,
            questionText: "How do you leverage this faculty partnership to formalize an institutional charter protecting the club's future operational independence?",
            competencyTested: "Long-term Policy Institutionalization",
            guidance: "Candidate should propose a permanent Student Innovation Charter defining boundaries for administrative tech requests."
          },
          {
            orderNumber: 10,
            questionText: "Deliver your final presentation script and executive summary to be delivered jointly to the Dean and Faculty Board.",
            competencyTested: "Executive Communication & Representation",
            guidance: "Assess diplomatic eloquence, rigorous problem solving, respectful boundary-setting, and win-win value alignment."
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 3. MENTORING & PROBLEM-SOLVING (Hidden Role: Guide)
  // =========================================================================
  {
    area: "Mentoring & Problem-Solving",
    hiddenRole: "Guide",
    cases: [
      {
        code: "MP-A",
        title: "Case A: The Brilliant Lone Wolf: Technical Prodigy Demoralizing Team Collaboration",
        shortDescription: "A highly gifted technical lead rewrites teammates' code overnight, makes derogatory comments during PR reviews, and causes 3 junior developers to stop participating.",
        background: "The club's open-source development team is building a campus navigation and event-discovery platform. Rohan, a 3rd-year student and competitive programming champion, was appointed Technical Lead due to his exceptional coding speed and deep architecture knowledge. He reports directly to the club executive committee and oversees 5 junior student contributors.",
        currentSituation: "Over the last three weeks, Rohan has consistently rewritten entire feature branches submitted by junior developers overnight without explanation, merging his own code with commit messages like 'Fixed garbage implementation'. During pull request reviews, he leaves sarcastic comments mocking basic errors. Three junior developers have completely stopped attending standups, and one 2nd-year member privately broke down in tears to the club mentor, stating she feels incompetent and wants to drop out of software engineering entirely.",
        stakeholders: [
          "Rohan (Technical Lead, brilliant, intolerant of mistakes, unaware of interpersonal destruction)",
          "Junior Developers (5 students eager to learn but severely demoralized and intimidated)",
          "Club Mentor / Lead (responsible for team psychological safety and project progress)",
          "Open Source Community (observing pull requests and code review culture)",
          "Project Client / Campus Community (expecting a functional app by end of semester)"
        ],
        knownInformation: [
          "Rohan writes clean, highly optimized code at 5x the speed of any other team member.",
          "Rohan was raised in hyper-competitive coaching institutes where individual ranking was everything.",
          "If Rohan quits or is abruptly fired, project completion will be delayed by at least 6 weeks.",
          "Junior members have immense potential but need constructive code reviews and guided mentoring."
        ],
        constraints: [
          "Project release date is fixed for the campus cultural festival in 30 days.",
          "Rohan reacts defensively to direct criticism, viewing any feedback on his behavior as 'coddling mediocrity'.",
          "Club core values strictly mandate an inclusive, respectful peer learning environment."
        ],
        hiddenDetails: "Rohan secretly experiences intense anxiety about failing to deliver perfection. He rewrites code not out of malice, but because he does not know how to coach others and believes carrying everything himself is the only way to avoid failure.",
        initialChallenge: "Diagnose the psychological drivers behind the technical lead's destructive behavior without excusing the toxic impact.",
        finalDecisionChallenge: "Design and execute a structured behavioral intervention that rehabilitates team psychological safety while mentoring the lead into a mature leader.",
        assessmentCompetencies: ["Empathetic Diagnosis", "Constructive Feedback", "Psychological Safety Restoration", "Talent Coaching", "Conflict Resolution"],
        difficultyLevel: "HIGH / CHALLENGING",
        version: 1,
        context: "Rohan, a technical genius lead, rewrites junior developers' code overnight, leaves sarcastic PR comments, and has caused 3 members to withdraw in tears. If he leaves, the project is delayed by 6 weeks. You must address this toxic behavior, restore psychological safety, and guide Rohan to become an empathetic mentor.",
        questions: [
          {
            orderNumber: 1,
            questionText: "Diagnose the root causes behind Rohan's destructive behavior and contrast them with the apparent surface symptoms.",
            competencyTested: "Behavioral & Psychological Diagnosis",
            guidance: "Candidate must look beyond 'arrogance' to identify underlying anxiety, lack of mentoring skills, and hyper-competitive conditioning."
          },
          {
            orderNumber: 2,
            questionText: "What are the compounding organizational dangers of tolerating high-performing toxic individuals in a student-led community?",
            competencyTested: "Cultural Toxicity Impact",
            guidance: "Candidate should analyze long-term attrition of diverse talent, cultural erosion, and the myth of the indispensable toxic star."
          },
          {
            orderNumber: 3,
            questionText: "How will you prepare for your one-on-one coaching conversation with Rohan to prevent him from shutting down or becoming immediately defensive?",
            competencyTested: "Difficult Conversation Preparation",
            guidance: "Look for SBI (Situation-Behavior-Impact) feedback model, empathetic framing, focusing on leadership growth rather than personal attack."
          },
          {
            orderNumber: 4,
            questionText: "Write out the exact dialogue and key conversational milestones you will use during the first 10 minutes of your 1-on-1 meeting with Rohan.",
            competencyTested: "Constructive Feedback Delivery",
            guidance: "Evaluate tone, firmness on non-negotiable boundaries, empathetic inquiry, and reframing leadership from 'writing code' to 'growing people'."
          },
          {
            orderNumber: 5,
            questionText: "How will you engage with the three demoralized junior developers to rebuild their confidence and sense of belonging?",
            competencyTested: "Psychological Safety Rebuilding",
            guidance: "Candidate should propose restorative listening sessions, affirming their value, validating their contributions, and providing safety guarantees."
          },
          {
            orderNumber: 6,
            questionText: "Establish concrete, non-negotiable code review guidelines and git workflow policies that structurally prevent unilateral code overwriting.",
            competencyTested: "Process & Systemic Guardrails",
            guidance: "Look for PR templates, review checklists, mandatory pair programming sessions, and branch protection rules."
          },
          {
            orderNumber: 7,
            questionText: "Constraint Update: Rohan agrees to change his tone but claims he simply doesn't have the time to explain every PR comment while meeting the 30-day deadline. How do you resolve this time dilemma?",
            competencyTested: "Operational Enablement",
            guidance: "Candidate should introduce pair programming hours, reusable review snippets, or adjust non-critical sprint scopes."
          },
          {
            orderNumber: 8,
            questionText: "New Development: One week later, Rohan slips and leaves a harsh, sarcastic comment on a public pull request submitted by a junior developer.",
            newInformation: "Relapse Event: Rohan leaves a public comment: 'Did a middle schooler write this logic?' on a junior developer's pull request.",
            competencyTested: "Accountability Enforcement & Boundary Setting",
            guidance: "Candidate must enforce clear boundaries immediately without wavering, demonstrating that culture takes precedence over raw code output."
          },
          {
            orderNumber: 9,
            questionText: "What immediate corrective and disciplinary steps do you take following Rohan's public relapse?",
            competencyTested: "Disciplinary Action & Mediation",
            guidance: "Look for immediate private reprimand, public retraction/apology, temporary suspension of merge permissions, and mediation with the junior dev."
          },
          {
            orderNumber: 10,
            questionText: "Outline a 6-week developmental mentoring roadmap for Rohan to transition him from an isolated code author to an inspiring engineering manager.",
            competencyTested: "Long-term Leadership Mentorship",
            guidance: "Assess structured milestones, empathy metrics, delegation assignments, and continuous feedback loops."
          }
        ]
      },
      {
        code: "MP-B",
        title: "Case B: The Masked Underperformer: Imposter Syndrome & Misaligned Responsibilities",
        shortDescription: "An eager new volunteer misses 4 consecutive task deadlines, makes excuses, and begins ghosting team messages, but the underlying issue is completely different from laziness.",
        background: "Ananya, a 2nd-year student from an underrepresented background, joined the club's public relations and event coordination team with glowing recommendations for her enthusiasm and graphic design portfolio. During recruitment, she expressed a passionate desire to contribute to the upcoming regional developer summit.",
        currentSituation: "Over the past 4 weeks, Ananya was assigned to manage speaker outreach, coordinate venue logistics, and maintain sponsor tracking spreadsheets. She has missed 4 consecutive deadlines, submitted half-filled tracking sheets, and failed to follow up with 10 keynote speakers. In team meetings, she sits quietly and nods; when asked asynchronously about delays, she cites illness or laptop malfunctions. Yesterday, she turned off read receipts and did not show up to the weekly sync.",
        stakeholders: [
          "Ananya (struggling volunteer, withdrawing due to unexpressed distress)",
          "Event Lead (frustrated by missed deadlines, demanding Ananya's removal from the team)",
          "Club Mentor (committed to student development and empathetic problem-solving)",
          "Keynote Speakers (waiting for logistic details, risking event credibility)",
          "Peer Volunteers (covering Ananya's overdue tasks with growing resentment)"
        ],
        knownInformation: [
          "Ananya's initial design submissions were world-class and showed extraordinary creative ability.",
          "She has never previously managed multi-variable logistical spreadsheets or formal corporate correspondence.",
          "Her academic GPA recently slipped, causing severe family pressure regarding extracurricular time.",
          "The event lead publicly called out 'unreliable team members' in a general WhatsApp group."
        ],
        constraints: [
          "Speaker logistics must be locked within 10 days.",
          "The event team is operating at peak stress and cannot absorb continued incomplete tasks.",
          "Removing Ananya without understanding the root cause will reinforce feelings of failure and trigger permanent club drop-out."
        ],
        hiddenDetails: "Ananya suffers from acute imposter syndrome and social anxiety when communicating with senior corporate speakers. She does not know how to use complex spreadsheet formulas and was too terrified to ask for help after seeing other leads effortlessly discuss logistics.",
        initialChallenge: "Uncover the authentic human obstacles behind apparent negligence and task avoidance.",
        finalDecisionChallenge: "Formulate a compassionate realignment and skill-building pathway that recovers Ananya's confidence and secures event deliverables.",
        assessmentCompetencies: ["Empathetic Inquiry", "Imposter Syndrome Remediation", "Role Realignment", "Safe Space Creation", "Strengths-Based Coaching"],
        difficultyLevel: "HIGH / CHALLENGING",
        version: 1,
        context: "Ananya missed 4 straight logistics deadlines and is ghosting messages. The event lead wants her expelled immediately. However, Ananya is an exceptional designer struggling with imposter syndrome and fear of spreadsheets/corporate emails. You must investigate the real problem, coach her through vulnerability, and realign her role.",
        questions: [
          {
            orderNumber: 1,
            questionText: "Why is task avoidance and ghosting frequently a symptom of intense fear and shame rather than simple laziness or apathy in student organizations?",
            competencyTested: "Underlying Psychology Analysis",
            guidance: "Candidate must articulate the mechanics of imposter syndrome, fear of exposure, shame spirals, and avoidance behavior."
          },
          {
            orderNumber: 2,
            questionText: "How did the event lead's public call-out on WhatsApp exacerbate Ananya's withdrawal and damage team psychological safety?",
            competencyTested: "Communication Impact Assessment",
            guidance: "Evaluate candidate's understanding of public shaming, trust destruction, and defensive isolation."
          },
          {
            orderNumber: 3,
            questionText: "Design a gentle, low-pressure re-engagement outreach message to Ananya that encourages her to meet privately without fear of punishment.",
            competencyTested: "Empathetic Outreach Design",
            guidance: "Look for warm, non-accusatory language, clear intent to support rather than scold, and flexible meeting terms."
          },
          {
            orderNumber: 4,
            questionText: "During the 1-on-1 meeting, what diagnostic questions will you ask to help Ananya articulate her genuine struggles without feeling humiliated?",
            competencyTested: "Diagnostic Coaching Dialogue",
            guidance: "Candidate should use open-ended, normalizing questions ('Which part of the workflow felt heaviest?') to uncover skill gaps and anxiety."
          },
          {
            orderNumber: 5,
            questionText: "Once Ananya confesses her fear of corporate email outreach and spreadsheet confusion, what immediate reassurance and framing do you provide?",
            competencyTested: "Imposter Syndrome Remediation",
            guidance: "Look for normalization of learning curves, separating personal self-worth from technical familiarity, and validating her creative strengths."
          },
          {
            orderNumber: 6,
            questionText: "How do you restructure Ananya's responsibilities to align with her proven creative design strengths while scaffolding her logistics learning?",
            competencyTested: "Strengths-Based Role Realignment",
            guidance: "Candidate should transition her to lead visual branding and marketing design while pairing her with a peer buddy for logistics exposure."
          },
          {
            orderNumber: 7,
            questionText: "Constraint Update: The event lead objects to the role change, insisting Ananya must 'finish what she started' or be removed to set an example. How do you mentor the event lead?",
            competencyTested: "Peer Leadership Coaching",
            guidance: "Candidate must coach the event lead on emotional intelligence, adaptive delegation, and the difference between punishment and development."
          },
          {
            orderNumber: 8,
            questionText: "New Development: Ananya delivers a stunning visual identity and stage banner design within 48 hours, receiving high praise from external speakers.",
            newInformation: "Breakthrough Contribution: Ananya delivers an exceptional 15-page visual branding kit and stage backdrop that dazzles the entire committee.",
            competencyTested: "Positive Reinforcement & Growth Momentum",
            guidance: "Candidate should leverage this success to solidify Ananya's confidence and repair peer perceptions."
          },
          {
            orderNumber: 9,
            questionText: "How do you use this breakthrough moment to publicly celebrate Ananya's contribution and reintegrate her fully into team trust?",
            competencyTested: "Public Recognition & Reintegration",
            guidance: "Look for intentional, authentic public appreciation, restoring her standing among peers without highlighting past struggles."
          },
          {
            orderNumber: 10,
            questionText: "Outline a systemic onboarding and peer-buddy framework to prevent future recruits from falling into the same isolation trap.",
            competencyTested: "Systemic Mentoring Architecture",
            guidance: "Assess onboarding checklists, safe check-in intervals, skill scaffolding, and culture of asking for help."
          }
        ]
      },
      {
        code: "MP-C",
        title: "Case C: Critical Deployment Failure & Severe Disengagement Recovery",
        shortDescription: "A dedicated junior lead accidentally drops the live production database during a major recruitment drive, experiences devastating guilt, and submits a resignation letter.",
        background: "Karthik, a 2nd-year lead who has been one of the most reliable, hardworking contributors in the club, was assigned to perform database migrations for the annual membership portal. The portal was actively handling 800+ concurrent student applicant registrations.",
        currentSituation: "At 11:30 PM, Karthik ran an unverified migration script against the production database instead of the staging environment, dropping the primary candidate application table. Because backups had not been automated by the senior DevOps lead, 450 candidate submissions and essay responses were permanently corrupted. The incident forced the club to extend the deadline and issue a public apology. Karthik is overwhelmed by humiliation, believes he has ruined the club's reputation, and submitted an immediate resignation letter stating: 'I am not cut out for engineering and should not be trusted with anything.'",
        stakeholders: [
          "Karthik (devastated junior lead, experiencing extreme guilt and acute panic)",
          "Senior DevOps Lead (failed to configure automated backups and environment safeguards)",
          "Club Executive Board (managing public fallout and applicant communications)",
          "800+ Student Applicants (confused by portal crash and re-submission requests)",
          "Faculty Advisor (demanding an incident report and accountability)"
        ],
        knownInformation: [
          "Karthik had worked 14 consecutive hours without sleep prior to the incident due to poor project planning.",
          "The production database credentials were hardcoded in a shared config file with zero access controls.",
          "Karthik has an impeccable record of 100+ successfully completed tasks prior to this single mistake.",
          "Partial data logs exist in CloudWatch that can recover ~70% of candidate records if parsed systematically."
        ],
        constraints: [
          "Official incident report must be submitted to the Faculty Advisor in 48 hours.",
          "Portal must be rebuilt and secured within 24 hours.",
          "Accepting Karthik's resignation will shatter team morale and establish a culture of fear where mistakes are fatal."
        ],
        hiddenDetails: "The root cause of the failure was an organizational and architectural failure (no staging isolation, hardcoded root credentials, sleep-deprived scheduling), not individual incompetence. Karthik is taking 100% of the blame for a systemic breakdown.",
        initialChallenge: "Reframe a catastrophic technical failure from individual culpability to blameless systemic analysis.",
        finalDecisionChallenge: "Lead an empathetic crisis post-mortem that restores Karthik's psychological resilience and builds robust engineering guardrails.",
        assessmentCompetencies: ["Blameless Post-Mortem Leadership", "Crisis Empathy", "Resilience Coaching", "Engineering Safety Culture", "Restorative Mentorship"],
        difficultyLevel: "HIGH / CHALLENGING",
        version: 1,
        context: "Karthik accidentally dropped the production database with 450 applicant records due to exhaustion and lack of environment safeguards. Crushed by guilt, he submitted his resignation. You must manage the crisis, reject the resignation constructively, conduct a blameless post-mortem, and mentor Karthik back to confidence.",
        questions: [
          {
            orderNumber: 1,
            questionText: "How do you distinguish between individual operational error and systemic engineering failure in this catastrophic database loss?",
            competencyTested: "Systemic vs Individual Causation",
            guidance: "Candidate must identify absence of environment isolation, hardcoded prod keys, missing backups, and exhaustion as systemic root causes."
          },
          {
            orderNumber: 2,
            questionText: "What is your immediate response to Karthik's resignation letter, and why is accepting it organizational negligence?",
            competencyTested: "Crisis Mentoring & Retention",
            guidance: "Candidate must firmly reject the resignation, validate Karthik's emotional state, and emphasize shared systemic responsibility."
          },
          {
            orderNumber: 3,
            questionText: "Outline the key principles of a 'Blameless Post-Mortem' and explain how you will conduct the incident review meeting with the entire team.",
            competencyTested: "Blameless Post-Mortem Methodology",
            guidance: "Look for focus on 'how' the system allowed the failure rather than 'who' ran the command, fostering learning over retribution."
          },
          {
            orderNumber: 4,
            questionText: "How do you address the Senior DevOps Lead's accountability for omitting automated backups without turning the session into a witch hunt?",
            competencyTested: "Constructive Accountability",
            guidance: "Candidate should guide the Senior Lead to take constructive ownership of infrastructure weaknesses and lead the remediation."
          },
          {
            orderNumber: 5,
            questionText: "Design a collaborative task involving Karthik directly in the recovery of CloudWatch logs to help him regain immediate technical confidence.",
            competencyTested: "Active Recovery & Confidence Rebuilding",
            guidance: "Candidate should pair Karthik with a senior mentor to successfully extract logs, transforming failure into an active recovery triumph."
          },
          {
            orderNumber: 6,
            questionText: "How will you draft the public announcement and applicant apology to preserve club credibility while shielding Karthik's identity?",
            competencyTested: "Public Crisis Communication & Team Protection",
            guidance: "Candidate should craft transparent, professional institutional messaging taking collective responsibility without scapegoating."
          },
          {
            orderNumber: 7,
            questionText: "Constraint Update: The Faculty Advisor demands the name of the specific student who dropped the database for disciplinary action. How do you defend your team?",
            competencyTested: "Executive Shielding & Representation",
            guidance: "Candidate must respectfully protect the individual student, presenting the incident as an engineering process failure backed by a comprehensive fix."
          },
          {
            orderNumber: 8,
            questionText: "New Development: 48 hours later, Karthik and the team successfully recover 92% of the lost records and deploy an automated CI/CD backup pipeline.",
            newInformation: "Recovery Triumph: Karthik successfully writes a log parser recovering 92% of candidate entries, and the portal goes live with immutable backup replicas.",
            competencyTested: "Celebrating Resilience & Closure",
            guidance: "Candidate should anchor this milestone as an exemplary demonstration of engineering grit and organizational maturity."
          },
          {
            orderNumber: 9,
            questionText: "How do you institutionalize this experience so that the entire club internalizes failure as a catalyst for engineering excellence?",
            competencyTested: "Cultural Institutionalization of Resilience",
            guidance: "Look for tech-talk case studies, documented runbooks, chaos engineering drills, and resilience badges."
          },
          {
            orderNumber: 10,
            questionText: "Provide your long-term mentorship plan for Karthik over the next 3 months to develop him into the club's Head of Infrastructure Reliability.",
            competencyTested: "Transformational Leadership Mentorship",
            guidance: "Assess transformational coaching, progressive responsibility, specialized training, and emotional check-ins."
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 4. RESEARCH & OBSERVATION (Hidden Role: Investigator)
  // =========================================================================
  {
    area: "Research & Observation",
    hiddenRole: "Investigator",
    cases: [
      {
        code: "RO-A",
        title: "Case A: The Contradictory Hackathon Post-Mortem & Conflicting Stakeholder Accounts",
        shortDescription: "Following an inter-college hackathon, three committee leads provide mutually contradictory accounts regarding budget overruns, hardware disappearance, and judge dissatisfaction.",
        background: "The 36-hour 'HackXcelerator' concluded with 250 participants. Post-event accounting revealed an unexplained $1,400 financial deficit and the disappearance of 8 high-end IoT development kits (value: $900). Furthermore, the keynote industry judges submitted a scathing private letter threatening never to return.",
        currentSituation: "The executive board launched an internal investigation and interviewed the three lead coordinators: Finance Lead Aryan, Logistics Lead Bhavna, and Sponsorship Lead Chetan. Aryan claims Logistics overspent wildly on unauthorized gourmet catering and lost the IoT kits due to sloppy checkouts. Bhavna claims Sponsorship secretly promised luxury hospitality to unapproved guests and that Aryan mismanaged cash receipts. Chetan claims both Aryan and Bhavna are conspiring to cover up their own budget incompetence. All three provide conflicting spreadsheets and receipts.",
        stakeholders: [
          "Executive Board (seeking objective truth, financial reconciliation, and asset recovery)",
          "Aryan (Finance Lead, submitting incomplete paper receipts)",
          "Bhavna (Logistics Lead, claiming inventory was stolen due to lack of security guard)",
          "Chetan (Sponsorship Lead, accused of making unauthorized verbal commitments)",
          "External Keynote Judges (demanding explanation for unfulfilled VIP logistics promises)"
        ],
        knownInformation: [
          "Catering invoice shows $1,800 billed for 350 meals, but badge check-in logs show only 210 meals scanned.",
          "The hardware inventory log has 8 missing entries with illegible handwritten signatures between 2:00 AM and 4:00 AM.",
          "Chetan exchanged 24 WhatsApp messages with the head judge promising a private suite, which the club never budgeted for.",
          "The campus security guard stationed at the venue entrance logged two private vehicles entering the loading dock at 3:15 AM."
        ],
        constraints: [
          "Audit report must be completed within 72 hours before student council budget review.",
          "Direct accusations without verifiable audit trails will trigger legal/disciplinary counter-suits among student leads.",
          "Missing IoT hardware was borrowed from the University Robotics Lab and must be returned in 5 days."
        ],
        hiddenDetails: "Careful cross-referencing reveals that the catering company overcharged by 140 plates due to a contract typo signed by Chetan, while the 'missing' IoT kits were locked inside the Robotics Lab safe by a cautious volunteer at 3:00 AM without updating the paper log.",
        initialChallenge: "Analyze messy, conflicting multi-source testimonials and audit forensic data to separate objective facts from emotional accusations.",
        finalDecisionChallenge: "Deliver an evidence-based investigative audit report that reconstructs the factual sequence of events with zero reliance on conjecture.",
        assessmentCompetencies: ["Root Cause Investigation", "Forensic Data Reconciliation", "Bias Detection", "Fact vs Assumption Separation", "Structured Inquiry"],
        difficultyLevel: "HIGH / CHALLENGING",
        version: 1,
        context: "Following a hackathon with a $1,400 deficit, 8 missing IoT kits, and furious judges, three leads present mutually contradictory stories blaming each other. You must analyze conflicting spreadsheets, badge scan logs, invoices, and gate registries to uncover the objective truth.",
        questions: [
          {
            orderNumber: 1,
            questionText: "What specific methodologies will you use to cross-reference the contradictory statements of Aryan, Bhavna, and Chetan against primary data sources?",
            competencyTested: "Forensic Methodology & Triangulation",
            guidance: "Candidate should establish primary objective sources (badge scans, gate logs, bank statements, timestamps) and triangulate against subjective claims."
          },
          {
            orderNumber: 2,
            questionText: "Identify the critical discrepancies between the catering invoice ($1,800 for 350 meals) and the physical badge scan records (210 meals). What hypotheses does this generate?",
            competencyTested: "Anomaly Detection & Hypothesis Generation",
            guidance: "Look for rigorous hypothesis formulation (vendor fraud, contract error, unauthorized distribution, ghost registrations) rather than jumping to theft accusations."
          },
          {
            orderNumber: 3,
            questionText: "What missing pieces of information or unexamined logs are essential to verify the location of the 8 missing IoT development kits?",
            competencyTested: "Missing Information Identification",
            guidance: "Candidate should seek physical keycard logs to lab doors, lab safe access registries, volunteer shift rosters, and CCTV footage."
          },
          {
            orderNumber: 4,
            questionText: "How do you evaluate Chetan's unauthorized WhatsApp commitments to the keynote judges from an organizational governance standpoint?",
            competencyTested: "Authority & Protocol Evaluation",
            guidance: "Candidate must analyze rogue delegation, lack of centralized contracting protocols, and boundary violations."
          },
          {
            orderNumber: 5,
            questionText: "Design a structured, neutral interrogation interview protocol for questioning the 3:15 AM venue loading dock security guard.",
            competencyTested: "Inquiry & Interview Design",
            guidance: "Look for open-ended, non-leading questions focusing on vehicle license plates, driver identities, packages loaded/unloaded, and gate passes."
          },
          {
            orderNumber: 6,
            questionText: "Synthesize the timeline of events between 1:00 AM and 5:00 AM on hackathon night based on all verified data points.",
            competencyTested: "Timeline Reconstruction",
            guidance: "Candidate should chronologically align timestamps, badge scans, gate logs, and verified WhatsApp messages into a coherent sequence."
          },
          {
            orderNumber: 7,
            questionText: "Constraint Update: The catering vendor insists on full payment within 24 hours, threatening to report the club to the University Accounts Division. How do you stall and audit the contract?",
            competencyTested: "Commercial Audit Under Pressure",
            guidance: "Candidate should present verified scan data, request delivery verification signatures, and invoke standard discrepancy clauses."
          },
          {
            orderNumber: 8,
            questionText: "New Development: The Robotics Lab technician returns from leave and confirms all 8 IoT kits are safe inside Cabinet B, locked by volunteer Sneha at 3:10 AM for security.",
            newInformation: "Hardware Located: All 8 IoT kits are discovered safely locked in the Robotics Lab cabinet, placed there by volunteer Sneha who forgot to log it on paper.",
            competencyTested: "Data Update & Assumption Revision",
            guidance: "Candidate must update findings instantly, clear falsely accused parties, and focus on the paper logging process vulnerability."
          },
          {
            orderNumber: 9,
            questionText: "How does the discovery of the IoT kits reshape your evaluation of Bhavna's logistical oversight versus systemic process flaws?",
            competencyTested: "Root Cause Recalibration",
            guidance: "Candidate should separate individual malicious intent from inadequate inventory tracking procedures and night-shift handover protocols."
          },
          {
            orderNumber: 10,
            questionText: "Present your definitive, evidence-backed Investigative Audit Report, outlining verified facts, financial reconciliations, vendor dispute resolutions, and new governance controls.",
            competencyTested: "Comprehensive Investigative Synthesis",
            guidance: "Assess factual clarity, zero bias, thorough financial recovery, accountability measures, and robust procedural safeguards."
          }
        ]
      },
      {
        code: "RO-B",
        title: "Case B: Vanity Metrics vs. Engagement Reality: The 500-Attendee Workshop Audit",
        shortDescription: "A flagship Cloud computing workshop series reports record-breaking 500 registrations, but qualitative signals reveal massive drop-offs, zero GitHub activity, and artificial feedback scores.",
        background: "The club's Cloud Track launched a four-week 'Cloud DevOps Mastery' series with heavy promotional backing. At the conclusion, the track lead presented an executive report boasting 512 registrations, 420 peak Zoom participants, and an average feedback rating of 4.9/5.0 across 300 survey responses.",
        currentSituation: "The Vice President of Technology noticed that despite the stellar numbers, only 4 students submitted the final hands-on capstone project on GitHub. Furthermore, the club's Discord server had zero technical discussions regarding Cloud throughout the month. When checking the feedback survey data, a data analyst noticed that 85% of 5-star survey responses were submitted within an 18-minute window from identical IP subnets using automated generic comments like 'Great session!' and 'Very useful!'.",
        stakeholders: [
          "Track Lead (defending the workshop success using high-level headline metrics)",
          "Executive Committee (evaluating whether to allocate $1,200 for advanced cloud certifications)",
          "Student Participants (500 registered, actual experience unknown)",
          "Club Data & Research Team (tasked with uncovering real engagement depth)",
          "Cloud Corporate Sponsor (providing $500 in cloud credits expecting real student deployments)"
        ],
        knownInformation: [
          "Zoom logs show 420 attendees joined in the first 10 minutes, but average watch duration was only 14 minutes in a 90-minute session.",
          "Attendance tracking was linked to a mandatory certificate attendance form posted at the 12-minute mark.",
          "The track lead ran a contest giving away 5 mechanical keyboards to participants who filled out the feedback form.",
          "AWS/GCP free credit redemption codes were claimed by 380 users, but cloud console telemetry shows 92% of accounts never launched a single VM."
        ],
        constraints: [
          "The sponsor requires an audited engagement report within 5 business days before releasing the next tranche of funding.",
          "Track lead is defensive, claiming 'industry standards show high drop-offs in virtual workshops'.",
          "Decisions must be driven by data evidence rather than subjective skepticism."
        ],
        hiddenDetails: "The workshop structure was passive lecture-only with zero interactive debugging or beginner onboarding. Attendees joined solely to claim attendance certificates and keyboard giveaway entries, leaving Zoom immediately afterward. The 4.9/5 rating was systematically distorted by the giveaway incentive.",
        initialChallenge: "Deconstruct the superficial headline vanity metrics using deep telemetry, behavioral data, and cohort analysis.",
        finalDecisionChallenge: "Deliver an unsparing, data-driven diagnostic report on genuine community learning retention and overhaul educational tracking.",
        assessmentCompetencies: ["Data Telemetry Analysis", "Vanity Metric Deconstruction", "Incentive Distortion Discovery", "Pedagogical Diagnostics", "Auditing Integrity"],
        difficultyLevel: "HIGH / CHALLENGING",
        version: 1,
        context: "A Cloud workshop reported 500+ attendees and 4.9/5 satisfaction, but only 4 students built the project, Zoom retention collapsed after 14 minutes, and feedback surveys were gaming giveaways. You must investigate the data, deconstruct the vanity metrics, and uncover true student engagement.",
        questions: [
          {
            orderNumber: 1,
            questionText: "What is the critical analytical distinction between 'vanity metrics' (registrations, initial joins) and 'value metrics' (watch time, repository commits, cloud deployments)?",
            competencyTested: "Metric Quality & Analytical Framework",
            guidance: "Candidate must articulate how surface indicators mask educational failure and why behavioral retention telemetry is paramount."
          },
          {
            orderNumber: 2,
            questionText: "Analyze the statistical anomalies in the survey feedback data (85% 5-star ratings submitted in 18 minutes from identical IP ranges). What does this reveal about incentive distortion?",
            competencyTested: "Statistical Anomaly & Bias Detection",
            guidance: "Candidate should explain how linking giveaways and certificates to feedback forms produces severe positive response bias and fraudulent submissions."
          },
          {
            orderNumber: 3,
            questionText: "Design a comprehensive cohort retention curve analyzing student drop-off across the 4 weeks using Zoom timestamps, credit redemption, and GitHub commits.",
            competencyTested: "Cohort Analysis & Telemetry Modeling",
            guidance: "Look for structured funnel visualization: Sign-up -> Join -> 15m Retention -> 60m Retention -> Credit Activation -> Code Submission."
          },
          {
            orderNumber: 4,
            questionText: "What qualitative research methods (e.g. 1-on-1 interviews, drop-out surveys, focus groups) will you deploy to understand why genuine students abandoned the course?",
            competencyTested: "Qualitative Inquiry & Root Cause Probing",
            guidance: "Candidate should design neutral, non-judgmental student interviews probing curriculum pacing, technical roadblocks, and prerequisite gaps."
          },
          {
            orderNumber: 5,
            questionText: "How do you handle the difficult conversation with the Track Lead to present these unsparing audit findings without causing destructive defensiveness?",
            competencyTested: "Data-Driven Constructive Feedback",
            guidance: "Candidate should ground the discussion objectively in server logs and telemetry rather than personal blame, focusing on course architecture."
          },
          {
            orderNumber: 6,
            questionText: "What specific pedagogical flaws in the workshop delivery are indicated by the 14-minute average watch duration?",
            competencyTested: "Pedagogical Diagnosis",
            guidance: "Look for diagnosis of passive monologue lecturing, lack of immediate interactive feedback, steep prerequisite cliff, and delayed hands-on practice."
          },
          {
            orderNumber: 7,
            questionText: "Constraint Update: The corporate sponsor notices the low GitHub submissions and demands an explanation before signing off on the $1,200 certificate grant. How do you respond transparently?",
            competencyTested: "Sponsor Transparency & Trust Preservation",
            guidance: "Candidate must deliver an honest, transparent diagnostic audit coupled with an actionable remedial restructuring plan."
          },
          {
            orderNumber: 8,
            questionText: "New Development: A focus group of 15 sincere beginners reveals they got completely stuck on Docker installation in Step 1 and were too intimidated to ask questions in the 500-person chat.",
            newInformation: "Root Blocker Identified: Qualitative interviews reveal 70% of attendees failed because of environment setup errors on Windows laptops during the first 15 minutes.",
            competencyTested: "Insight Synthesis & Root Blocker Discovery",
            guidance: "Candidate should identify environmental setup friction and lack of breakout room support as the critical choke point."
          },
          {
            orderNumber: 9,
            questionText: "How do you redesign the technical onboarding architecture (e.g. browser-based Cloud IDEs, interactive sandboxes, breakout mentors) to eliminate setup friction?",
            competencyTested: "Technical Solution Engineering",
            guidance: "Look for cloud-hosted environments (GitHub Codespaces, Google Cloud Shell) eliminating local machine configuration barriers."
          },
          {
            orderNumber: 10,
            questionText: "Formulate the club's permanent 'Educational Measurement & Analytics Standard', defining mandatory telemetry requirements and banning corrupted feedback loops.",
            competencyTested: "Institutional Standards Formulation",
            guidance: "Assess robust measurement standards, separation of giveaways from feedback, verified skill milestone gating, and honest metric reporting."
          }
        ]
      },
      {
        code: "RO-C",
        title: "Case C: Recurrent Project Deadlock: Uncovering Hidden Technical & Social Blockers",
        shortDescription: "A flagship mobile app project has missed 5 consecutive sprint milestones. The mobile leads blame backend API delays, while backend leads blame changing mobile requirements.",
        background: "For three months, the club has been developing 'CampusSphere', an integrated mobile app for college notices, cafeteria payments, and club event registrations. The team consists of 4 Flutter mobile developers, 4 Node.js backend developers, and 2 UI/UX designers, led by an overall Product Manager.",
        currentSituation: "The project has stalled completely. Sprint 4, 5, and 6 deliverables were all missed. In weekly retrospectives, the Mobile Lead heatedly claims: 'We cannot build UI because the backend team has not deployed the authentication and payment endpoints.' The Backend Lead counters: 'The mobile team changes data models every three days without updating Swagger, and the designers haven't finalized the payment wireframes.' The Product Manager is paralyzed, unable to determine where the real bottleneck lies.",
        stakeholders: [
          "Product Manager (struggling to establish accountability across silos)",
          "Mobile Dev Team (4 engineers claiming to be blocked on APIs)",
          "Backend Dev Team (4 engineers claiming to be blocked on changing schemas)",
          "UI/UX Design Team (2 designers caught in crossfire between teams)",
          "Club Leadership (demanding a working beta release before the semester ends)"
        ],
        knownInformation: [
          "Git repository logs show 120 commits on mobile branches, but 85% are isolated styling tweaks with zero API integration.",
          "Backend repository has 40 merged PRs, but only 2 endpoints are deployed to the AWS staging server; the rest only run on local machines.",
          "The shared Postman / Swagger documentation collection was last updated 42 days ago.",
          "Figma design system has 3 different conflicting versions of the payment user flow."
        ],
        constraints: [
          "App must launch in 21 days for the student union election voting trial.",
          "No budget for paid project management tooling; must use open-source/free tier tools.",
          "Team members are working remotely across different class schedules."
        ],
        hiddenDetails: "Neither team uses automated contract testing or mock servers. Mobile devs were waiting for real production APIs instead of generating local mock JSON data, while backend devs had never set up a CI/CD deployment pipeline to staging and were manually deploying via SSH, which broke two weeks ago.",
        initialChallenge: "Conduct an impartial, evidence-based technical and operational audit of the development pipeline to pinpoint the true bottleneck.",
        finalDecisionChallenge: "Architect an end-to-end continuous integration, API contract, and agile collaboration reset that breaks the deadlock.",
        assessmentCompetencies: ["Technical Workflow Auditing", "Root Cause Discovery", "Contract & Schema Governance", "Silo Elimination", "Agile Process Optimization"],
        difficultyLevel: "HIGH / CHALLENGING",
        version: 1,
        context: "A mobile app project missed 3 consecutive sprints due to finger-pointing between mobile (blaming missing backend APIs) and backend (blaming unstable schemas). You must investigate git commits, staging deployments, API docs, and communication silos to diagnose the real blockers and fix the engineering workflow.",
        questions: [
          {
            orderNumber: 1,
            questionText: "What specific technical artifacts (git commit histories, CI/CD logs, Postman collections, staging server uptime) will you inspect to verify the competing claims?",
            competencyTested: "Artifact Audit Planning",
            guidance: "Candidate must identify concrete technical telemetry (commit timestamps, build logs, deployment configs, API schema diffs) rather than relying on verbal claims."
          },
          {
            orderNumber: 2,
            questionText: "Analyze the finding that backend endpoints were only running on localhost and Swagger was 42 days out of date. What does this indicate about team engineering maturity?",
            competencyTested: "Engineering Maturity Diagnosis",
            guidance: "Look for diagnosis of absent API contract standards, lack of automated staging CI/CD, and broken integration discipline."
          },
          {
            orderNumber: 3,
            questionText: "Why were the mobile developers at fault for remaining completely blocked instead of generating mock API servers or contract stubs?",
            competencyTested: "Technical Dependency Analysis",
            guidance: "Candidate should explain decoupling via mock JSON / Mirage.js / MSW so frontend progress is never blocked on live backend deployment."
          },
          {
            orderNumber: 4,
            questionText: "How did the lack of single-source-of-truth design governance in Figma contribute to the schema churn between mobile and backend?",
            competencyTested: "Design-to-Dev Pipeline Analysis",
            guidance: "Candidate should analyze how unversioned UI mockups trigger shifting data models and uncoordinated backend migrations."
          },
          {
            orderNumber: 5,
            questionText: "Design a 3-hour 'Emergency Alignment Workshop' to force mobile, backend, and design leads to lock down immutable API contracts.",
            competencyTested: "Facilitation & Alignment Design",
            guidance: "Look for structured OpenAPI / Swagger schema definition sessions, freezing v1 endpoints, and defining contract schemas collaboratively."
          },
          {
            orderNumber: 6,
            questionText: "Establish an automated CI/CD and Mocking pipeline architecture to ensure frontend and backend can develop concurrently without blocking.",
            competencyTested: "Engineering Systems Architecture",
            guidance: "Candidate should detail GitHub Actions CI pipelines auto-deploying to staging on PR merge, with automated contract testing."
          },
          {
            orderNumber: 7,
            questionText: "Constraint Update: The AWS staging server credentials were lost when the previous DevOps lead graduated. How do you deploy a zero-cost replacement staging environment in 4 hours?",
            competencyTested: "Rapid DevOps Remediation",
            guidance: "Look for quick cloud alternatives (Vercel, Render, Supabase, Railway, Docker on local lab server) with rapid env config."
          },
          {
            orderNumber: 8,
            questionText: "New Development: When testing the newly deployed staging authentication endpoint, the mobile app crashes due to an undocumented CORS and JWT token refresh error.",
            newInformation: "Integration Bug: The first live staging test reveals a fatal CORS policy blockage and JWT expiration mismatch that crashes the Flutter app.",
            competencyTested: "Technical Root Cause Debugging",
            guidance: "Candidate should systematically debug headers, CORS whitelist origin configs, and mobile HTTP interceptor token refresh logic."
          },
          {
            orderNumber: 9,
            questionText: "How do you coordinate a rapid pair-programming triage session between the Mobile Lead and Backend Lead to resolve the authentication crash in real time?",
            competencyTested: "Cross-Functional Collaboration Under Pressure",
            guidance: "Candidate should structure live debugging with network inspection proxies (Charles / Postman / DevTools) to eliminate blame."
          },
          {
            orderNumber: 10,
            questionText: "Deliver your comprehensive Sprint Recovery Plan and Daily Standup Protocol for the remaining 21 days until app release.",
            competencyTested: "Agile Execution & Project Recovery",
            guidance: "Assess burndown charts, strict definition of done, daily blocker standups, automated regression testing, and user acceptance criteria."
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 5. COMMUNICATION & INFLUENCE (Hidden Role: Communicator)
  // =========================================================================
  {
    area: "Communication & Influence",
    hiddenRole: "Communicator",
    cases: [
      {
        code: "CI-A",
        title: "Case A: Communicating Unpopular Mandatory Restructuring to Resistant Leads",
        shortDescription: "To maintain official college club status, the executive committee must enforce strict new attendance tracking, reduce autonomous budget spending, and absorb a struggling departmental club.",
        background: "The University Student Affairs Board issued a mandatory compliance decree: all student technical clubs must merge redundant sub-groups, enforce biometric meeting logs, and submit every expense over $50 for pre-approval. Failure to comply within 14 days will result in revocation of official recognition, loss of lab rooms, and forfeiture of all bank accounts.",
        currentSituation: "The club's 12 sub-team leads and 30 active student organizers are furious. They view the decree as bureaucratic tyranny and blame the Executive Board for 'selling out to administration'. A petition with 80 student signatures is circulating demanding the club go 'underground/rogue' as an unofficial collective. The executive committee must communicate the mandatory changes at a mandatory all-hands town hall meeting tomorrow evening.",
        stakeholders: [
          "Executive Board (must enforce compliance while retaining team morale and trust)",
          "12 Sub-team Leads (fiercely protective of their autonomy, project budgets, and informal culture)",
          "Rebel Faction / Petition Organizers (threatening mass walkout to form an unsanctioned club)",
          "Struggling Departmental Club (being absorbed, terrified of losing their unique identity)",
          "University Student Affairs Board (watching for executive leadership and compliance execution)"
        ],
        knownInformation: [
          "Operating as an 'unofficial underground club' would make booking on-campus auditoriums, hosting corporate sponsors, and issuing valid certificates illegal under university bylaws.",
          "Pre-approval for expenses over $50 takes 48 hours if submitted via the new digital portal.",
          "The club being absorbed has 40 passionate members who specialize in hardware/embedded systems, complementing the software focus.",
          "Trust in the Executive Board is at an all-time low due to previous top-down, non-transparent decisions."
        ],
        constraints: [
          "Town Hall is scheduled for 6:00 PM tomorrow with 100+ attendees expected.",
          "Administrative compliance paperwork must be submitted in 7 days with all lead signatures.",
          "Any public shouting match or leaked hostility will invite immediate administrative intervention."
        ],
        hiddenDetails: "The leads' intense anger is not about the paperwork; it is about feeling blindsided and disrespected by the executive board's lack of prior consultation. If approached with empathy and co-ownership, they will accept the operational necessity.",
        initialChallenge: "Deconstruct the emotional and psychological resistance to mandatory organizational changes.",
        finalDecisionChallenge: "Architect and execute a comprehensive communication campaign, town hall narrative, and stakeholder alignment strategy.",
        assessmentCompetencies: ["Town Hall Crisis Communication", "Stakeholder Influence", "Narrative Framing", "Active De-escalation", "Change Management"],
        difficultyLevel: "HIGH / CHALLENGING",
        version: 1,
        context: "Mandatory university rules require absorbing a rival club, enforcing administrative expense approvals, and tracking attendance, or face shutdown. 12 leads are threatening a mass walkout. You must craft the strategic communication architecture, de-escalate fury at the Town Hall, and rally the community behind the restructuring.",
        questions: [
          {
            orderNumber: 1,
            questionText: "What are the core emotional and narrative drivers behind the leads' fierce resistance to the mandatory restructuring?",
            competencyTested: "Audience Empathy & Resistance Analysis",
            guidance: "Candidate must recognize feelings of disempowerment, loss of autonomy, identity threat, and perceived executive betrayal."
          },
          {
            orderNumber: 2,
            questionText: "Why would framing this change as 'The Administration is forcing us, so we have no choice' be a disastrous communication failure?",
            competencyTested: "Leadership Narrative Accountability",
            guidance: "Candidate should analyze how abdication of leadership breeds victim mentality, cynicism, and loss of institutional respect."
          },
          {
            orderNumber: 3,
            questionText: "Structure the 4-part communication narrative for the opening 10-minute address at the All-Hands Town Hall (Context -> Vulnerability -> Shared Vision -> Tactical Path).",
            competencyTested: "Speech & Narrative Architecture",
            guidance: "Look for high emotional resonance: acknowledging frustration, framing compliance as a shield protecting their creative freedom, and welcoming the merged hardware team."
          },
          {
            orderNumber: 4,
            questionText: "How will you conduct private pre-alignment meetings with the top 3 influential rebel leads before the public Town Hall?",
            competencyTested: "Pre-Alignment & Coalition Building",
            guidance: "Candidate should detail 1-on-1 influence tactics: listening deeply, validating concerns, giving them ownership over the transition committee."
          },
          {
            orderNumber: 5,
            questionText: "How will you address and warmly welcome the absorbed hardware club members so they feel like valued partners rather than conquered subordinates?",
            competencyTested: "Inclusive Integration Communication",
            guidance: "Candidate should propose dedicated hardware track leadership, co-branded initiatives, and celebration of their domain expertise."
          },
          {
            orderNumber: 6,
            questionText: "Anticipate the 3 most aggressive, hostile questions that will be shouted from the floor during the Town Hall Q&A and write your exact responses.",
            competencyTested: "Crisis Q&A & Live De-escalation",
            guidance: "Assess emotional self-regulation, validating the underlying emotion, maintaining calm authority, and pivoting to shared purpose."
          },
          {
            orderNumber: 7,
            questionText: "Constraint Update: During the Town Hall, a lead interrupts and accuses the President of taking a personal bribe from the Dean to agree to the merger. How do you respond instantly?",
            competencyTested: "Public Defamation & Hostility Handling",
            guidance: "Candidate must remain completely composed, address the falsehood transparently without defensiveness, and offer open audit books."
          },
          {
            orderNumber: 8,
            questionText: "New Development: The President of the absorbed hardware club steps up to the microphone and unexpectedly expresses willingness to co-lead the new robotics initiative.",
            newInformation: "Public Turning Point: The absorbed Hardware Club President takes the mic, validates the benefits of combined software-hardware synergy, and endorses the merger.",
            competencyTested: "Momentum Capitalization & Unified Narrative",
            guidance: "Candidate should seize this pivotal moment to solidify unity, invite joint applause, and transition immediately to actionable collaborative planning."
          },
          {
            orderNumber: 9,
            questionText: "How do you immediately channel this breakthrough moment into concrete collaborative working groups before the Town Hall adjourns?",
            competencyTested: "Actionable Momentum Channeling",
            guidance: "Look for rapid formation of joint transition task forces, signing up leads for collaborative hackathons, and establishing open feedback channels."
          },
          {
            orderNumber: 10,
            questionText: "Draft the official post-town-hall memorandum and 30-day change roadmap to be sent to all 150 members and the Dean.",
            competencyTested: "Executive Written Communication",
            guidance: "Assess executive clarity, inspirational tone, transparent operational timelines, and clear empowerment structures."
          }
        ]
      },
      {
        code: "CI-B",
        title: "Case B: Public Tech Stack War: Mediating Senior Leads' Polarization",
        shortDescription: "Two highly respected senior leads engage in an escalating public flamewar on Discord and LinkedIn over club technical standards, dividing the membership into hostile factions.",
        background: "The tech club is initiating a multi-tier revamp of its digital infrastructure. Vikram (Head of Web Architecture, staunch advocate of pure Next.js/React and TypeScript) and Siddharth (Head of Cloud Systems, passionate advocate of Go microservices and Rust backend frameworks) are both final-year leaders with massive student followings.",
        currentSituation: "What started as an architectural debate in a private Slack channel has spilled into the main club Discord (800 members) and public LinkedIn posts. Vikram posted a scathing meme labeling Go enthusiasts as 'unimaginative CRUD developers', while Siddharth published a 2,000-word blog post dissecting 'Next.js bloated fragility' and calling Vikram's architecture 'amateurish front-end hype'. Junior members have polarized into two hostile camps ('The TS Guild' vs 'The Rust-Go Syndicate'), aggressively downvoting each other's pull requests and refusing to collaborate on joint projects.",
        stakeholders: [
          "Vikram (Web Lead, brilliant, proud, influential among frontend devs)",
          "Siddharth (Cloud Lead, systems expert, stubborn, influential among competitive coders)",
          "Junior Members (divided, confused, and adopting toxic elitist tech attitudes)",
          "External Tech Recruiters (noticing public LinkedIn infighting and questioning club maturity)",
          "Club Leadership (must restore team unity, establish engineering standards, and stop public brand damage)"
        ],
        knownInformation: [
          "Both leads are close personal friends outside the club whose egos were triggered during a technical critique.",
          "Both technical stacks are completely viable for different layers of the club's software ecosystem.",
          "Three joint cross-platform projects are currently frozen because contributors refuse to review opposite-faction code.",
          "Several tech alumni commented on LinkedIn: 'Sad to see childish framework wars destroying this club.'"
        ],
        constraints: [
          "A major sponsor recruitment mixer with visiting tech recruiters is happening in 5 days.",
          "Both leads have threatened to step down and take their respective follower bases with them if forced to apologize publicly.",
          "The dispute is eroding the psychological safety of beginners who now fear picking the 'wrong' technology."
        ],
        hiddenDetails: "The conflict is not about TypeScript vs Go; it is about personal validation and fear of losing technical dominance ahead of graduation. Both leads privately regret the public escalation but are too proud to make the first move toward reconciliation.",
        initialChallenge: "Deconstruct the interpersonal and technical drivers of the public conflict without taking sides in the framework debate.",
        finalDecisionChallenge: "Facilitate a high-impact mediation process that transforms a destructive flamewar into an inspiring model of collaborative engineering discourse.",
        assessmentCompetencies: ["Mediation & Conflict Transformation", "Public Brand Repair", "Ego Management", "Objective Architectural Synthesis", "Cultural Tone Setting"],
        difficultyLevel: "HIGH / CHALLENGING",
        version: 1,
        context: "Two senior leads ignited a toxic public tech-stack flamewar (Next.js/TS vs Go/Rust) across Discord and LinkedIn, splitting the club into warring factions and freezing 3 projects. With tech recruiters visiting in 5 days, you must de-escalate egos, reconcile the leaders, and unite the community.",
        questions: [
          {
            orderNumber: 1,
            questionText: "What are the deeper psychological and identity drivers turning a standard technical architecture debate into an ideological holy war?",
            competencyTested: "Ego & Identity Dynamics Analysis",
            guidance: "Candidate must analyze how technical choices become tied to ego, status, tribal identity, and fear of irrelevance."
          },
          {
            orderNumber: 2,
            questionText: "Analyze the reputational and cultural damage inflicted on junior members and external sponsors by this public dispute.",
            competencyTested: "Impact & Collateral Damage Assessment",
            guidance: "Look for analysis of beginner intimidation, elitist gatekeeping, broken PR reviews, and diminished employer perception."
          },
          {
            orderNumber: 3,
            questionText: "How will you structure the private mediation session with Vikram and Siddharth to bypass technical rationalizations and address the core interpersonal breakdown?",
            competencyTested: "Mediation Framework Design",
            guidance: "Candidate should establish ground rules (no tech talk for first 20 mins), refocus on their shared friendship/history, and highlight community damage."
          },
          {
            orderNumber: 4,
            questionText: "What conversational techniques will you use during mediation to allow both leaders to step down from their rigid public stances without losing face?",
            competencyTested: "Face-Saving De-escalation",
            guidance: "Look for empathetic reframing, acknowledging both of their brilliant contributions, and offering a collaborative joint exit narrative."
          },
          {
            orderNumber: 5,
            questionText: "Synthesize an objective, polyglot architectural compromise that assigns TypeScript/Next.js and Go/Rust to their respective optimal system domains.",
            competencyTested: "Architectural Synthesis & Pragmatism",
            guidance: "Candidate should formulate clean microservice boundaries: Next.js/React for UI and client apps, Go/Rust for high-throughput background services and API gateways."
          },
          {
            orderNumber: 6,
            questionText: "Design a joint public communication strategy (co-authored blog post, joint Discord AMA) where Vikram and Siddharth present a united front.",
            competencyTested: "Public Narrative Reversal",
            guidance: "Look for inspiring, mature joint messaging: 'Why Polyglot Engineering Wins', modeling professional intellectual humility and collaboration."
          },
          {
            orderNumber: 7,
            questionText: "Constraint Update: Siddharth initially refuses to delete his LinkedIn critique, arguing 'freedom of technical speech'. How do you persuade him to align?",
            competencyTested: "Persuasion & Professional Influence",
            guidance: "Candidate should appeal to his professional reputation with recruiters, showing how constructive tech dialogue differs from toxic personal attacks."
          },
          {
            orderNumber: 8,
            questionText: "New Development: The leads successfully record a joint technical podcast debating 'Right Tool for the Right Job', which goes viral campus-wide with 1,200 listens.",
            newInformation: "Viral Educational Success: Vikram and Siddharth co-host a live tech debate podcast with 1,200 listeners, turning their rivalry into the most educational event of the year.",
            competencyTested: "Transforming Conflict into Community Value",
            guidance: "Candidate should leverage this educational triumph to establish permanent collaborative technical symposiums."
          },
          {
            orderNumber: 9,
            questionText: "How do you re-establish code review culture and unfreeze the three stalled cross-platform projects following the reconciliation?",
            competencyTested: "Operational Recovery & Culture Reset",
            guidance: "Candidate should implement cross-faction pair reviews, pairing TS developers with Go developers on integrated features."
          },
          {
            orderNumber: 10,
            questionText: "Draft the club's permanent 'Code of Technical Discourse and Architectural Decision Records (ADR)' policy.",
            competencyTested: "Institutional Governance & ADR Standard",
            guidance: "Assess formal RFC/ADR processes, objective benchmarking criteria, and strict prohibition of ad hominem tech gatekeeping."
          }
        ]
      },
      {
        code: "CI-C",
        title: "Case C: Pitching an Ambitious Open Source Initiative to Risk-Averse Faculty",
        shortDescription: "The student club wants to replace the university's expensive, clunky commercial exam-hall seating software with an open-source student-built platform, facing deep faculty skepticism.",
        background: "Every semester, the university spends $8,000 licensing proprietary software to generate randomized exam seating plans, hall tickets, and invigilator rosters. The software frequently crashes, generates duplicate desk allocations, and lacks mobile accessibility. The club's open-source engineering team built an elegant, mathematically verified seating optimization platform ('ExamForge') during an internal hackathon.",
        currentSituation: "The club leadership requested an opportunity to pitch 'ExamForge' to the Controller of Examinations (CoE) and the Academic Deans to replace the commercial software for the upcoming semester finals (12,000 students). The Faculty Board is deeply risk-averse, viewing student-written code as fragile, unvetted, and vulnerable to security hacks by students seeking to game their seat allocations. The Chief Invigilator bluntly remarked: 'We cannot trust 20-year-old hobbyists with the integrity of university examinations.'",
        stakeholders: [
          "Controller of Examinations (CoE - hyper-cautious, personally liable for exam leaks)",
          "Academic Deans (evaluating budget savings vs institutional catastrophe risks)",
          "Student Engineering Team (eager to deploy real-world high-impact production software)",
          "12,000 University Students (enduring chaotic exam hall seating and delayed hall tickets)",
          "University IT Cell (defensive about their legacy systems and reluctant to support student tools)"
        ],
        knownInformation: [
          "ExamForge runs on an open-source constraint satisfaction algorithm with 100% test coverage and formal mathematical proofs of zero seat collisions.",
          "The commercial vendor contract renews automatically in 10 days unless a formal termination notice is served.",
          "The student team has conducted zero external security penetration tests or stress tests at 12,000 concurrent user loads.",
          "The university could save $8,000 per semester and allocate $2,000 as a student R&D grant to the club if adopted."
        ],
        constraints: [
          "Pitch meeting is in 3 days; total presentation time is strictly limited to 15 minutes.",
          "Any perceived arrogance or dismissal of faculty security concerns will cause instant rejection.",
          "Zero margin for error: a single exam hall glitch will result in disciplinary investigation and potential expulsion of developers."
        ],
        hiddenDetails: "The Controller of Examinations is not opposed to saving money, but is terrified of being blamed by the Vice Chancellor if an exam is delayed by 5 minutes. If offered a zero-risk pilot (running ExamForge in parallel as a shadow system alongside legacy software), he will agree.",
        initialChallenge: "Analyze the profound mindset and incentive differences between ambitious student innovators and risk-averse academic administrators.",
        finalDecisionChallenge: "Architect a bulletproof, risk-mitigated pitch presentation, de-risked deployment strategy, and influence strategy to win unanimous faculty approval.",
        assessmentCompetencies: ["Executive Persuasion", "Risk De-risking Strategy", "Audience-Centric Framing", "High-Stakes Pitching", "Institutional Value Alignment"],
        difficultyLevel: "HIGH / CHALLENGING",
        version: 1,
        context: "The club built an open-source platform to replace the university's $8,000 exam-seating vendor software, but faculty deans consider student code insecure and risky. With a 15-minute pitch to the Controller of Examinations in 3 days, you must design a persuasive, risk-mitigated proposal to win approval.",
        questions: [
          {
            orderNumber: 1,
            questionText: "What is the primary psychological barrier and institutional risk calculation of the Controller of Examinations regarding student-built software?",
            competencyTested: "Audience Risk Profile Analysis",
            guidance: "Candidate must recognize that for the CoE, downside risk (disaster, job loss) vastly outweighs upside benefit (saving $8k)."
          },
          {
            orderNumber: 2,
            questionText: "Why would emphasizing 'cutting-edge tech stacks and agile innovation' fail to persuade this specific faculty audience?",
            competencyTested: "Message-Audience Alignment",
            guidance: "Candidate should explain why buzzwords signal instability to risk-averse bureaucrats who prioritize stability, auditability, and security."
          },
          {
            orderNumber: 3,
            questionText: "Structure the exact 15-minute presentation narrative, detailing time allocation per section (Problem -> Security & Auditability -> Zero-Risk Shadow Pilot -> Cost-Benefit).",
            competencyTested: "High-Stakes Pitch Architecture",
            guidance: "Assess tight pacing, leading with security and fail-safes rather than features, and proposing a shadow parallel test."
          },
          {
            orderNumber: 4,
            questionText: "How will you present the system's security architecture to prove students cannot tamper with their own seating allocations or leak exam rosters?",
            competencyTested: "Technical Security & Integrity Proof",
            guidance: "Candidate should detail cryptographic hashing, immutable audit logs, air-gapped database seeds, and role-based faculty-only execution."
          },
          {
            orderNumber: 5,
            questionText: "Design a 'Zero-Risk Shadow Pilot Protocol' where ExamForge runs in parallel with the legacy vendor software for the upcoming midterm exams.",
            competencyTested: "De-Risking & Staged Rollout Strategy",
            guidance: "Look for parallel testing, benchmarking speed/accuracy against legacy output, with zero risk to actual exam execution."
          },
          {
            orderNumber: 6,
            questionText: "How do you handle a hostile, dismissive objection from the Chief Invigilator during the Q&A: 'What happens when your student lead gets sick on exam morning?'",
            competencyTested: "Live Objection Handling & Redundancy",
            guidance: "Candidate must present automated containerized deployment, comprehensive faculty runbooks, and 24/7 on-site multi-tiered student support."
          },
          {
            orderNumber: 7,
            questionText: "Constraint Update: The IT Cell Director claims open-source code is inherently insecure because anyone can read the repository. How do you educate and persuade him respectfully?",
            competencyTested: "Respectful Technical Education",
            guidance: "Candidate should cite Kerckhoffs's Principle, Linux/OpenSSL security models, and automated vulnerability scanning without condescension."
          },
          {
            orderNumber: 8,
            questionText: "New Development: The Controller of Examinations agrees to the proposal on the condition that an external certified cybersecurity firm reviews the code at the club's expense.",
            newInformation: "Conditional Approval: CoE will approve if an accredited third-party security audit is conducted before deployment.",
            competencyTested: "Resource Creative Problem Solving",
            guidance: "Candidate should partner with alumni security researchers or university cyber defense labs to secure an accredited audit pro bono."
          },
          {
            orderNumber: 9,
            questionText: "How do you mobilize alumni working in top cybersecurity firms to execute a verified pro-bono security audit within 5 days?",
            competencyTested: "Alumni Network Leverage & Rapid Execution",
            guidance: "Look for structured outreach, providing clear scoping docs, and obtaining a signed formal certification report."
          },
          {
            orderNumber: 10,
            questionText: "Draft the official Memorandum of Understanding (MOU) between the Student Club and the University Examination Branch.",
            competencyTested: "Institutional MOU Drafting & Governance",
            guidance: "Assess SLA guarantees, liability limitations, IP assignment to university, maintenance commitments, and student scholarship allocations."
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 6. EXECUTION & RESPONSIBILITY (Hidden Role: Office Bearer)
  // =========================================================================
  {
    area: "Execution & Responsibility",
    hiddenRole: "Office Bearer",
    cases: [
      {
        code: "ER-A",
        title: "Case A: T-Minus 72 Hours: Cascade of Critical Vendor & Venue Failures",
        shortDescription: "72 hours before a 400-person regional tech summit, the primary auditorium ceiling leaks, the AV vendor defaults, and the keynote speaker misses their international flight.",
        background: "The annual 'DevSummit Regional' has sold 420 tickets across 15 engineering colleges. The event features 8 industry tech talks, 2 hands-on workshops, a hiring booth pavilion, and a live broadcast. Months of preparation have culminated in this single flagship event.",
        currentSituation: "At 9:00 AM on Thursday (Event Day is Saturday 8:00 AM), a torrential monsoon storm causes a severe roof leak in the University Main Auditorium, flooding the stage and knocking out power. Simultaneously, the AV equipment vendor calls to announce their delivery truck was seized at a state border checkpoint due to permit issues. At 10:15 AM, the headline keynote speaker (a VP of AI from Silicon Valley) emails stating their flight was cancelled due to air traffic control strikes and they cannot arrive in person.",
        stakeholders: [
          "Organizing Chairman & Executive Team (responsible for delivery, safety, and event survival)",
          "420 Registered Attendees (many traveling from out-of-state with booked hotels)",
          "10 Corporate Sponsors (paid $4,000 expecting premium branding and live booth engagement)",
          "7 Remaining Speakers (arriving on schedule, expecting professional stage and AV)",
          "University Campus Facilities Management (evaluating building safety and emergency power)"
        ],
        knownInformation: [
          "Auditorium repair will take at least 5 days; the venue is declared unsafe for occupancy by campus safety.",
          "The campus library has an adjacent 200-seat multi-purpose hall and two 100-seat digital seminar rooms available if booked immediately.",
          "A local high-school audio vendor can provide backup PA and projectors at 1.5x normal rental cost ($600 premium).",
          "The headline speaker is willing to deliver an interactive holographic/4K virtual keynote if reliable low-latency fiber is guaranteed."
        ],
        constraints: [
          "Event cannot be postponed due to the university academic calendar and non-refundable travel of out-of-state delegates.",
          "Emergency budget reserve is strictly capped at $800.",
          "48 hours remain to execute complete venue re-architecture, AV procurement, and technical rehearsals."
        ],
        hiddenDetails: "The team is in full panic mode. Leads are arguing in circles about whose fault it was not to have insurance. Clear command-and-control execution, rapid delegation, and decisive spatial redesign will save the event.",
        initialChallenge: "Establish immediate incident command hierarchy and triage multi-variable crises under acute time pressure.",
        finalDecisionChallenge: "Execute a complete operational pivot, spatial re-allocation, contingency tech deployment, and flawless day-of-event execution.",
        assessmentCompetencies: ["Crisis Incident Command", "Rapid Resource Triage", "Operational Contingency Execution", "High-Pressure Logistics", "Accountability Under Fire"],
        difficultyLevel: "HIGH / CHALLENGING",
        version: 1,
        context: "72 hours before a 420-person summit, the main auditorium floods, the AV truck is seized, and the keynote speaker's flight is cancelled. You have an $800 emergency budget and 48 hours to secure alternative halls, rent emergency AV, configure remote keynote streaming, and deliver the event.",
        questions: [
          {
            orderNumber: 1,
            questionText: "What is your immediate 15-minute action protocol to establish an Incident Command System (ICS) and halt team panic?",
            competencyTested: "Crisis Command & Leadership Stabilization",
            guidance: "Candidate must designate a single Incident Commander, assign dedicated leads to discrete crisis tracks, and establish hourly status cadence."
          },
          {
            orderNumber: 2,
            questionText: "How do you triage the 3 catastrophic failures (Venue, AV, Keynote) and allocate your $800 emergency reserve?",
            competencyTested: "Resource Allocation & Triage Prioritization",
            guidance: "Evaluate candidate's ability to prioritize non-negotiables: securing the library multi-purpose halls ($0) + emergency local AV ($600) + high-speed fiber uplink ($100)."
          },
          {
            orderNumber: 3,
            questionText: "Design the multi-room spatial allocation blueprint across the 200-seat library hall and two 100-seat seminar rooms to accommodate 420 attendees without overcrowding.",
            competencyTested: "Logistics & Spatial Operations Re-design",
            guidance: "Look for synchronized multi-track scheduling, live-stream overflow into seminar rooms, and rotated workshop tracks."
          },
          {
            orderNumber: 4,
            questionText: "What technical and audiovisual infrastructure must be deployed to ensure the headline speaker's virtual keynote feels immersive and engaging rather than a cheap Zoom call?",
            competencyTested: "Technical Contingency Engineering",
            guidance: "Candidate should specify hardwired gigabit ethernet, dual-channel audio mixing, professional studio lighting, and dedicated stage moderator interaction."
          },
          {
            orderNumber: 5,
            questionText: "Draft the emergency communication bulletin to all 420 registered attendees detailing the venue change and session format.",
            competencyTested: "Crisis Communication & Attendee Reassurance",
            guidance: "Candidate should draft confident, crystal-clear directions with campus maps, schedule updates, and positive framing of multi-track perks."
          },
          {
            orderNumber: 6,
            questionText: "How do you manage the 10 corporate sponsors whose physical booth spaces were disrupted by the auditorium flooding?",
            competencyTested: "High-Stakes Sponsor Account Management",
            guidance: "Candidate should re-position booths in the high-traffic library atrium, offering complimentary digital sponsorship upgrades and sponsored speaker intros."
          },
          {
            orderNumber: 7,
            questionText: "Constraint Update: At T-minus 24 hours, the local backup AV vendor arrives with missing HDMI splitters and substandard wireless microphones. How do you resolve this?",
            competencyTested: "Rapid Operational Troubleshooting",
            guidance: "Candidate should dispatch emergency runners to nearby college labs/electronics markets and implement backup wired mics."
          },
          {
            orderNumber: 8,
            questionText: "New Development: On event morning at 7:45 AM, registration queues bottleneck with 300 students attempting to scan QR codes simultaneously on overloaded campus WiFi.",
            newInformation: "Registration Bottleneck: Campus WiFi fails at 7:45 AM, preventing cloud QR ticket validation for 300 waiting attendees outside the doors.",
            competencyTested: "Real-Time Bottleneck Elimination",
            guidance: "Candidate must instantly switch to offline CSV lookup, split lines alphabetically (A-F, G-L, etc.), and use mobile hotspot tethering."
          },
          {
            orderNumber: 9,
            questionText: "How do you coordinate the on-ground volunteer force to clear the 300-person registration backlog in under 15 minutes?",
            competencyTested: "On-Ground Volunteer Command",
            guidance: "Look for immediate physical line splitting, deploying 6 offline badge checkers, distributing wristbands swiftly, and starting opening remarks on time."
          },
          {
            orderNumber: 10,
            questionText: "Conduct the post-event operational debrief and present your comprehensive 'Disaster Preparedness and Redundancy Framework' for future club summits.",
            competencyTested: "Operational Resilience & Post-Mortem Accountability",
            guidance: "Assess thoroughness of risk registries, vendor penalty clauses, dual-venue contingencies, offline infrastructure standards, and operational playbooks."
          }
        ]
      },
      {
        code: "ER-B",
        title: "Case B: Unclear Ownership & Bottlenecks in Multi-Team Platform Launch",
        shortDescription: "A multi-department campus hackathon portal suffers chronic delays due to ambiguous task ownership, missing acceptance criteria, and silent dependency bottlenecks.",
        background: "The club is partnering with the Computer Science and Information Technology departments to launch 'CampusHack 2026'—a portal managing team matching, project submissions, automated code evaluation, and live leaderboards. The project involves 18 student volunteers distributed across 4 squads: Frontend, Backend, Infrastructure, and Content/Marketing.",
        currentSituation: "Two weeks prior to opening registrations, basic workflows remain completely broken. The frontend squad claims they cannot build the submission dashboard because the backend team hasn't provided API specifications. The backend squad claims they finished their code but infrastructure hasn't provisioned Redis caches or database secrets. The infrastructure lead was waiting for approved cloud budget from the Finance officer, who was waiting for the faculty signature that has been sitting on an unsigned desk for 10 days. Nobody took ownership, and each squad simply marked their Jira tickets 'Blocked'.",
        stakeholders: [
          "Project Manager / Office Bearer (responsible for end-to-end delivery accountability)",
          "18 Volunteer Developers across 4 squads (demotivated by endless blocking dependencies)",
          "Faculty Department Heads (expecting a seamless, professional registration launch)",
          "1,500 Prospective Student Hackers (waiting for the announced registration portal)",
          "Corporate Hiring Partners (monitoring portal reliability for developer recruitment)"
        ],
        knownInformation: [
          "There is no single person assigned as end-to-end accountable owner for critical user journeys (e.g. 'User registers and joins a team').",
          "Tasks are assigned to abstract squad names ('Backend Team') rather than named individuals.",
          "Standup meetings consist of 45-minute passive status updates where blockers are mentioned but never actively resolved.",
          "The launch date has already been publicly advertised on campus posters for next Monday at 10:00 AM."
        ],
        constraints: [
          "Launch cannot be delayed without humiliating the club and losing department credibility.",
          "Volunteers have academic project submissions due this week; individual availability is fragmented.",
          "All tooling must remain within free tier limits."
        ],
        hiddenDetails: "The root problem is the lack of a RACI matrix (Responsible, Accountable, Consulted, Informed) and vertical feature ownership. Squads are organized horizontally by technology layers, creating massive communication silos and zero personal accountability.",
        initialChallenge: "Diagnose organizational bottlenecks, eliminate ambiguity, and restructure cross-functional ownership.",
        finalDecisionChallenge: "Transform a fragmented, paralyzed multi-team structure into high-velocity, accountable feature squads that deliver the platform on time.",
        assessmentCompetencies: ["RACI Governance", "Cross-Functional Execution", "Bottleneck Elimination", "Agile Velocity Acceleration", "Accountability Engineering"],
        difficultyLevel: "HIGH / CHALLENGING",
        version: 1,
        context: "18 developers across 4 squads are paralyzed by circular dependency blocking ('Waiting for backend', 'Waiting for infra', 'Waiting for finance'). With launch in 7 days, you must dismantle horizontal silos, assign explicit DRI (Directly Responsible Individual) ownership, and drive the portal to launch.",
        questions: [
          {
            orderNumber: 1,
            questionText: "What are the structural flaws of organizing development teams strictly by horizontal tech layers (frontend vs backend vs infra) versus vertical feature squads?",
            competencyTested: "Organizational Design Analysis",
            guidance: "Candidate must analyze how horizontal silos create dependency ping-pong, diffuse accountability, and prevent end-to-end feature delivery."
          },
          {
            orderNumber: 2,
            questionText: "Construct an explicit RACI matrix (Responsible, Accountable, Consulted, Informed) for the critical 'User Registration & Team Creation' workflow.",
            competencyTested: "RACI Governance Modeling",
            guidance: "Look for a single named Accountable DRI (Directly Responsible Individual) for the entire user story across frontend, backend, and database."
          },
          {
            orderNumber: 3,
            questionText: "How will you restructure the daily standup from a passive 45-minute monologue into a laser-focused 15-minute 'Blocker Resolution War-Room'?",
            competencyTested: "Agile Ritual Optimization",
            guidance: "Candidate should enforce strict standup formats focusing exclusively on: What did you ship? What is blocking you? Who will unblock it by 2 PM?"
          },
          {
            orderNumber: 4,
            questionText: "What specific steps will you take today to resolve the 10-day bureaucratic deadlock on the faculty cloud budget approval?",
            competencyTested: "Bureaucratic Impediment Busting",
            guidance: "Candidate should propose direct, in-person faculty office walk-ins with pre-filled paperwork, and setting up free-tier temporary cloud credits immediately."
          },
          {
            orderNumber: 5,
            questionText: "Define the strict 'Definition of Done' (DoD) that every feature ticket must satisfy before being merged and marked complete.",
            competencyTested: "Quality Standards & Definition of Done",
            guidance: "Look for comprehensive criteria: Unit tested, integrated on staging, Swagger doc updated, UI responsiveness checked, and peer reviewed."
          },
          {
            orderNumber: 6,
            questionText: "Design an end-to-end integration test day ('Bug Bash') scheduled 48 hours prior to launch to validate all user journeys.",
            competencyTested: "Integration & Quality Assurance Planning",
            guidance: "Candidate should detail structured test scenarios, gamified bug discovery incentives, and instant triage channels."
          },
          {
            orderNumber: 7,
            questionText: "Constraint Update: At T-minus 48 hours, the automated code evaluation engine is failing on Python syntax validations. How do you triage scope without postponing launch?",
            competencyTested: "Scope Triage & MVP Truncation",
            guidance: "Candidate should decouple the code evaluation engine for Phase 2 (since submissions open in 2 weeks) and protect the Day 1 Registration MVP."
          },
          {
            orderNumber: 8,
            questionText: "New Development: A critical security vulnerability (SQL injection in team invite codes) is discovered by a junior tester 12 hours before launch.",
            newInformation: "Critical Security Flaw: A critical SQL injection vulnerability in team invite codes is reported 12 hours before the public launch.",
            competencyTested: "Emergency Vulnerability Incident Response",
            guidance: "Candidate must immediately halt release builds, assign a senior pair to patch the parameterized query, run regression tests, and verify fix."
          },
          {
            orderNumber: 9,
            questionText: "How do you coordinate the overnight emergency patch, security verification, and final staging sign-off without burning out the team?",
            competencyTested: "High-Pressure Delivery Management",
            guidance: "Candidate should rotate shifts, provide food/support, execute focused hotfix verification, and mandate rest before morning launch."
          },
          {
            orderNumber: 10,
            questionText: "Deliver your Post-Launch Governance and Operations Playbook, detailing error monitoring, on-call rotations, and continuous maintenance protocols.",
            competencyTested: "Sustainable Operations & SLA Governance",
            guidance: "Assess Sentry/error tracking, on-call escalation trees, daily health metrics, and institutionalized post-launch support."
          }
        ]
      },
      {
        code: "ER-C",
        title: "Case C: Live Event Server Crash & Emergency Incident Command Under Pressure",
        shortDescription: "During the live opening round of a campus coding competition with 600 concurrent contestants, the grading cluster crashes, test cases fail, and the leaderboard freezes.",
        background: "The club is hosting 'CodeWars 2026', a live 3-hour competitive programming showdown with 600 students competing simultaneously in university computer labs and personal laptops. The custom-built submission and judging engine runs on a cloud Docker swarm managed by the club's technical committee.",
        currentSituation: "At 6:15 PM (15 minutes into the 3-hour contest), 600 students submit their first problem solutions simultaneously. The judging queue experiences an unhandled deadlock, spike in CPU memory usage to 100%, and crashes the database container. Over 350 submissions are stuck in 'Pending Evaluation' status. The live auditorium leaderboard freezes, students in the labs begin shouting in frustration, and the Discord server is flooded with 500 angry messages accusing organizers of incompetence.",
        stakeholders: [
          "Incident Commander / Office Bearer (responsible for real-time crisis triage and recovery)",
          "600 Competitive Programmers (under timed pressure, panicking over lost submission scores)",
          "Technical Infrastructure Team (frantically looking at terminal logs, attempting blind server restarts)",
          "Lab Invigilators & Faculty Judges (demanding immediate status update or contest cancellation)",
          "Sponsors (observing live in the auditorium, evaluating club technical credibility)"
        ],
        knownInformation: [
          "The crash was caused by an unbounded Docker container execution limit: infinite loop submissions from contestants consumed all available host RAM.",
          "Submissions submitted prior to 6:15 PM are safely stored in PostgreSQL; no submitted code files were lost.",
          "Blindly restarting the cluster without memory limits will simply cause another crash within 3 minutes.",
          "The contest clock is actively ticking down; 2 hours and 40 minutes remain."
        ],
        constraints: [
          "A decision to pause, extend, or abort the contest must be communicated within 5 minutes.",
          "Fixing the container resource limits and queue worker deadlock will take approximately 12 minutes.",
          "Faculty lab booking expires strictly at 9:30 PM (cannot be extended past that time)."
        ],
        hiddenDetails: "The technical leads are panicking and trying random commands directly in production. What is needed is immediate contest pause, clear public communication, a structured 12-minute technical remediation, and resetting the competition clock fairly.",
        initialChallenge: "Take immediate executive incident command, halt chaotic ad-hoc debugging, and communicate authoritative stability to 600 contestants.",
        finalDecisionChallenge: "Execute a flawless live technical recovery, re-evaluate backlogged submissions, adjust competition timing equitably, and salvage event integrity.",
        assessmentCompetencies: ["Live Incident Command", "Decisive Crisis Triage", "Real-Time Public Communication", "Technical System Recovery", "Equitable Competition Management"],
        difficultyLevel: "HIGH / CHALLENGING",
        version: 1,
        context: "15 minutes into a live 600-person coding competition, an infinite-loop submission causes a container memory crash, freezing the judging queue and leaderboard. Contestants are panicking and shouting. You must take instant incident command, pause the clock, fix the cluster, restore submissions, and finish the contest.",
        questions: [
          {
            orderNumber: 1,
            questionText: "What is your immediate 60-second command decision regarding the running competition clock and live contestant communication?",
            competencyTested: "Instant Crisis Decisiveness",
            guidance: "Candidate must immediately pause the competition clock, announce a formal 15-minute technical pause across labs and Discord, and prevent panic."
          },
          {
            orderNumber: 2,
            questionText: "Draft the exact 3-sentence live announcement broadcast across the auditorium PA system and Discord announcements channel.",
            competencyTested: "Live Crisis Communication",
            guidance: "Look for calm, authoritative transparency: clock is paused, all submissions are safe in the database, engineering fix underway, contest will resume with full time."
          },
          {
            orderNumber: 3,
            questionText: "How do you enforce immediate discipline on the infrastructure team to stop them from running random restart commands in production?",
            competencyTested: "Engineering Incident Command",
            guidance: "Candidate must declare single-operator protocol, freeze ad-hoc commands, and execute a structured root-cause isolation workflow."
          },
          {
            orderNumber: 4,
            questionText: "Detail the specific technical remediation steps to isolate runaway contestant containers (cgroups, Docker memory limits, timeout kill signals, queue worker throttling).",
            competencyTested: "Technical Systems Recovery & Hardening",
            guidance: "Candidate should specify: apply `--memory=256m --cpus=0.5` limits, enforce strict 2-second timeout watchdogs, restart worker pool with throttled concurrency."
          },
          {
            orderNumber: 5,
            questionText: "How will you safely replay the 350 stuck 'Pending Evaluation' submissions without triggering a secondary server bottleneck upon resumption?",
            competencyTested: "Queue Replay & Load Management",
            guidance: "Candidate should stage queue replay: drain queue into batches of 25, verify worker stability, and process backlog before reopening live submissions."
          },
          {
            orderNumber: 6,
            questionText: "How do you adjust the competition schedule and problem point distributions to ensure fair competition given the 20-minute downtime?",
            competencyTested: "Competition Fairness & Schedule Recalibration",
            guidance: "Candidate should extend contest duration to match lab closing limits (e.g. adjust to 9:15 PM), ensure zero penalty for downtime, and maintain fair scoring."
          },
          {
            orderNumber: 7,
            questionText: "Constraint Update: 3 contestants claim their code submission timestamps were corrupted during the crash, costing them leaderboard penalty points. How do you arbitrate?",
            competencyTested: "Technical Dispute Arbitration",
            guidance: "Candidate should inspect raw database write timestamps and server access logs to manually verify and adjust contestant scores fairly."
          },
          {
            orderNumber: 8,
            questionText: "New Development: The contest successfully resumes at 6:35 PM with high performance, and 600 contestants submit 3,200 solutions over the next 2 hours without a single crash.",
            newInformation: "Flawless Resumption: All 3,200 subsequent submissions execute within 800ms latency, the live leaderboard updates flawlessly, and the contest finishes with roaring applause.",
            competencyTested: "Incident Closure & Community Recovery",
            guidance: "Candidate should close the event with genuine appreciation for participant patience and celebrate engineering resilience."
          },
          {
            orderNumber: 9,
            questionText: "How do you conduct the live closing award ceremony to turn what could have been a reputational disaster into a demonstration of institutional competence?",
            competencyTested: "Narrative Transformation & Executive Closing",
            guidance: "Candidate should openly acknowledge the live engineering recovery, celebrate participants, thank volunteers, and reinforce club transparency."
          },
          {
            orderNumber: 10,
            questionText: "Write the comprehensive Engineering Incident Post-Mortem Report for the University Dean and Corporate Sponsors, detailing root causes, mean-time-to-recovery (MTTR), and future architectural safeguards.",
            competencyTested: "Executive Post-Mortem & Architecture Hardening",
            guidance: "Assess professional rigor: timeline breakdown, root cause analysis, MTTR metrics, architectural improvements (sandboxed runner pods), and institutional lessons."
          }
        ]
      }
    ]
  }
];
