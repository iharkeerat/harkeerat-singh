# Methods: Evidence Boundaries in Public Examination Reporting

## Study design
Exploratory, **author-led and AI-assisted single-workflow** documentary case analysis. The student claims responsibility for the original project direction, overarching research framing, and final scholarly decisions. Generative AI assisted with source discovery, source-to-claim comparison, provisional classification, analytical suggestions, drafting and presentation; the resulting claim codes were not independently second-coded by a human. This project compares explicit public-article claims with the particular official examination notice they invoke. It is **not** a representative media survey, an independent audit of completed government outcomes, or an evaluation of a trained fact-checking model.

## Source-to-claim fields
For each claim, record: (1) examination/programme/year and issuing authority, (2) reported object (table, list, submitted bank details, completed refund, scheduled resit), (3) population/denominator and process stage, (4) publication date and reference period, and (5) the exact proposition supported, denied or left unestablished by the official notice.

## Case selection and the two collections
- [12 diagnostic article comparisons](data/diagnostic_claims_12.csv): purposive and partly selected after possible errors were discovered. This set is useful for illustrating classification boundaries but **cannot estimate an error prevalence**. Codes: 8 aligned, 2 unwarranted completion, 1 direct contradiction, 1 mixed heading/body upgrade.
- [10-slot retrospective outlet/event grid](data/outlet_event_grid_10.csv): two events crossed with five outlet families, selected retrospectively rather than preregistered. Eight standalone reports, one changing live blog and one report not located by web search. Codes: 4 aligned, 3 aligned with qualifiers, 1 direct contradiction, 1 dynamic aligned and 1 not coded.

**The collections overlap in four article URLs.** Never aggregate their records into 22 independent articles or calculate an error rate from them.

## Coding categories

| Code | Interpretation |
| --- | --- |
| `DIRECT_CONTRADICTION` | Official notice explicitly contradicts the article's focal statement. |
| `UNWARRANTED_COMPLETION` | Notice supports an earlier process stage, not the reported completed outcome; does not prove the outcome never occurred. |
| `MIXED_HEADLINE_UPGRADE` | A heading claims more than its own text and source establish. |
| `ALIGNED` | Source boundary preserved for the focal statement. |
| `ALIGNED_WITH_QUALIFIER` | Main focal statement preserved, with an ancillary wording caveat. |
| `ALIGNED_CANNOT_FREEZE` | Relevant entry on a changing live blog; no preserved publication-day snapshot. |
| `NOT_CODED` | Matching article not located; not proof of nonpublication. |

## Primary notices
1. [SSC CGL 2025 corrigendum](https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Corrigendum.pdf): corrected List-III table, explicit unchanged-list statement.
2. [NEET-UG 7 July 2026](https://cdnbbsr.s3waas.gov.in/s37bc1ec1d9c3426357e69acd5bf320061/uploads/2026/07/202607071291015974.pdf): updated/confirmed bank details, refunding begun.
3. [NEET-UG 14 July 2026](https://cdnbbsr.s3waas.gov.in/s37bc1ec1d9c3426357e69acd5bf320061/uploads/2026/07/202607141430274592.pdf): submitted bank details, refund process begun.
4. [CUET-UG 14 May 2025](https://nta.ac.in/Download/Notice/Notice_20250514161031.pdf): 76 candidates, one centre/shift, planned replacement exam.

## Reproducibility and limits
The [structural verifier](verify_corpus.py) checks CSV schema, row counts and overlap using only Python standard-library modules. It does **not** authenticate historical web pages, recode the articles, verify bank credits, test a machine-learning model or establish causality. Original news pages were not preserved as immutable publication-day snapshots. No independent human second-coder or external validation is claimed.

A careful source reader and standard provenance/validation methods can apply these same checks. The contribution is a bounded documentary **classification method and source-linked examples**, not the invention of temporal provenance or proof of an algorithmic advantage.
