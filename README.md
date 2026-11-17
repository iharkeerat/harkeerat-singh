# Harkeerat Singh

**Website:** https://iharkeerat.github.io/harkeerat-singh/ · [Academic CV](https://iharkeerat.github.io/harkeerat-singh/assets/docs/Harkeerat_Singh_Detailed_CV.pdf)

**Student researcher · Causal reasoning · Trustworthy AI · Computational modelling · Reproducible research software**

I work on a recurring question: **what can a system reasonably conclude from limited, imperfect or potentially misleading evidence?** My interests connect reinforcement learning, formal methods, educational technology, computational musicology and public-record interpretation.

This is a **research and software portfolio**, not a list of verified publications or production deployments. Each project states which claims are supported, which tests can be reproduced and what remains unresolved.

## Selected work

### 1. [Reality Attribution — Causal Diagnosis in Reinforcement Learning](https://github.com/iharkeerat/reality-attribution)
**Reinforcement learning · Causal identifiability · Active diagnosis · Observation integrity**

Studies when environment changes, delayed observations and interface manipulation can produce identical agent-visible histories—and what additional intervention or protected evidence can separate them.

- **Inspect:** [reviewer guide](https://github.com/iharkeerat/reality-attribution/blob/main/docs/REVIEWER_GUIDE.md) · [research overview](https://github.com/iharkeerat/reality-attribution/blob/main/docs/RESEARCH_OVERVIEW.md) · [GridWorld results](https://github.com/iharkeerat/reality-attribution/blob/main/docs/GRIDWORLD_FINDINGS.md) · [reproducibility limits](https://github.com/iharkeerat/reality-attribution/blob/main/docs/REPRODUCIBILITY.md)
- **Evidence status:** archived deterministic GridWorld results and hash-checked reaggregation; the original simulator generator is not included in the public checkout. LunarLander-v3 experiments remain ongoing; no definitive population-level result is claimed.

### 2. [MAQAM AI — Explainable Computational Musicology](https://github.com/iharkeerat/maqam-ai)
**Python · Dynamic programming · Symbolic music · FastAPI · TypeScript**

An experimental workbench for symbolic music and formal syllable-to-note alignment, with an exact constrained optimizer, conservative score parsing and independent, fixture-based software checks.

- **Inspect:** [two-minute reviewer guide](https://github.com/iharkeerat/maqam-ai/blob/main/docs/REVIEWER_GUIDE.md) · [running the demo](https://github.com/iharkeerat/maqam-ai/blob/main/docs/GETTING_STARTED.md) · [results and limitations](https://github.com/iharkeerat/maqam-ai/blob/main/docs/RESULTS_AND_LIMITATIONS.md)
- **Evidence status:** formal algorithms and constructed-example tests are inspectable. Real-world lyric-alignment accuracy has **not** been independently established.

### 3. [M-Print — Offline-First Adaptive Learning Diagnostics](https://github.com/iharkeerat/mprint-learning-diagnostics)
**Python · FastAPI · SQLAlchemy · SQLite · Synthetic evaluation · Learning analytics**

An offline-first assessment application and separate synthetic research sandbox for item-level response evidence, adaptive question selection and prerequisite-aware practice paths.

- **Inspect:** [repository](https://github.com/iharkeerat/mprint-learning-diagnostics) · [research scope](https://github.com/iharkeerat/mprint-learning-diagnostics/blob/main/docs/RESEARCH_SCOPE.md) · [setup notes](https://github.com/iharkeerat/mprint-learning-diagnostics/blob/main/docs/REPRODUCIBILITY.md)
- **Evidence status:** software prototype; the synthetic benchmarks are not learner outcomes, and no human-participant or psychometric validation is claimed.

### 4. [Evidence Boundaries in Public Examination Reporting](https://github.com/iharkeerat/evidence-boundaries-research)
**Documentary research · Source provenance · Claim verification · Public administration**

Compares selected official examination notices with reporting about numerical corrections and administrative processes, separating direct contradictions from claims not established by the cited evidence.

- **Inspect:** [reviewer guide](https://github.com/iharkeerat/evidence-boundaries-research/blob/main/REVIEWER_GUIDE.md) · [research overview](https://github.com/iharkeerat/evidence-boundaries-research/blob/main/paper/RESEARCH_OVERVIEW.md) · [methodology](https://github.com/iharkeerat/evidence-boundaries-research/blob/main/methodology/METHODOLOGY.md) · [source register](https://github.com/iharkeerat/evidence-boundaries-research/blob/main/methodology/SOURCE_REGISTER.md)
- **Evidence status:** exploratory, purposively selected cases; author-led and materially AI-assisted; neither independently coded nor peer reviewed. The complete report remains an author-review draft.

## Research approach

- **Separate observations from interpretations.** A measurement, a passing test or an official process announcement is not automatically proof of a broader real-world outcome.
- **Make evidence inspectable.** Link code, assumptions, original artifacts, checks and known reproduction boundaries.
- **Treat limitations as results to document.** Negative findings and unresolved hypotheses help define better experiments.
- **Describe contributions accurately.** Student-led direction, implementation, source checks, AI assistance and external materials should be attributed at the granularity each project's records support.

## Technical interests

Python, APIs, data analysis, testable experiments, graph modelling, formal optimisation, causal inference and research writing. Demonstrated depth differs by repository; inspect the source and evidence rather than assuming uniform proficiency.

## Contact

For project-related questions or collaboration, open an issue in the relevant public repository. Please do not post personal records, unpublished research archives or credentials in a public issue.
