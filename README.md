# 🛡️ GigGuard AI

### *"Disruption hits. We pay. You deliver."*

`Phase 2 Submission` `Guidewire DEVTrails 2026` `Team GigGuard`

---

## 🚀 What Was Built in Phase 2

| Feature | Status |
| :--- | :--- |
| Dynamic Premium Calculation | ✅ Complete |
| Automated Claim Trigger | ✅ Complete |
| Fraud Detection Engine | ✅ Complete |
| Live Zone Risk Dashboard | ✅ Complete |
| Demo Simulation Controls | ✅ Complete |
| Admin Operations Center | ✅ Complete |

---

## ⚙️ How to Run (Zero External Dependencies)

### 🟢 Backend
1. `cd backend`
2. `mvn spring-boot:run`
- **Note**: The H2 in-memory database auto-starts upon launch.
- **Note**: `DataSeeder.java` pre-loads all demo workers, policies, and specific fraud scenarios.
- **Endpoint**: `http://localhost:8080`

### 🔵 Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`
- **Endpoint**: `http://localhost:5173`

---

## 🎬 Demo Flow (Step-by-Step for Judges)

1. Open `http://localhost:5173/admin` — observe three live zone risk cards with real-time scores.
2. Note **Kondapur** currently at **MEDIUM** risk with a **₹35/week** premium.
3. In the **Disruption Simulation Engine** (Control Panel), select **Kondapur** + **RAIN** + **HIGH**.
4. Click **Simulate Disruption** — watch the Kondapur risk card spike and the badge flip to **HIGH** risk with **₹50** premium.
5. Watch **3 claim cards** appear one by one — each showing worker name, payout, fraud score, and color-coded status.
6. Confirm the feed contains at least one **APPROVED** (green) and one **FLAGGED** (amber) or **REJECTED** (red) claim based on worker history.
7. Click **Simulate** again without resetting — confirm the **high-frequency fraud rule** triggers for workers who just claimed.
8. Open `http://localhost:5173/login` — log in with `9876543210` / `worker123` to see the live worker dashboard and protection shield.
9. Open `http://localhost:5173/register` to walk through the premium multi-step worker onboarding flow.

---

## 🏗️ Phase 2 Architecture

**System Overview:**
Browser → React 18 + Vite → Axios → Spring Boot 3 → H2 In-Memory DB

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Tailwind | High-impact UI + real-time demo control center |
| **Backend** | Spring Boot 3 (Java 17) | RESTful API exposing risk, policy, and claim logic |
| **Database** | H2 In-Memory | Zero-setup persistence for demo consistency |
| **Auth** | JWT + BCrypt | Stateless secure sessions for workers and admins |
| **Risk Engine** | ConcurrentHashMap | Real-time in-memory zone risk scoring (Parametric) |
| **Fraud Engine** | Rule-Based Controller | 5-rule fraud detection logic within claim simulation |

---

## 👤 Seeded Demo Accounts

| Role | Email / Phone | Password | Zone |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@gigguard.com` | `admin123` | — |
| **Worker (Clean History)** | `9876543210` | `worker123` | Kondapur |
| **Worker (New Account)** | `9876543220` | `worker123` | Kondapur |
| **Worker (High Freq)** | `9876543221` | `worker123` | Kondapur |

---

## 🤖 Fraud Detection Rules

| Rule | Weight / Impact |
| :--- | :--- |
| **GPS Mismatch** | +35 Points |
| **No Active Disruption** | +40 Points |
| **Duplicate/High Frequency** | +50 Points |
| **New/Inactive Account** | +25 Points |
| **Identity Anomaly** | +20 Points |

**Thresholds:**
- **0–59**: ✅ **APPROVED** (Instant Payout)
- **60–79**: ⚠️ **FLAGGED** (Human Review)
- **80+**: ❌ **REJECTED** (Fraud Suspected)

*Random jitter (0–15 points) ensures score variety across demo runs.*

---

## 📅 Phase 3 Roadmap

- 💸 **UPI Payout Integration**: Real-time fund disbursement via Razorpay/Hyperface API.
- 📱 **Mobile PWA**: Progressive Web App with push notifications for disruption alerts.
- 🧠 **ML-Based Risk Scoring**: Replacing weighted formulas with training models on historical rainfall/traffic data.

---

<p align="center">
  <b>Built for Guidewire DEVTrails 2026 · Phase 2 · Team GigGuard</b><br>
  🎥 <a href="https://youtube.com/shorts/jcyRwT6Xoqc?feature=shared">2-Minute Strategy Video</a>
</p>
