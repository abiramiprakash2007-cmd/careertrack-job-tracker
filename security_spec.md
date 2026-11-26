# CareerTrack Firestore Security Specification

## 1. Data Invariants

1. **Strict User Ownership & Isolation**: Every `/users/{userId}` document and `/users/{userId}/applications/{applicationId}` document is strictly scoped to `request.auth.uid == userId` AND `request.auth.token.email_verified == true`.
2. **Parent Existence (Master Gate)**: A `JobApplication` document cannot be created under `/users/{userId}/applications/{applicationId}` unless the parent `/users/{userId}` profile document exists and the incoming `userId` matches `request.auth.uid`.
3. **Immutable Identity & Creation Timestamp**: `uid` / `userId` and `createdAt` can never change after creation. `createdAt` and `updatedAt` must equal `request.time`.
4. **Strict Payload Boundaries**: Every string field enforces `.size()` limits matching `firebase-blueprint.json`. No extra/shadow keys are permitted on create or update.
5. **Query Security**: `allow list` on `/users/{userId}/applications` explicitly evaluates `resource.data.userId == request.auth.uid`.

## 2. Adversarial "Dirty Dozen" Payloads (Expected: PERMISSION_DENIED)

1. Unauthenticated read/write to `/users/uidA/applications/app1`.
2. Verified User B attempting `get` or `list` on `/users/uidA/applications`.
3. Verified User B attempting `create` on `/users/uidA/applications/app1`.
4. Unverified User A (`email_verified: false`) attempting `create` on `/users/uidA/applications/app1`.
5. User A creating `/users/uidA/applications/app1` with `userId: "uidB"` (Identity Spoofing).
6. User A creating `/users/uidA/applications/app1` with shadow field `isAdmin: true` (Shadow Field Injection).
7. User A creating `/users/uidA/applications/app1` with `companyName: ""` (Empty required field).
8. User A creating `/users/uidA/applications/app1` with `jobDescription` > 5000 chars (Resource Exhaustion).
9. User A creating `/users/uidA/applications/app1` with invalid `status: "Hired"` (Enum bypass).
10. User A updating `/users/uidA/applications/app1` and changing `createdAt` or `userId` (Immortal Field mutation).
11. User A updating `/users/uidA/applications/app1` with client-forged `updatedAt` != `request.time`.
12. User A writing to a 200-char invalid document ID `../../../etc/passwd` (Path Variable Poisoning).
