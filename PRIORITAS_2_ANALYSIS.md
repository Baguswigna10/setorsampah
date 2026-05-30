# PRIORITAS 2: CLAIM POINT - ANALISIS FRAMEWORK

**Status:** 🔍 PENDING REQUIREMENT CLARIFICATION

---

## ❓ INFORMASI YANG DIBUTUHKAN DARI PROPOSAL

Untuk implementasi PRIORITAS 2 yang akurat, saya membutuhkan penjelasan dari proposal tentang:

### 1. **Spesifikasi Fitur Claim Point**
- [ ] Apa definisi exact dari "Claim Point"?
- [ ] Apakah ini convert poin ke hadiah/reward/cash?
- [ ] Apakah ada sistem approval/waiting period?
- [ ] Bisakah claim point dilakukan kapan saja atau ada minimum poin?

### 2. **Business Rules**
- [ ] Apakah semua poin bisa di-claim atau ada yang locked?
- [ ] Apakah ada limit/quota untuk claim per periode?
- [ ] Bagaimana tracking history claim?
- [ ] Apakah poin berkurang setelah di-claim?

### 3. **Data Model Requirements**
- [ ] Perlu entity baru untuk menyimpan history claim?
- [ ] Perlu field baru di User entity (claimablePoints, claimedPoints)?
- [ ] Perlu status/state untuk claim (pending, approved, rejected)?

### 4. **API Endpoint Specification**
- [ ] Endpoint untuk claim poin? (POST /api/claims atau PUT /api/users/{id}/claim-points?)
- [ ] Endpoint untuk get history claim? (GET /api/users/{id}/claim-history?)
- [ ] Endpoint untuk get current claimable balance?

### 5. **Response Format**
- [ ] Contoh JSON response untuk claim success?
- [ ] Contoh JSON response untuk claim history?
- [ ] Validasi/error handling apa saja?

### 6. **Integration dengan Existing Data**
- [ ] Apakah reward system sudah ada dan need to integrate?
- [ ] Apakah ada relation dengan WasteBank atau WasteCategory?
- [ ] Apakah ada approval workflow melibatkan admin/bank?

---

## 📊 CURRENT CODEBASE ANALYSIS - POIN SYSTEM

### Existing Poin Mechanism

**User Entity:**
```java
@Column(name = "point")
private Double point;  // Current balance
```

**How Points Earned:**
1. User membuat transaksi setoran sampah (POST /api/transactions)
2. Sistem hitung: `point = weight * category.pointPerKg`
3. User.point += totalPoint (accumulated)

**Current Flow:**
```
User deposit waste 
  → Transaction created with totalPoint
  → User.point updated (balance++)
  → No tracking who claimed or spent
```

---

## 🔧 POTENTIAL IMPLEMENTATION OPTIONS

### **OPTION A: Simple Claim System**
Minimal changes - add claim endpoint yang langsung process claim

**Changes needed:**
- Service method: `claimPoints(userId, amount)`
- Controller endpoint: `POST /api/users/{id}/claim-points`
- Entity: Add `lastClaimDate` timestamp to User
- No history table needed

**Pros:** Simple, quick to implement
**Cons:** No audit trail, cannot track claim history

---

### **OPTION B: Claim History Tracking**
Medium complexity - track every claim action

**Changes needed:**
- NEW Entity: `PointClaim` (userId, amount, claimDate, status)
- NEW Repository: `PointClaimRepository`
- NEW Service: `PointClaimService`
- Modify User: Add `@OneToMany List<PointClaim> claims`
- Controller: Multiple endpoints (claim, history, etc)

**Pros:** Full audit trail, can query history
**Cons:** More entities, more complex

---

### **OPTION C: Claimable vs Claimed Separation**
Advanced - track claimable vs claimed balance

**Changes needed:**
- User Entity: Add `claimablePoints` and `claimedPoints` fields
- PointClaim Entity: Track claim status (PENDING/APPROVED/REJECTED)
- Approval workflow (optional)
- Service: Handle claimable calculation logic

**Pros:** Clear separation, supports approval workflow
**Cons:** More complex business logic

---

## 🎯 RECOMMENDED APPROACH

**Awaiting your clarification, I recommend:**

If Claim Point is simple redemption → **OPTION A**
If need history tracking → **OPTION B** 
If need approval workflow → **OPTION C**

---

## 📋 REQUIRED DOCUMENTATION

Please provide from proposal:

1. **Functional Requirements:**
   - User story/use case untuk Claim Point
   - Happy path scenario
   - Error scenarios

2. **Technical Requirements:**
   - DTO structure example
   - Response format sample
   - Validation rules

3. **Business Requirements:**
   - Min/max poin untuk claim?
   - Claim frequency limits?
   - Any charges/conversion rate?

4. **Database Design:**
   - New tables/entities needed?
   - Relationships with existing entities?

5. **API Design:**
   - Endpoint paths
   - Request/response bodies
   - Status codes & errors

---

## ⏸️ WAITING FOR

Please share:
- [ ] Proposal document atau screenshot requirement PRIORITAS 2
- [ ] Clarification on above questions
- [ ] Any design mockups or wireframes
- [ ] Success/error scenarios

Once received, I will:
1. ✅ Select best option (A/B/C)
2. ✅ Create entity/DTO/service/controller
3. ✅ Implement business logic
4. ✅ Create test cases
5. ✅ Document thoroughly

**Estimated time for implementation:** 30-45 minutes after requirement clarification
