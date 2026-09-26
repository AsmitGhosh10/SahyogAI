# Product Requirements Document (PRD)

# SahyogAI

### Multilingual Cooperative Governance, Legal Assistance & Grievance Platform

**Version:** 2.0\
**Target:** Smart India Hackathon 2026 Prototype\
**Problem Statement:** 26088\
**Problem Statement Title:** Multilingual Cooperative Governance & Legal
Assistance Chatbot\
**Organization:** Ministry of Cooperation\
**Department:** National Council for Cooperative Training (NCCT)\
**Theme:** Agriculture, FoodTech & Rural Development\
**Platform:** Responsive Web/PWA + Raspberry Pi Voice Kiosk\
**Primary Languages:** Hindi, Bengali, English\
**Architecture:** Cloud-assisted MVP → Hybrid → Offline-first roadmap

------------------------------------------------------------------------

# 1. Executive Summary

SahyogAI is a **voice-first, multilingual AI platform designed
specifically for cooperative members, PACS users, farmers and rural
stakeholders**.

The system helps users:

1.  Understand cooperative laws, rules, governance procedures and member
    rights.
2.  Get answers from **verified official documents using
    jurisdiction-aware RAG**.
3.  Understand government/cooperative schemes and PACS services.
4.  Improve financial literacy using simple regional-language
    explanations.
5.  Upload and understand cooperative/government documents using OCR and
    AI.
6.  Convert a natural-language problem into a structured grievance.
7.  Generate a formal grievance and track its lifecycle.
8.  Provide authorities with an AI-assisted grievance dashboard.
9.  Interact through **text or voice** in Hindi, Bengali or English.
10. Access the service through a low-cost Raspberry Pi kiosk.

The central product principle is:

> **Do not make the LLM the source of truth. Make verified cooperative
> and government sources the source of truth, and use AI to make those
> sources understandable and actionable.**

The MVP therefore focuses on **cooperative governance + legal
assistance + grievance redressal**, while financial literacy, PACS
services and selected government schemes act as supporting capabilities.

------------------------------------------------------------------------

# 2. Problem Statement Alignment

The official PS focuses on:

-   Financial literacy assistance
-   Cooperative grievance redressal support
-   Voice-enabled assistance for rural users
-   Mobile and web integration
-   Natural Language Processing
-   AI chatbot frameworks
-   Speech-to-Text and Text-to-Speech
-   Cloud computing
-   Proposed hardware/software

SahyogAI addresses these through:

  -----------------------------------------------------------------------
  PS Requirement                      SahyogAI
  ----------------------------------- -----------------------------------
  Multilingual assistance             Hindi + Bengali + English

  Financial literacy                  Cooperative-focused financial
                                      education

  Cooperative grievance support       Structured grievance creation +
                                      tracking

  Rural voice assistance              Voice-first kiosk + web interface

  NLP/AI chatbot                      Intent detection + AI orchestration

  STT/TTS                             Multilingual voice pipeline

  Mobile/web                          Responsive PWA

  Cloud                               Cloud AI/RAG backend

  Hardware                            Raspberry Pi kiosk

  Legal assistance                    Jurisdiction-aware legal RAG

  Governance                          Cooperative
                                      rights/election/membership
                                      assistant
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 3. Product Vision

> **Make cooperative governance, legal information and grievance
> assistance understandable and accessible to rural users through a
> multilingual, voice-first and source-grounded AI system.**

The long-term vision is to transform the platform from a cloud-assisted
chatbot into a **low-cost edge-enabled rural cooperative assistance
network**.

------------------------------------------------------------------------

# 4. Product Positioning

SahyogAI is **not a generic chatbot** and not simply a
government-information search engine.

Its differentiation is:

### Generic chatbot

``` text
Question
   ↓
LLM
   ↓
Answer
```

### SahyogAI

``` text
User Question
      ↓
Language Detection
      ↓
Intent Detection
      ↓
Jurisdiction Detection
      ↓
Cooperative Type Detection
      ↓
Authoritative Knowledge Retrieval
      ↓
Evidence Verification
      ↓
AI Explanation
      ↓
Source + Applicability
      ↓
Actionable Next Steps
```

For grievances:

``` text
Natural-language problem
      ↓
AI classification
      ↓
Structured case
      ↓
Required evidence
      ↓
Formal grievance
      ↓
Tracking ID
      ↓
Authority dashboard
      ↓
Status updates
```

------------------------------------------------------------------------

# 5. Target Users

## 5.1 Cooperative Members

Need:

-   Member rights
-   Membership information
-   Voting/election information
-   Governance procedures
-   Cooperative services
-   Financial information
-   Grievance assistance

## 5.2 Farmers

Need:

-   Cooperative/PACS services
-   Crop insurance information
-   Government scheme information
-   Financial assistance information
-   Application checklists
-   Grievance support

## 5.3 PACS Users

Need:

-   Loan/service information
-   Required documents
-   Membership information
-   Cooperative procedures
-   Complaint assistance

## 5.4 Rural Stakeholders

Including:

-   Cooperative workers
-   Village-level facilitators
-   Rural entrepreneurs
-   PACS staff

## 5.5 Authorities / Administrators

Need:

-   Grievance queue
-   AI categorization
-   Case details
-   Evidence
-   Status management
-   Analytics
-   User communication

------------------------------------------------------------------------

# 6. Core Product Modules

The MVP consists of seven primary modules.

## Module 1 --- Cooperative Governance Assistant

The flagship module.

Users can ask about:

-   Cooperative membership
-   Member rights
-   Voting rights
-   Elections
-   General body meetings
-   Governance
-   Cooperative procedures
-   By-laws
-   PACS services
-   Member responsibilities

### Example

User:

> "Can a cooperative member vote in the election?"

System:

``` text
Intent:
Cooperative Governance

Topic:
Voting Rights

Jurisdiction:
Detected State

Cooperative Type:
State Cooperative

Applicable Sources:
Relevant Act / Rules / By-laws
```

The response should provide:

-   Simple explanation
-   Relevant provision
-   Source
-   Jurisdiction
-   Applicability warning when required
-   Next steps

------------------------------------------------------------------------

# 7. Jurisdiction-Aware Legal Assistance

This is one of the core differentiators.

Cooperative rules may depend on:

-   State
-   Central jurisdiction
-   Multi-State status
-   Cooperative type
-   Applicable rules/by-laws

Therefore, the system must not retrieve documents purely by semantic
similarity.

## Jurisdiction pipeline

``` text
User Question
      ↓
Location / State
      ↓
Cooperative Type
      ↓
Central / State / Multi-State
      ↓
Applicable Knowledge Collection
      ↓
Legal RAG
```

### Example

``` text
State:
Jharkhand

Cooperative:
PACS

Issue:
Membership dispute

Knowledge scope:
Applicable state cooperative documents
+ relevant rules
+ verified by-laws when available
```

If the system cannot determine applicability, it must ask a
clarification question rather than silently assuming.

------------------------------------------------------------------------

# 8. Legal RAG Engine

## Objective

Provide answers grounded in authoritative documents rather than
unsupported model knowledge.

## Pipeline

``` text
Official Documents
       ↓
Document Ingestion
       ↓
PDF/Text Extraction
       ↓
Metadata Extraction
       ↓
Chunking
       ↓
Embeddings
       ↓
Vector Database
       ↓
Hybrid Retrieval
       ↓
Reranking
       ↓
Evidence Validation
       ↓
LLM
       ↓
Grounded Answer
```

## Document metadata

Every chunk should maintain:

``` text
document_id
document_title
source_url
authority
jurisdiction
state
cooperative_type
document_type
section
subsection
language
effective_date
last_verified
page_number
```

## Retrieval should consider

-   Semantic similarity
-   Jurisdiction
-   Cooperative type
-   Document authority
-   Section relevance
-   Document freshness

------------------------------------------------------------------------

# 9. Source-Grounded Response

Every legal/governance answer should expose evidence.

Example:

``` text
ANSWER

In simple terms:
...

What you can do:
1. ...
2. ...
3. ...

--------------------------------

VERIFIED SOURCE

Document:
[Official Document]

Section:
[Section / Rule]

Jurisdiction:
[State / Central / Multi-State]

Applicability:
[Relevant cooperative type]

Last verified:
[Date]
```

The system must not fabricate section numbers, eligibility conditions,
deadlines or authorities.

------------------------------------------------------------------------

# 10. Evidence Strength

Instead of presenting an arbitrary numerical confidence score, the
system uses evidence categories.

### 🟢 Strong evidence

The answer is directly supported by an authoritative retrieved source.

### 🟡 Limited evidence

Related official information exists, but applicability is uncertain.

### 🔴 Insufficient evidence

The knowledge base does not contain sufficient reliable information.

For insufficient evidence:

> "I could not find sufficient information in the available verified
> sources to answer this reliably."

The system can then ask for:

-   State
-   Cooperative type
-   Document
-   More details

------------------------------------------------------------------------

# 11. Multilingual Assistant

## MVP languages

-   Hindi
-   Bengali
-   English

The architecture should support adding additional Indian languages
later.

## Interaction modes

### Text

``` text
User → Text → AI → Text
```

### Voice

``` text
User Speech
     ↓
Speech-to-Text
     ↓
Language / Intent Detection
     ↓
AI
     ↓
Text-to-Speech
     ↓
User
```

The system should respond in the user's selected language by default.

------------------------------------------------------------------------

# 12. Mixed-Language / Rural Speech Handling

The system should be designed for realistic user input such as:

> "Mera PACS loan ka repayment kaise hoga?"

or:

> "আমার PACS থেকে loan নিতে কী লাগবে?"

The language layer should:

1.  Detect language.
2.  Preserve important domain terms.
3.  Normalize mixed-language input where necessary.
4.  Retrieve multilingual knowledge.
5.  Respond in the user's preferred language.

------------------------------------------------------------------------

# 13. Voice-First Experience

The interface should prioritize a large microphone button.

``` text
SahyogAI

How can we help?

        🎤
   Speak your question

Hindi | বাংলা | English
```

Voice interaction:

``` text
🎤 Recording...
      ↓
Transcribing...
      ↓
Understanding...
      ↓
Searching verified sources...
      ↓
Preparing answer...
      ↓
🔊 Speaking...
```

The UI should simultaneously display the response for transparency.

------------------------------------------------------------------------

# 14. Cooperative Rights Assistant

A dedicated feature:

# "Know Your Cooperative Rights"

Users can ask:

-   What are my rights as a member?
-   Can I vote?
-   How can I participate in a general body meeting?
-   What can I do if information is denied?
-   How can I raise a dispute?
-   What documents should I keep?

The system maps:

``` text
Question
 ↓
Right / Issue
 ↓
Jurisdiction
 ↓
Applicable source
 ↓
Simple explanation
 ↓
Actionable next step
```

------------------------------------------------------------------------

# 15. Document Intelligence

Users can upload or photograph:

-   Cooperative notices
-   Membership documents
-   Receipts
-   Loan documents
-   Government forms
-   Letters
-   Other relevant documents

## Pipeline

``` text
Image / PDF
    ↓
OCR
    ↓
Language Detection
    ↓
Document Classification
    ↓
Key Information Extraction
    ↓
Relevant Legal RAG
    ↓
Simple Explanation
```

### Output

``` text
DOCUMENT ANALYSIS

Document type:
Cooperative Notice

Language:
Hindi

Important points:
• ...
• ...
• ...

What this means:
...

Things to verify:
• ...
• ...

Relevant source:
...
```

The system must clearly distinguish **document explanation** from a
legal determination.

------------------------------------------------------------------------

# 16. Financial Literacy Assistant

Financial literacy remains a supporting module.

Topics:

-   Loans
-   Interest
-   Repayment
-   Savings
-   Insurance
-   Credit
-   Cooperative deposits
-   Cooperative shares
-   Financial fraud awareness

## Example

User:

> "₹50,000 loan at 10% interest ka kya matlab hai?"

The system explains the concept in simple language and can provide a
calculator where appropriate.

------------------------------------------------------------------------

# 17. Cooperative Financial Fraud Awareness

The system should provide basic safety education.

Example:

> "Someone is asking for my OTP to release my cooperative payment."

Response:

``` text
⚠️ SAFETY WARNING

Do not share:
• OTP
• UPI PIN
• ATM PIN
• Password

Recommended action:
Do not make the requested payment or share credentials.
Use an official channel to verify the request.
```

------------------------------------------------------------------------

# 18. Scheme & PACS Assistant

Supporting module for:

-   Ministry of Cooperation schemes
-   PACS services
-   Selected government schemes
-   PMFBY/crop insurance

For every scheme, the system should structure information as:

``` text
Scheme
├── What is it?
├── Who may be eligible?
├── Benefits
├── Required documents
├── Application process
├── Relevant authority
├── Source
└── Verification date
```

Time-sensitive information must be linked to the latest verified source.

------------------------------------------------------------------------

# 19. Grievance Assistant

This is the second flagship module after legal/governance assistance.

## Natural-language grievance

User:

> "Meri cooperative ne mera ₹20,000 ka deposit return nahi kiya."

The AI should identify:

``` text
Category:
Financial Grievance

Subcategory:
Deposit / Repayment

Amount:
₹20,000

Cooperative:
Unknown

Jurisdiction:
Unknown
```

It then asks only the information necessary to proceed.

------------------------------------------------------------------------

# 20. Intelligent Grievance Intake

Example:

``` text
AI:
What is the name of your cooperative?

User:
ABC PACS

AI:
Which district is it located in?

User:
Jamtara

AI:
Approximately when did the issue occur?

User:
Six months ago
```

The system creates:

``` text
GRIEVANCE SUMMARY

Category:
Financial

Subcategory:
Deposit repayment

Cooperative:
ABC PACS

District:
Jamtara

Amount:
₹20,000

Incident:
Deposit not returned
```

User confirms:

# Submit / Generate Grievance

------------------------------------------------------------------------

# 21. AI Grievance Classification

Each grievance receives:

-   Category
-   Subcategory
-   Jurisdiction
-   Cooperative type
-   Required documents
-   Suggested next step
-   Status
-   Timestamp

Example:

``` text
Category:
Cooperative Governance

Subcategory:
Election / Voting

Required evidence:
Membership details

Suggested action:
Review applicable cooperative rules
```

The AI classification is advisory and can be corrected by an authorized
administrator.

------------------------------------------------------------------------

# 22. Grievance Generation

The system generates a formal complaint from conversational information.

Output formats:

-   Hindi
-   Bengali
-   English

Example structure:

``` text
Subject:
[Issue]

To:
[Relevant authority / cooperative]

Respected Sir/Madam,

I am a member of [cooperative].
I am reporting the following issue:

[Structured description]

Relevant details:
...

Requested action:
...

Attachments:
...

Date:
...
```

The user must review and confirm before submission/export.

------------------------------------------------------------------------

# 23. Grievance Tracking

Each case receives a unique ID.

Example:

``` text
GRV-2026-00421
```

Lifecycle:

``` text
Created
   ↓
Submitted
   ↓
Under Review
   ↓
Additional Information Requested
   ↓
Forwarded / Assigned
   ↓
Resolved
```

The prototype may simulate authority workflow if no official API
integration is available.

It must never claim that a grievance was submitted to a government
system unless a real integration exists.

------------------------------------------------------------------------

# 24. Authority Dashboard

## Dashboard

``` text
SahyogAI ADMIN

Total Cases
1,248

Pending
184

Under Review
326

Resolved
738
```

## Case view

``` text
GRV-2026-00421

Category:
Financial Grievance

Cooperative:
ABC PACS

Location:
Jamtara

Language:
Hindi

AI Summary:
...

Evidence:
...

User Statement:
...

[Request Document]
[Update Status]
[Add Response]
[Forward]
```

------------------------------------------------------------------------

# 25. AI-Assisted Authority Features

The authority dashboard can provide:

### Case summarization

Convert a long user conversation into a short case summary.

### Duplicate detection

Identify potentially duplicate complaints.

### Category classification

Automatically categorize complaints.

### Document checklist

Identify missing evidence.

### Trend analytics

Example:

``` text
Top grievance categories

Financial          ███████████
Membership         ████████
Governance         ██████
Loan               █████
Election           ████
```

These features assist administrators; they do not autonomously make
legal or enforcement decisions.

------------------------------------------------------------------------

# 26. Kiosk Experience

The physical prototype uses Raspberry Pi as an accessible interface.

## Hardware

-   Raspberry Pi
-   Display
-   Microphone
-   Speaker
-   Physical/virtual microphone button
-   Wi-Fi connectivity
-   Optional camera for document capture

## Kiosk UI

``` text
┌─────────────────────────────┐
│       SahyogAI       │
│                             │
│   How can we help you?      │
│                             │
│          🎤                 │
│      Speak Here             │
│                             │
│ Hindi | বাংলা | English     │
│                             │
│ ⚖️ Rights   📝 Grievance    │
│ 📄 Document 💰 Finance      │
└─────────────────────────────┘
```

The Raspberry Pi handles the interface and peripherals. AI processing
remains cloud-assisted during the MVP.

------------------------------------------------------------------------

# 27. Connectivity Strategy

## MVP

``` text
Kiosk
  ↓
Internet
  ↓
Cloud Backend
  ↓
STT
  ↓
RAG + AI
  ↓
TTS
  ↓
Kiosk
```

## Hybrid future

``` text
                 KIOSK
                   │
          ┌────────┴────────┐
          │                 │
    Local Knowledge     Cloud AI
          │                 │
          └────────┬────────┘
                   ↓
                Answer
```

## Offline-first future

Potentially local:

-   Frequently accessed knowledge
-   OCR
-   STT
-   TTS
-   Lightweight RAG
-   Small language models

Internet would primarily support:

-   Knowledge synchronization
-   Software updates
-   Model updates
-   Latest information
-   Complex queries

Offline functionality is a roadmap capability and should not be claimed
as fully implemented in the MVP.

------------------------------------------------------------------------

# 28. System Architecture

``` text
                         USER
                           │
              ┌────────────┴────────────┐
              │                         │
           WEB/PWA                 RASPBERRY PI
              │                         │
              └────────────┬────────────┘
                           ↓
                  INPUT PROCESSING
                           │
              ┌────────────┴────────────┐
              │                         │
             TEXT                     VOICE
              │                         │
              │                       STT
              │                         │
              └────────────┬────────────┘
                           ↓
                  LANGUAGE DETECTION
                           ↓
                    AI ORCHESTRATOR
                           │
          ┌────────────────┼─────────────────┐
          │                │                 │
          ▼                ▼                 ▼
    GOVERNANCE AI      LEGAL RAG       GRIEVANCE AI
          │                │                 │
          │         ┌──────┴──────┐          │
          │         │             │          │
          │      Jurisdiction  Retrieval    │
          │         │             │          │
          └─────────┴──────┬──────┘          │
                           ↓                  │
                    EVIDENCE LAYER            │
                           ↓                  │
                    RESPONSE ENGINE           │
                           │                  │
              ┌────────────┼────────────┐     │
              ▼            ▼            ▼     │
          Explanation    Sources       Actions │
              │                               │
              └──────────────┬────────────────┘
                             ↓
                           TTS
                             ↓
                           USER

                    GRIEVANCE FLOW
                             │
                             ↓
                     CASE DATABASE
                             │
                             ↓
                     AUTHORITY PORTAL
```

------------------------------------------------------------------------

# 29. Technology Stack

## Frontend

-   Next.js
-   TypeScript
-   Tailwind CSS
-   Responsive/PWA design

## Backend

-   Python
-   FastAPI

## Database

-   PostgreSQL or MongoDB for application data
-   Redis for caching/session tasks where needed

## Vector Database

-   Qdrant / equivalent vector store

## AI

-   LLM API
-   Embedding model
-   RAG pipeline
-   Optional reranker

## Speech

-   Whisper-compatible multilingual STT
-   Multilingual TTS

## OCR

-   OCR engine suitable for Hindi/Bengali/English documents

## Hardware

-   Raspberry Pi
-   Display
-   USB/I2S microphone
-   Speaker
-   Optional camera

## Deployment

-   Docker
-   Cloud backend
-   HTTPS
-   Object storage for explicitly uploaded documents where required

------------------------------------------------------------------------

# 30. Data Model

## User

``` text
user_id
name
preferred_language
state
district
cooperative_id
created_at
```

## Cooperative

``` text
cooperative_id
name
type
state
district
registration_reference
status
```

## Grievance

``` text
grievance_id
user_id
cooperative_id
category
subcategory
description
jurisdiction
amount
status
priority
created_at
updated_at
```

## Document

``` text
document_id
title
authority
source_url
jurisdiction
cooperative_type
document_type
section
language
effective_date
last_verified
```

## Evidence

``` text
evidence_id
grievance_id
document_id
page
section
excerpt_reference
```

------------------------------------------------------------------------

# 31. Core API Design

## Chat

``` http
POST /api/chat
```

Input:

``` json
{
  "message": "...",
  "language": "hi",
  "state": "Jharkhand",
  "cooperative_type": "PACS"
}
```

Output:

``` json
{
  "answer": "...",
  "intent": "cooperative_governance",
  "sources": [],
  "evidence_strength": "strong",
  "next_actions": []
}
```

## Voice

``` http
POST /api/voice/transcribe
POST /api/voice/synthesize
```

## Document

``` http
POST /api/documents/analyze
```

## Grievance

``` http
POST /api/grievances
GET /api/grievances/:id
PATCH /api/grievances/:id/status
```

## Knowledge

``` http
POST /api/knowledge/search
```

------------------------------------------------------------------------

# 32. Knowledge Base Governance

The knowledge base must not become a random collection of internet
content.

Preferred source hierarchy:

``` text
1. Official government / statutory source
2. Official ministry/department publication
3. Official authority guidance
4. Verified institutional material
5. Other sources only when explicitly approved
```

Every document should have:

-   Source
-   Authority
-   Jurisdiction
-   Date
-   Verification status
-   Applicable cooperative type

Expired or superseded material should be marked accordingly.

------------------------------------------------------------------------

# 33. Hallucination & Safety Rules

The system must never invent:

-   Laws
-   Sections
-   Rules
-   Eligibility
-   Benefits
-   Deadlines
-   Authorities
-   Financial figures
-   Government submission status

If evidence is insufficient:

``` text
I could not find sufficient verified information
to answer this reliably.
```

For legal content:

> The system provides informational assistance and does not replace
> qualified legal advice.

For financial content:

> Calculations and educational information should not be presented as
> personalized financial advice.

------------------------------------------------------------------------

# 34. Privacy & Security

Principles:

-   Collect minimum required PII.
-   Do not store raw voice recordings by default.
-   Encrypt data in transit.
-   Encrypt sensitive stored data where appropriate.
-   Role-based access for administrators.
-   Separate citizen and authority permissions.
-   Audit important grievance status changes.
-   Apply document access controls.
-   Avoid sending unnecessary PII to external AI providers.
-   Provide clear user consent where required.

------------------------------------------------------------------------

# 35. Accessibility

The interface should be designed for users with limited digital
literacy.

Requirements:

-   Large buttons
-   Minimal text on primary screens
-   Voice interaction
-   Regional languages
-   Clear icons
-   Simple terminology
-   Audio feedback
-   Visible progress states
-   Confirmation before important actions

Example:

``` text
Instead of:

"Submit grievance"

Use:

📝 शिकायत दर्ज करें
```

------------------------------------------------------------------------

# 36. Non-Functional Requirements

## Performance

Target prototype response:

-   Text query: ideally under a few seconds
-   Voice transcription: near real-time where provider/network allows
-   RAG retrieval: low-latency
-   UI should remain responsive during AI processing

## Reliability

-   Graceful API failure handling
-   Retry for transient failures
-   Clear offline/error messages
-   No fabricated response when retrieval fails

## Scalability

The backend should support multiple kiosks and users without coupling AI
logic to one physical device.

## Maintainability

AI providers, STT, TTS and vector databases should be replaceable
through service interfaces.

------------------------------------------------------------------------

# 37. MVP Scope

## Must Have

### A. Multilingual text chatbot

-   Hindi
-   Bengali
-   English

### B. Voice

-   STT
-   TTS

### C. Cooperative legal/governance RAG

-   Official knowledge base
-   Source citations
-   Jurisdiction filtering

### D. Cooperative rights assistant

### E. Grievance intake

-   AI classification
-   Structured case
-   Grievance generation
-   Tracking ID

### F. Authority dashboard

-   Case list
-   Case detail
-   Status updates

### G. Raspberry Pi kiosk

### H. Basic document understanding

-   OCR
-   Explanation

------------------------------------------------------------------------

# 38. Should Have

-   Financial literacy calculator
-   Scheme assistant
-   PMFBY use case
-   Document upload
-   Evidence checklist
-   Case summarization
-   Analytics
-   Offline cache

------------------------------------------------------------------------

# 39. Future Scope

-   More Indian languages
-   Real government grievance APIs
-   Real cooperative registry integration
-   More state-specific knowledge bases
-   Offline STT/TTS
-   Edge LLM
-   Federated/secure deployment options
-   Multi-kiosk deployment
-   SMS/WhatsApp notification where officially supported
-   Voice authentication where appropriate and legally justified

------------------------------------------------------------------------

# 40. Out of Scope for MVP

Do not attempt:

-   Training a foundation model
-   Fully offline LLM on Raspberry Pi Zero
-   Automatic legal decisions
-   Automatic legal representation
-   Direct financial transactions
-   Unverified government portal integrations
-   Every Indian language
-   Every government scheme
-   Autonomous authority decisions
-   Automatic grievance submission to government systems without an
    actual API

------------------------------------------------------------------------

# 41. Success Metrics

## AI / RAG

### Retrieval relevance

Percentage of test queries where the correct authoritative document is
retrieved.

### Groundedness

Percentage of generated answers supported by retrieved evidence.

### Citation correctness

Percentage of displayed sources that actually support the answer.

## Voice

Measure transcription quality for:

-   Hindi
-   Bengali
-   English
-   Mixed-language input

## User experience

Measure:

-   Task completion rate
-   Time to answer
-   Number of clarification steps
-   Successful grievance creation
-   Successful document understanding

## System

Measure:

-   Average response latency
-   Error rate
-   API availability
-   Retrieval latency

------------------------------------------------------------------------

# 42. Acceptance Criteria

## Scenario 1 --- Legal question

Given:

> "Can a cooperative member vote?"

The system must:

-   Detect governance intent.
-   Identify/ask jurisdiction where necessary.
-   Retrieve applicable authoritative information.
-   Provide a simple explanation.
-   Display source information.
-   Avoid unsupported claims.

## Scenario 2 --- Voice

Given:

> A user speaks Bengali.

The system must:

-   Transcribe the query.
-   Detect/process Bengali.
-   Retrieve relevant knowledge.
-   Generate Bengali response.
-   Speak the response.

## Scenario 3 --- Grievance

Given:

> "My cooperative has not returned my deposit."

The system must:

-   Identify grievance intent.
-   Ask necessary questions.
-   Generate structured case.
-   Generate grievance text.
-   Assign a tracking ID.
-   Display status.

## Scenario 4 --- Authority

Given a submitted grievance:

-   Authority can view it.
-   AI summary is displayed.
-   Category is displayed.
-   Status can be updated.
-   User-facing status changes accordingly.

## Scenario 5 --- Unsupported question

Given a question with no reliable source:

The system must not hallucinate and should state that sufficient
verified information was not found.

------------------------------------------------------------------------

# 43. Four-Week Implementation Plan

## Week 1 --- Core Platform

### Team

-   Next.js frontend
-   FastAPI backend
-   Database
-   Authentication
-   Basic chatbot
-   Document ingestion
-   Vector database

### Deliverable

Text-based cooperative RAG assistant.

------------------------------------------------------------------------

# Week 2 --- Legal Intelligence

Implement:

-   Jurisdiction detection
-   Cooperative type
-   Governance intents
-   Source citations
-   Evidence strength
-   Cooperative rights module
-   Knowledge metadata

### Deliverable

Jurisdiction-aware cooperative legal assistant.

------------------------------------------------------------------------

# Week 3 --- Voice + Grievance + Hardware

Implement:

-   STT
-   TTS
-   Raspberry Pi kiosk
-   Grievance intake
-   AI classification
-   Complaint generation
-   Tracking ID
-   Authority dashboard

### Deliverable

Complete end-to-end voice-to-grievance workflow.

------------------------------------------------------------------------

# Week 4 --- Differentiation + Polish

Implement:

-   Document OCR
-   Document explanation
-   Financial literacy
-   Analytics
-   Offline cache
-   Error handling
-   Latency optimization
-   UI polish
-   Testing
-   Demo preparation

### Deliverable

SIH-ready integrated prototype.

------------------------------------------------------------------------

# 44. Team Division for 6 Members

## Member 1 --- Frontend

-   Next.js
-   Kiosk UI
-   Citizen UI

## Member 2 --- Backend

-   FastAPI
-   Database
-   APIs
-   Authentication

## Member 3 --- AI/RAG

-   Document ingestion
-   Embeddings
-   Retrieval
-   Reranking
-   Prompting
-   Grounding

## Member 4 --- Voice/Multilingual

-   STT
-   TTS
-   Language detection
-   Audio pipeline

## Member 5 --- Grievance/Admin

-   Grievance workflow
-   Authority dashboard
-   Case classification
-   Analytics

## Member 6 --- Hardware/Integration

-   Raspberry Pi
-   Microphone
-   Speaker
-   Kiosk deployment
-   End-to-end integration

One team member should also own **knowledge-base verification and source
quality**.

------------------------------------------------------------------------

# 45. Recommended SIH Demo

The strongest demo should not start with a generic "Hello chatbot"
interaction.

## Scene 1 --- Rural user

Show the Raspberry Pi kiosk.

User selects:

**বাংলা**

## Scene 2 --- Natural voice

User says:

> "আমার সমবায় সমিতি আমাকে ভোট দিতে দিচ্ছে না।"

## Scene 3 --- AI understanding

Display:

``` text
Language:
Bengali

Intent:
Cooperative Governance

Issue:
Voting Rights

Jurisdiction:
Not yet confirmed
```

The system asks for the state/cooperative information if necessary.

## Scene 4 --- Verified retrieval

Display:

``` text
Searching verified sources...

✓ Applicable cooperative document
✓ Relevant rule/section
✓ Jurisdiction matched
```

## Scene 5 --- Explanation

Show:

``` text
Simple explanation
+
Applicable source
+
Section
+
Next steps
```

## Scene 6 --- Action

AI asks:

> "Would you like help creating a grievance?"

User selects:

**YES**

## Scene 7 --- Grievance creation

AI asks only necessary questions.

Then:

``` text
GRV-2026-00421

Status:
Submitted
```

## Scene 8 --- Authority dashboard

Switch to admin screen.

Show:

``` text
NEW CASE

Category:
Cooperative Governance

Subcategory:
Voting / Election

AI Summary:
...

Evidence:
...

[Review]
```

## Scene 9 --- Document intelligence

Upload a sample cooperative notice.

Show:

``` text
OCR
 ↓
Document understanding
 ↓
Relevant rule retrieval
 ↓
Simple explanation
 ↓
Source
```

## Scene 10 --- Hardware

Finally demonstrate the same workflow through the physical kiosk.

This demonstrates:

**Voice + Multilingual + AI + Legal RAG + Governance + Document
Intelligence + Grievance + Dashboard + Hardware**

------------------------------------------------------------------------

# 46. Key Differentiators

SahyogAI should communicate these seven differentiators:

### 1. Jurisdiction-Aware AI

The answer depends on the applicable cooperative jurisdiction.

### 2. Source-Grounded Legal RAG

Answers are grounded in verified documents.

### 3. Voice-First Rural UX

Users do not need to type complicated queries.

### 4. Cooperative Rights Assistant

Dedicated governance and member-rights workflows.

### 5. Conversational Grievance Creation

Users describe problems naturally; AI structures the complaint.

### 6. Document Intelligence

Users can ask the system to explain a cooperative/government document.

### 7. Edge-Ready Architecture

The same application can evolve from cloud-assisted kiosk to
hybrid/offline operation.

------------------------------------------------------------------------

# 47. Product Architecture Principle

The system must be modular.

``` text
                    SahyogAI CORE
                         │
        ┌────────────────┼────────────────┐
        │                │                │
       STT              AI              TTS
        │                │                │
        │       ┌────────┼────────┐       │
        │       │        │        │       │
        │    Legal    Grievance  OCR      │
        │      RAG       AI       │       │
        │       │        │        │       │
        └───────┴────────┴────────┴───────┘
                         │
                    APPLICATION API
                         │
                ┌────────┴────────┐
                │                 │
              WEB               KIOSK
```

Changing the LLM, STT provider, TTS provider, vector database or
hardware should not require rewriting the entire application.

------------------------------------------------------------------------

# 48. Product North Star

The product should ultimately answer three questions for a rural
cooperative member:

### 1. "What is my right?"

**Governance + Legal RAG**

### 2. "What should I do?"

**Actionable guidance + document assistance**

### 3. "How do I raise my issue?"

**Grievance generation + tracking**

Everything else supports these three outcomes.

------------------------------------------------------------------------

# 49. Final MVP Definition

> **SahyogAI is a multilingual, voice-first cooperative
> assistance platform that uses jurisdiction-aware RAG over verified
> government/cooperative documents to explain member rights and
> governance rules, assist with cooperative and financial queries,
> understand uploaded documents, and convert natural-language problems
> into structured grievances that can be tracked through an authority
> dashboard. A Raspberry Pi kiosk provides an accessible rural
> interface, while the architecture remains ready for future
> hybrid/offline deployment.**

------------------------------------------------------------------------

# 50. Final Feature Priority

## 🔴 P0 --- Must be demonstrated

1.  Hindi/Bengali/English
2.  Voice input
3.  Voice output
4.  Cooperative governance assistant
5.  Jurisdiction-aware RAG
6.  Verified source citations
7.  Grievance generation
8.  Grievance tracking
9.  Authority dashboard
10. Raspberry Pi kiosk

## 🟠 P1 --- Strong differentiators

11. Document OCR
12. Document explanation
13. Cooperative rights assistant
14. AI grievance classification
15. Evidence checklist
16. Financial literacy

## 🟢 P2 --- Future

17. More Indian languages
18. Real government API integrations
19. Offline STT/TTS
20. Edge LLM
21. Multi-kiosk network
22. Broader scheme coverage

------------------------------------------------------------------------

# 51. One-Line Pitch

> **"SahyogAI turns a rural member's voice into verified
> cooperative guidance and actionable grievance support---in their own
> language."**

# 52. Three-Line SIH Pitch

> **SahyogAI is a multilingual, voice-first AI assistant built
> specifically for cooperative members and rural users. It combines
> jurisdiction-aware legal RAG, cooperative governance assistance,
> document intelligence and conversational grievance management using
> verified government sources. A low-cost Raspberry Pi kiosk makes the
> system accessible even to users with limited digital literacy, while
> its architecture is designed to evolve toward hybrid and offline AI.**
