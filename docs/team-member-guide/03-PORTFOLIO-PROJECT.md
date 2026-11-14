# 3. Project Guide — Portfolio

**Repository:** https://github.com/ASAA1229/Portfolio  
**Product type:** Multi-profile portfolio and presentation experience.

## Purpose and profiles
Portfolio is a polished digital presentation experience for four profile identities. It presents profile-specific skills, projects, experience, certifications, education, contact information, and AI-assisted introductions through a cohesive cinematic interface.

Profiles in scope:
- Abhishek
- Amulya (Ammu)
- Anjini (Bava)
- Sai (Darling)

Profile data, media, resumes, and permissions must remain associated with the correct profile. Consent, ownership, and visibility of personal information must be confirmed before publishing or changing content.

## Design direction
The remembered direction is a dark, streaming-service-inspired interface, using surfaces around #141414 / #18181b and a red accent around #E50914. Navigation areas include Home, Skills, Projects, Experience, Certification, Education, Contact, AI Intro, and profile selection. This is design context, not proof that every page or responsive state is complete.

## Capability areas
1. Profile selection, routing, and profile-specific data model.
2. Responsive cinematic interface, navigation, and reusable UI.
3. Skills, projects, experience, certifications, education, and contact sections.
4. Resume/document upload, validation, versioning, download, and replacement.
5. Image/media upload, galleries, ordering, optimization, and deletion.
6. AI introduction/chat, provider integration, secure key handling, and usage controls.
7. Shared data layer and consistent profile administration.
8. Accessibility, security, privacy, performance, analytics, and publishing.
9. QA, user acceptance, release, rollback, and support.

## Candidate epic register
1. Build stability and engineering foundation.
2. Four profiles and content architecture.
3. Cinematic UI, navigation, and responsive experience.
4. Profile content and career sections.
5. Resume manager and document processing.
6. Image/media manager and galleries.
7. AI intro, chat, and voice.
8. Accessibility, security, and performance.
9. QA, publishing, and release.

## Candidate sub-epics
- Foundation: environment, dependency health, configuration, CI, error handling.
- Profile model: schema, routing, data isolation, shared components, content validation.
- UI: design system, responsive layout, navigation, loading/empty/error states, accessibility.
- Content: section management, media references, ordering, metadata, preview/publishing.
- Resume: upload validation, versioning, download, privacy, replacement/rollback.
- Media: upload validation, storage, gallery, ordering, deletion, optimization.
- AI: provider abstraction, secret/key handling, prompts, chat sessions, rate/cost controls, safe fallback.
- Quality: security, performance, accessibility, browser/device testing, regression.
- Release: environment configuration, domain/hosting, analytics/privacy, UAT, rollback, support.

## Reported progress and remaining work
Historical context indicates a main-history update around 2026-11-04 and a period where testing/validation was paused during development-only work. Treat this as historical, not current. Source code presence does not mean tested, accepted, or operational.

A fresh review must verify build/dependency health; all profile routes and data boundaries; visitor/admin authentication; upload validation/storage/privacy/deletion; AI provider/key protection/rate/cost/privacy; responsive behavior, accessibility, performance, browser/device coverage; production configuration, UAT, publishing, rollback, and support.

## Risks and first tasks
Risks include publishing personal information without consent, cross-profile data leakage, unsafe uploads, exposed AI keys/uncontrolled usage, and treating visual completeness as product acceptance.

Inspect code and content sources before editing. Identify profile ownership for each data item, verify admin boundaries, preserve design intent, and add tests for profile isolation and upload security. Obtain owner confirmation before changing or publishing personal information.
