# 🛡️ GigGuard AI — Zero-Touch Income Protection for India's Gig Workers

> **GigGuard AI is a zero-touch, AI-driven parametric insurance 
> system that protects gig workers' income in real time without 
> requiring any manual claim process.**

> Guidewire DEVTrails 2026 · Team Submission · Phase 1
> Platform: Web Application · Persona: Q-Commerce Delivery Workers

---

## 📌 Quick Links

- 🔗 GitHub Repository: https://github.com/aasrithach/DevTrails-2026-GigGuard_AI
- 🎥 2-Minute Strategy Video: https://youtube.com/shorts/jcyRwT6Xoqc?feature=shared
- 🚀 Live Demo: Coming in Phase 2

---

## 🧠 Problem We Are Solving

India's gig economy depends on **daily earnings**, not fixed salaries.

External disruptions like:

- Heavy rain
- Extreme heat
- Pollution (AQI spikes)
- Traffic congestion
- Platform outages
- Dark store closures

can reduce working hours → causing **20–30% income loss**.

### ❌ Existing Gap

Traditional insurance covers:

- Health
- Accidents
- Vehicle damage

👉 **But NOT income loss due to external disruptions**

---

## ⚠️ Scope Clarification (Critical Constraint)

This solution strictly focuses on **income loss protection only**
and **excludes health, accident, and asset-based insurance**,
as required by the problem statement.

---

## 📖 Persona Scenario — Ravi (Real System Flow)

**Ravi Kumar — Zepto Delivery Partner, Kondapur**
Daily income: ₹900 · Weekly premium: ₹35

**Tuesday 8:00 PM**
System predicts **84% rain probability** → sends alert:
*"Heavy rain tomorrow. Coverage pre-activated. Predicted loss: ₹765"*

**Wednesday 7:14 AM**
Rain threshold crossed → disruption detected

**Within 4 seconds:**

- GPS verified ✓
- Weather confirmed ✓
- Activity drop detected ✓
- Fraud score: 0 → CLEAN ✓
- Claim approved ✓

**₹765 credited instantly via UPI**

👉 No claim filed. No waiting. Fully automated.

---

## 🎯 Our Solution

GigGuard AI is an **AI-powered parametric insurance platform** that:

- ✔ Predicts disruptions before they occur
- ✔ Uses weekly pricing aligned with gig income
- ✔ Automatically detects income loss
- ✔ Triggers claims instantly
- ✔ Processes payouts automatically

👉 **Zero paperwork. Zero delay. Zero effort.**

---

## 👤 Target Persona

Focused on **Q-Commerce workers (Zepto, Blinkit, Instamart)**

Why:

- Hyperlocal zones → precise risk modeling
- High disruption sensitivity
- Direct income dependency

---

## 🔄 System Workflow

1. Worker registers with zone, platform, and daily income
2. AI scores zone risk every 6 hours (0–100)
3. Weekly policy created with dynamic premium
4. System monitors weather, AQI, traffic every 15 minutes
5. Threshold crossed → disruption event created
6. Claim auto-triggered for all active workers in zone
7. Fraud scoring engine evaluates claim (5 rules)
8. Clean claims approved → payout processed via UPI
9. Worker receives alert + transaction confirmation

---

## 💰 Weekly Pricing Model

| Risk Level | Premium |
|------------|---------|
| Low        | ₹20     |
| Medium     | ₹35     |
| High       | ₹50     |

✔ Weekly-based (aligned with gig earnings)
✔ Dynamically adjusted using risk score

---

## ⚙️ Parametric Triggers

Automatic claim triggers:

- Rain > 70%
- AQI > 180
- Temperature > 42°C
- Traffic > 80%
- Platform outage
- Dark store closure

👉 No manual claims required

---

## 🤖 AI & Intelligence Layer

### Risk Scoring Model
```
riskScore = (0.40 × rainfall)
          + (0.25 × AQI)
          + (0.20 × traffic)
          + (0.15 × historical disruption)
```

👉 Output: Risk Score (0–100) → determines premium tier

---

### Income Loss Calculation
```
predictedLoss = dailyIncome × severityMultiplier
```

| Severity | Multiplier | Example (₹900/day) |
|----------|------------|-------------------|
| Low      | 0.25       | ₹225              |
| Medium   | 0.55       | ₹495              |
| High     | 0.85       | ₹765              |

---

### Fraud Detection (Scoring System)

| Rule                 | Points |
|----------------------|--------|
| GPS mismatch         | +35    |
| No active disruption | +40    |
| Duplicate claim      | +50    |
| Inactive account     | +25    |
| High claim frequency | +20    |

**Decision Logic:**

- Score 0–59 → Auto-approved
- Score 60–79 → Flagged for admin review
- Score 80+ → Auto-rejected

---

## ⚡ Key Differentiators

- Zero-touch insurance (no claims process)
- Predictive (before disruption)
- Hyper-local modeling
- Real-time automation
- Built for gig economy

---

## 🏗️ Tech Stack

| Layer      | Technology   | Version |
|------------|--------------|---------|
| Frontend   | React        | 18      |
| Build Tool | Vite         | 5       |
| Styling    | Tailwind CSS | 3       |
| Backend    | Spring Boot  | 3       |
| Language   | Java         | 17      |
| Database   | MySQL        | 8       |

---

## 🌐 Why Web Instead of Mobile

| Reason             | Explanation                        |
|--------------------|------------------------------------|
| Faster development | Single codebase for worker + admin |
| Better demo        | Easy for judges to access          |
| No installation    | Direct browser access              |
| Admin dashboard    | Needs larger screen                |
| Hackathon speed    | Faster iteration                   |

---

## 📊 Business Viability

- 1,000 workers × ₹35 = ₹35,000/week revenue
- ~15% claims × ₹600 = ₹9,000 payout

👉 Loss ratio ≈ 25% → sustainable model

---

## 📅 Development Plan

| Phase   | Focus                                 | Key Deliverable                     |
|---------|---------------------------------------|-------------------------------------|
| Phase 1 | Idea, architecture, prototype         | README.md + 2-minute strategy video |
| Phase 2 | Core system (policy, claims, pricing) | 2-min demo video + working code     |
| Phase 3 | AI, fraud, payouts, dashboards        | 5-min demo video + pitch deck PDF   |

---

## 🚨 Adversarial Defense & Anti-Spoofing Strategy

> **Market Crash Event Response**
> Scenario: A coordinated fraud ring of 500 fake delivery
> partners is using GPS spoofing to fake zone presence
> and drain payouts from GigGuard AI's liquidity pool.
> Here is how we fight back.

---

### The Attack We Are Defending Against

A coordinated fraud ring works like this:

- Fraudsters install GPS spoofing apps to fake their
  location inside a disrupted zone
- They register multiple accounts across the same zone
- When disruption triggers, all fake accounts claim
  simultaneously
- Payouts drain the pool before detection fires

The key insight: **a single GPS coordinate check is
useless against a spoofing app. Behavioral patterns
over time are not.**

---

### Layer 1 — GPS Signal Integrity

Simple coordinate matching is dead. We go deeper:

| Signal | What We Check | Fraud Indicator |
|--------|--------------|-----------------|
| GPS accuracy | Spoofed GPS shows unrealistically perfect accuracy | Accuracy < 3m consistently → flag |
| Location jump speed | Real workers cannot teleport | Zone change in < 5 mins → flag |
| Altitude consistency | Spoofed coords show wrong altitude | Mismatch for Hyderabad terrain → flag |
| Mock location API | Android exposes a mock location flag | Mock location enabled → immediate flag |
| Cell tower cross-check | GPS vs nearest tower location | Mismatch > 500m → flag |

A genuine stranded worker has consistent GPS,
matching tower data, and realistic accuracy.
A spoofer has perfect coordinates with no
matching tower signal.

---

### Layer 2 — Behavioral Pattern Detection

**Account clustering:**
If more than 15 accounts from the same device
fingerprint, IP range, or phone prefix register
in the same zone within 48 hours → ring detection
flag raised, all accounts frozen pending review.

**Claim velocity anomaly:**
```
If claims_per_zone_per_hour >
  (active_workers_in_zone × 0.3)
→ Coordinated fraud alert triggered
→ Freeze all pending claims in that zone
→ Require admin review before any payout
```

**Income vs claim mismatch:**
```
If claimed_daily_income >
  (zone_average_income × 1.8)
AND account_age < 7 days
→ Flag as suspicious registration
→ Cap payout at zone average until history builds
```

---

### Layer 3 — Network Graph Detection

A coordinated ring is not 500 independent actors.
They are connected. We detect the connections:

- **Device fingerprint clustering** — Same phone model,
  OS version, app version across 20+ accounts →
  same device factory reset and re-registered
- **Registration time clustering** — 50 accounts
  registered in the same 2-hour window →
  coordinated signup event
- **Referral chain fraud** — If Account A referred
  Account B referred Account C and all three claim
  simultaneously → chain fraud flag

When a ring is detected we do not just flag the
individual — we flag the entire connected cluster.

---

### Layer 4 — Disruption Correlation Validation

| Validation Check | How |
|-----------------|-----|
| Hyperlocal weather pin | Rain confirmed at GPS coordinates, not just zone-level forecast |
| Platform order drop | Worker's platform must show actual cancellations in zone at that time |
| Crowd-sourced baseline | If 90% of legitimate workers are NOT claiming but 50 new accounts are → anomaly |
| Historical zone baseline | Compare claim rate to same zone's average for similar disruptions |

A real heavy rain in Kondapur shows platform
order drops, consistent GPS across all workers,
and gradual claim accumulation. A fraud ring shows
perfect GPS, no platform correlation, and a sudden
spike of claims within seconds of the trigger.

---

### Layer 5 — How We Tell Real from Fake

The hardest problem: a genuine worker caught in a
flood who also has inconsistent GPS due to the storm.
How do we avoid punishing them?

**Graduated response — not binary block:**
```
Fraud Score 0–40:  AUTO-APPROVE
Fraud Score 41–60: APPROVE with 70% payout
                   Flag for post-event review
Fraud Score 61–80: HOLD for 2 hours
                   Send worker verification request
Fraud Score 81+:   REJECT + account freeze
                   Admin review to unfreeze
```

**Established worker benefit:**
A worker with Protection Score > 75 and 6+ months
of clean history gets an automatic 20-point fraud
score reduction. A 3-day-old account gets none.

This ensures genuine workers — especially those
with poor GPS signal during storms — are not
wrongly rejected.

---

### Ring Detection Response Protocol

When ring detection fires:

1. **Immediately** → Freeze all payouts for flagged
   cluster. No money leaves the system.
2. **Within 1 hour** → Admin alert with full network
   graph of connected accounts.
3. **Worker notification** → Legitimate workers caught
   in the freeze receive: *"Payout under review —
   expected within 4 hours."*
4. **Resolution** → Admin approves legitimate workers,
   permanently bans fraud accounts.
5. **Learning** → Fraud patterns added to detection
   model for future events.

---

### Why This Works for GigGuard AI

Our system has an inherent advantage: we know the
disruption is real before any claim is filed. The
question is never "did the rain happen?" — it is
always "was this specific worker actually there?"

That shifts fraud detection from claim-level
validation to worker-level behavioral analysis.
A fraud ring cannot fake 6 months of consistent
delivery behavior in Kondapur. They can only fake
today's GPS coordinates. And that is exactly
what we catch.

---

## 🎯 Impact

GigGuard AI ensures:

- ✔ Financial stability for gig workers
- ✔ Instant payouts
- ✔ Fair compensation
- ✔ Scalable insurance model

---

## 🏁 Conclusion

GigGuard AI transforms insurance from
manual claims → **zero-touch income protection**

👉 Built for the future of gig workers.
