# AWS SBG REC — API Contract

**Base URL:** `http://localhost:3000/api`  
**Content-Type:** `application/json`  
**Last Updated:** 2026-06-21

---

## Table of Contents

1. [Global Conventions](#1-global-conventions)
2. [Certifications (Read-Only)](#2-certifications-read-only)
3. [Domains (Admin CRUD)](#3-domains-admin-crud)
4. [Topics (Admin CRUD)](#4-topics-admin-crud)
5. [Career Roles (Admin CRUD)](#5-career-roles-admin-crud)
6. [Pathway Builder (Admin)](#6-pathway-builder-admin)
7. [Career Opportunities (Admin CRUD)](#7-career-opportunities-admin-crud)
8. [Learner Career Pathways (Read-Only)](#8-learner-career-pathways-read-only)
9. [Error Response Format](#9-error-response-format)
10. [Database Reference](#10-database-reference)

---

## 1. Global Conventions

### Prefix

All endpoints are prefixed with `/api`. Examples:

- `GET http://localhost:3000/api/certifications`
- `POST http://localhost:3000/api/admin/career-roles`

### UUIDs

All entity IDs are UUID v4 strings.

### Timestamps

All timestamps are ISO 8601 UTC strings (e.g., `"2026-06-20T19:04:49.388Z"`).

### Slug Format

- Lowercase alphanumeric characters and hyphens only.
- Leading/trailing hyphens stripped.
- Generated automatically from `name` on create/update.

### Validation Errors

All validation errors return HTTP 400 with:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": ["Field-specific error message"]
}
```

### Not Found Errors

All not-found errors return HTTP 404 with:

```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Entity with id \"...\" not found"
}
```

---

## 2. Certifications (Read-Only)

Public endpoints. No authentication required.

---

### GET /api/certifications

Returns all active certifications sorted by display order.

**Response: 200 OK**

```json
{
  "id": "0c3761cf-8679-4c80-b34e-7fb971153201",
  "title": "AWS Certified Cloud Practitioner",
  "slug": "aws-cloud-practitioner",
  "examCode": "CLF-C02",
  "badgeImageUrl": null,
  "level": "Foundational",
  "displayOrder": 1
}
```

**Full Response Shape:**

```json
[
  {
    "id": "string",
    "title": "string",
    "slug": "string",
    "examCode": "string",
    "badgeImageUrl": "string | null",
    "level": "string",
    "displayOrder": "number"
  }
]
```

---

### GET /api/certifications/:slug

Returns a single certification with nested domains and topics.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `slug` | string | Certification slug (e.g., `aws-cloud-practitioner`) |

**Response: 200 OK**

```json
{
  "id": "0c3761cf-8679-4c80-b34e-7fb971153201",
  "title": "AWS Certified Cloud Practitioner",
  "slug": "aws-cloud-practitioner",
  "examCode": "CLF-C02",
  "examDuration": "90 minutes",
  "totalQuestions": 65,
  "examCost": 100,
  "examMode": "online or in-person",
  "badgeImageUrl": null,
  "level": {
    "id": "420c7078-1da5-4b25-8664-5cc95e74d9bb",
    "name": "Foundational"
  },
  "domains": [
    {
      "id": "string",
      "name": "Cloud Concepts",
      "weightage": 24,
      "displayOrder": 1,
      "topics": [
        {
          "id": "string",
          "name": "Value of AWS Cloud",
          "displayOrder": 1
        }
      ]
    }
  ]
}
```

**Error: 404 Not Found**

```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Certification with slug \"invalid-slug\" not found"
}
```

---

## 3. Domains (Admin CRUD)

Admin endpoints for managing certification domains.

---

### POST /api/admin/certifications/:certificationId/domains

Create a domain under a certification.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `certificationId` | string (UUID) | Parent certification ID |

**Request Body:**

```json
{
  "name": "Cloud Concepts",
  "weightage": 24,
  "displayOrder": 1
}
```

**Validation Rules:**

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `name` | string | Yes | Non-empty string |
| `weightage` | number | Yes | Must be a number, minimum 0 |
| `displayOrder` | number | Yes | Must be a positive number (> 0) |

**Response: 201 Created**

```json
{
  "id": "string",
  "certificationId": "string",
  "name": "Cloud Concepts",
  "weightage": 24,
  "displayOrder": 1,
  "createdAt": "2026-06-20T00:00:00.000Z",
  "updatedAt": "2026-06-20T00:00:00.000Z"
}
```

**Error: 404 Not Found**

```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Certification with id \"...\" not found"
}
```

---

### PATCH /api/admin/domains/:domainId

Update a domain. All fields are optional.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `domainId` | string (UUID) | Domain ID |

**Request Body:**

```json
{
  "name": "Cloud Concepts Updated",
  "weightage": 30,
  "displayOrder": 2
}
```

**Validation Rules:**

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `name` | string | No | Non-empty string |
| `weightage` | number | No | Must be a number, minimum 0 |
| `displayOrder` | number | No | Must be a positive number (> 0) |

**Response: 200 OK**

```json
{
  "id": "string",
  "certificationId": "string",
  "name": "Cloud Concepts Updated",
  "weightage": 30,
  "displayOrder": 2,
  "createdAt": "2026-06-20T00:00:00.000Z",
  "updatedAt": "2026-06-20T00:00:00.000Z"
}
```

---

### DELETE /api/admin/domains/:domainId

Delete a domain and all its topics (cascade).

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `domainId` | string (UUID) | Domain ID |

**Response: 200 OK**

```json
{
  "deleted": true
}
```

**Error: 404 Not Found**

```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Domain with id \"...\" not found"
}
```

---

## 4. Topics (Admin CRUD)

Admin endpoints for managing domain topics.

---

### POST /api/admin/domains/:domainId/topics

Create a topic under a domain.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `domainId` | string (UUID) | Parent domain ID |

**Request Body:**

```json
{
  "name": "Value of AWS Cloud",
  "displayOrder": 1
}
```

**Validation Rules:**

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `name` | string | Yes | Non-empty string |
| `displayOrder` | number | Yes | Must be a positive number (> 0) |

**Response: 201 Created**

```json
{
  "id": "string",
  "domainId": "string",
  "name": "Value of AWS Cloud",
  "displayOrder": 1,
  "createdAt": "2026-06-20T00:00:00.000Z",
  "updatedAt": "2026-06-20T00:00:00.000Z"
}
```

---

### PATCH /api/admin/topics/:topicId

Update a topic. All fields are optional.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `topicId` | string (UUID) | Topic ID |

**Request Body:**

```json
{
  "name": "Value of AWS Cloud Updated",
  "displayOrder": 3
}
```

**Validation Rules:**

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `name` | string | No | Non-empty string |
| `displayOrder` | number | No | Must be a positive number (> 0) |

**Response: 200 OK**

```json
{
  "id": "string",
  "domainId": "string",
  "name": "Value of AWS Cloud Updated",
  "displayOrder": 3,
  "createdAt": "2026-06-20T00:00:00.000Z",
  "updatedAt": "2026-06-20T00:00:00.000Z"
}
```

---

### DELETE /api/admin/topics/:topicId

Delete a topic.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `topicId` | string (UUID) | Topic ID |

**Response: 200 OK**

```json
{
  "deleted": true
}
```

---

## 5. Career Roles (Admin CRUD)

Admin endpoints for managing career roles.

---

### POST /api/admin/career-roles

Create a new career role. Slug is auto-generated from name.

**Request Body:**

```json
{
  "name": "Cloud Architect",
  "description": "Design and guide structural blueprints for cloud deployment."
}
```

**Validation Rules:**

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `name` | string | Yes | Non-empty string |
| `description` | string | Yes | Non-empty string |

**Response: 201 Created**

```json
{
  "id": "fbdf637c-3c27-47e7-afb7-9582ec349b74",
  "name": "Cloud Architect",
  "slug": "cloud-architect",
  "description": "Design and guide structural blueprints for cloud deployment.",
  "createdAt": "2026-06-20T19:04:49.388Z",
  "updatedAt": "2026-06-20T19:04:49.388Z"
}
```

**Error: 409 Conflict**

```json
{
  "statusCode": 409,
  "error": "Conflict",
  "message": "A career role with slug \"cloud-architect\" already exists"
}
```

---

### GET /api/admin/career-roles

List all career roles with certification and opportunity counts.

**Response: 200 OK**

```json
[
  {
    "id": "fbdf637c-3c27-47e7-afb7-9582ec349b74",
    "name": "Cloud Architect",
    "slug": "cloud-architect",
    "description": "Design and guide structural blueprints for cloud deployment.",
    "createdAt": "2026-06-20T19:04:49.388Z",
    "updatedAt": "2026-06-20T19:04:49.388Z",
    "_count": {
      "certifications": 3,
      "opportunities": 3
    }
  }
]
```

---

### GET /api/admin/career-roles/:id

Get a single career role with full pathway and opportunities.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | Career role ID |

**Response: 200 OK**

```json
{
  "id": "fbdf637c-3c27-47e7-afb7-9582ec349b74",
  "name": "Cloud Architect",
  "slug": "cloud-architect",
  "description": "Design and guide structural blueprints for cloud deployment.",
  "createdAt": "2026-06-20T19:04:49.388Z",
  "updatedAt": "2026-06-20T19:04:49.388Z",
  "certifications": [
    {
      "id": "0a71bc02-9e52-4586-94bb-9d60b52d3958",
      "roleId": "fbdf637c-3c27-47e7-afb7-9582ec349b74",
      "certificationId": "0c3761cf-8679-4c80-b34e-7fb971153201",
      "pathOrder": 1,
      "certification": {
        "id": "0c3761cf-8679-4c80-b34e-7fb971153201",
        "title": "AWS Certified Cloud Practitioner",
        "slug": "aws-cloud-practitioner",
        "examCode": "CLF-C02",
        "level": {
          "id": "420c7078-1da5-4b25-8664-5cc95e74d9bb",
          "name": "Foundational"
        }
      }
    },
    {
      "id": "b7d3b1e8-ad58-4f37-a828-9a1f9628fd8e",
      "roleId": "fbdf637c-3c27-47e7-afb7-9582ec349b74",
      "certificationId": "9d45490c-5c5e-4ac1-9d2f-b32393347b2f",
      "pathOrder": 2,
      "certification": {
        "id": "9d45490c-5c5e-4ac1-9d2f-b32393347b2f",
        "title": "AWS Certified Solutions Architect - Associate",
        "slug": "aws-solutions-architect-associate",
        "examCode": "SAA-C03",
        "level": {
          "id": "5e610d7a-2cc2-4d58-900a-a99aa02ec842",
          "name": "Associate"
        }
      }
    }
  ],
  "opportunities": [
    {
      "id": "6877ce6f-dea9-4370-b9d6-2d96fe60e943",
      "roleId": "fbdf637c-3c27-47e7-afb7-9582ec349b74",
      "title": "Cloud Architect",
      "displayOrder": 1,
      "createdAt": "2026-06-20T19:05:23.713Z",
      "updatedAt": "2026-06-20T19:05:23.713Z"
    }
  ]
}
```

**Error: 404 Not Found**

```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Career role with id \"...\" not found"
}
```

---

### PATCH /api/admin/career-roles/:id

Update a career role. All fields optional. Slug auto-regenerates if name changes.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | Career role ID |

**Request Body:**

```json
{
  "name": "Senior Cloud Architect",
  "description": "Updated description."
}
```

**Validation Rules:**

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `name` | string | No | Non-empty string |
| `description` | string | No | Non-empty string |

**Response: 200 OK**

```json
{
  "id": "fbdf637c-3c27-47e7-afb7-9582ec349b74",
  "name": "Senior Cloud Architect",
  "slug": "senior-cloud-architect",
  "description": "Updated description.",
  "createdAt": "2026-06-20T19:04:49.388Z",
  "updatedAt": "2026-06-20T19:10:00.000Z"
}
```

---

### DELETE /api/admin/career-roles/:id

Delete a career role and all its pathway links and opportunities (cascade).

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | Career role ID |

**Response: 200 OK**

```json
{
  "deleted": true
}
```

---

## 6. Pathway Builder (Admin)

Manages the ordered certification pathway for a career role.

---

### PUT /api/admin/career-roles/:roleId/pathway

Replace the entire pathway atomically. The array order becomes `pathOrder` (1-indexed).

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `roleId` | string (UUID) | Career role ID |

**Request Body:**

```json
{
  "certificationIds": [
    "0c3761cf-8679-4c80-b34e-7fb971153201",
    "9d45490c-5c5e-4ac1-9d2f-b32393347b2f",
    "3bdc9414-68b5-4b47-92d0-aa11ff4e1b3d"
  ]
}
```

**Validation Rules:**

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `certificationIds` | string[] | Yes | Non-empty array, each item must be valid UUID v4, no duplicates allowed |

**Behavior:**

- All existing `RoleCertification` records for this role are deleted.
- New records are created with `pathOrder` = array index + 1.
- Operation is atomic (database transaction).
- If any certification ID does not exist, the entire operation fails with 404.

**Path Order Mapping:**

| Array Index | pathOrder |
|-------------|-----------|
| 0 | 1 |
| 1 | 2 |
| 2 | 3 |

**Deselection Behavior:**

When the admin removes a certification from the middle of the pathway, all subsequent items are renumbered. No gaps are allowed.

```
Before: [Cloud Practitioner, Solutions Architect Associate, Solutions Architect Professional]
After removing index 1: [Cloud Practitioner, Solutions Architect Professional]
Result: pathOrder 1 → Cloud Practitioner, pathOrder 2 → Solutions Architect Professional
```

**Response: 200 OK**

```json
{
  "roleId": "fbdf637c-3c27-47e7-afb7-9582ec349b74",
  "pathway": [
    {
      "pathOrder": 1,
      "certification": {
        "id": "0c3761cf-8679-4c80-b34e-7fb971153201",
        "title": "AWS Certified Cloud Practitioner",
        "slug": "aws-cloud-practitioner",
        "examCode": "CLF-C02",
        "level": {
          "id": "420c7078-1da5-4b25-8664-5cc95e74d9bb",
          "name": "Foundational"
        }
      }
    },
    {
      "pathOrder": 2,
      "certification": {
        "id": "9d45490c-5c5e-4ac1-9d2f-b32393347b2f",
        "title": "AWS Certified Solutions Architect - Associate",
        "slug": "aws-solutions-architect-associate",
        "examCode": "SAA-C03",
        "level": {
          "id": "5e610d7a-2cc2-4d58-900a-a99aa02ec842",
          "name": "Associate"
        }
      }
    },
    {
      "pathOrder": 3,
      "certification": {
        "id": "3bdc9414-68b5-4b47-92d0-aa11ff4e1b3d",
        "title": "AWS Certified Solutions Architect - Professional",
        "slug": "aws-solutions-architect-professional",
        "examCode": "SAP-C02",
        "level": {
          "id": "f7c48608-4a7c-4bec-a081-ae344a9f3a9f",
          "name": "Professional"
        }
      }
    }
  ]
}
```

**Error: 400 Bad Request — Duplicate IDs**

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": ["Duplicate certification IDs are not allowed"]
}
```

**Error: 404 Not Found — Invalid Role**

```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Career role with id \"...\" not found"
}
```

**Error: 404 Not Found — Missing Certifications**

```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Certifications not found: 12345678-1234-4234-8234-123456789abc"
}
```

---

## 7. Career Opportunities (Admin CRUD)

Admin endpoints for managing career opportunities tied to a role.

---

### POST /api/admin/career-roles/:roleId/opportunities

Create an opportunity under a career role.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `roleId` | string (UUID) | Parent career role ID |

**Request Body:**

```json
{
  "title": "Cloud Architect",
  "displayOrder": 1
}
```

**Validation Rules:**

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `title` | string | Yes | Non-empty string |
| `displayOrder` | number | Yes | Must be a positive number (> 0) |

**Response: 201 Created**

```json
{
  "id": "6877ce6f-dea9-4370-b9d6-2d96fe60e943",
  "roleId": "fbdf637c-3c27-47e7-afb7-9582ec349b74",
  "title": "Cloud Architect",
  "displayOrder": 1,
  "createdAt": "2026-06-20T19:05:23.713Z",
  "updatedAt": "2026-06-20T19:05:23.713Z"
}
```

---

### PATCH /api/admin/opportunities/:id

Update an opportunity. All fields optional.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | Opportunity ID |

**Request Body:**

```json
{
  "title": "Senior Cloud Architect",
  "displayOrder": 5
}
```

**Validation Rules:**

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `title` | string | No | Non-empty string |
| `displayOrder` | number | No | Must be a positive number (> 0) |

**Response: 200 OK**

```json
{
  "id": "6877ce6f-dea9-4370-b9d6-2d96fe60e943",
  "roleId": "fbdf637c-3c27-47e7-afb7-9582ec349b74",
  "title": "Senior Cloud Architect",
  "displayOrder": 5,
  "createdAt": "2026-06-20T19:05:23.713Z",
  "updatedAt": "2026-06-20T19:10:00.000Z"
}
```

---

### DELETE /api/admin/opportunities/:id

Delete an opportunity.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | Opportunity ID |

**Response: 200 OK**

```json
{
  "deleted": true
}
```

---

## 8. Learner Career Pathways (Read-Only)

Public endpoints for the learner-facing frontend. No authentication required.

---

### GET /api/career-pathways

Returns all career roles as a lightweight list.

**Response: 200 OK**

```json
[
  {
    "id": "fbdf637c-3c27-47e7-afb7-9582ec349b74",
    "name": "Cloud Architect",
    "slug": "cloud-architect",
    "description": "Design and guide structural blueprints for cloud deployment."
  }
]
```

**Full Response Shape:**

```json
[
  {
    "id": "string",
    "name": "string",
    "slug": "string",
    "description": "string"
  }
]
```

---

### GET /api/career-pathways/:slug

Returns a single career role with its ordered pathway and opportunities.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `slug` | string | Career role slug (e.g., `cloud-architect`) |

**Response: 200 OK**

```json
{
  "id": "fbdf637c-3c27-47e7-afb7-9582ec349b74",
  "name": "Cloud Architect",
  "slug": "cloud-architect",
  "description": "Design and guide structural blueprints for cloud deployment.",
  "pathway": [
    {
      "pathOrder": 1,
      "certification": {
        "id": "0c3761cf-8679-4c80-b34e-7fb971153201",
        "title": "AWS Certified Cloud Practitioner",
        "slug": "aws-cloud-practitioner"
      }
    },
    {
      "pathOrder": 2,
      "certification": {
        "id": "9d45490c-5c5e-4ac1-9d2f-b32393347b2f",
        "title": "AWS Certified Solutions Architect - Associate",
        "slug": "aws-solutions-architect-associate"
      }
    },
    {
      "pathOrder": 3,
      "certification": {
        "id": "3bdc9414-68b5-4b47-92d0-aa11ff4e1b3d",
        "title": "AWS Certified Solutions Architect - Professional",
        "slug": "aws-solutions-architect-professional"
      }
    }
  ],
  "opportunities": [
    {
      "id": "6877ce6f-dea9-4370-b9d6-2d96fe60e943",
      "title": "Cloud Architect",
      "displayOrder": 1
    },
    {
      "id": "b13e3b1f-4d97-490e-9825-d4c44412c707",
      "title": "Solutions Architect",
      "displayOrder": 2
    },
    {
      "id": "8ec7d7a8-cfe3-434e-ae82-f29d72ca521c",
      "title": "Cloud Consultant",
      "displayOrder": 3
    }
  ]
}
```

**Sorting:**

- `pathway` — sorted by `pathOrder` ascending
- `opportunities` — sorted by `displayOrder` ascending

**Error: 404 Not Found**

```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Career pathway with slug \"invalid-slug\" not found"
}
```

---

## 9. Error Response Format

All errors follow a consistent structure:

### 400 Bad Request — Validation Error

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": ["Field-specific error message"]
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Resource description not found"
}
```

### 409 Conflict

```json
{
  "statusCode": 409,
  "error": "Conflict",
  "message": "Resource already exists"
}
```

### Validation Error Examples

| Trigger | Response |
|---------|----------|
| Missing required field | `"message": ["Field name is required"]` |
| Invalid UUID format | `"message": ["Each certification ID must be a valid UUID"]` |
| Duplicate in array | `"message": ["Duplicate certification IDs are not allowed"]` |
| Non-existent FK | `"message": "Certifications not found: <id-list>"` |
| Duplicate unique field | `"message": "A career role with slug \"...\" already exists"` |

---

## 10. Database Reference

### Entity Relationship Diagram

```
CertificationLevel  1──N  Certification  1──N  CertificationDomain  1──N  CertificationTopic
                              │
                    RoleCertification (join table)
                              │
                         CareerRole  1──N  CareerOpportunity
```

### Tables

#### CertificationLevel

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PRIMARY KEY, auto-generated |
| `name` | String | UNIQUE, NOT NULL |
| `displayOrder` | Int | NOT NULL |
| `createdAt` | DateTime | auto |
| `updatedAt` | DateTime | auto |

#### Certification

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PRIMARY KEY, auto-generated |
| `title` | String | NOT NULL |
| `slug` | String | UNIQUE, NOT NULL |
| `examCode` | String | UNIQUE, NOT NULL |
| `badgeImageUrl` | String | NULLABLE |
| `examDuration` | String | NOT NULL |
| `totalQuestions` | Int | NOT NULL |
| `examCost` | Float | NOT NULL |
| `examMode` | String | NOT NULL |
| `displayOrder` | Int | NOT NULL |
| `isActive` | Boolean | DEFAULT true |
| `levelId` | UUID | FK → CertificationLevel.id |
| `createdAt` | DateTime | auto |
| `updatedAt` | DateTime | auto |

#### CertificationDomain

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PRIMARY KEY, auto-generated |
| `certificationId` | UUID | FK → Certification.id, CASCADE DELETE |
| `name` | String | NOT NULL |
| `weightage` | Float | NOT NULL |
| `displayOrder` | Int | NOT NULL |
| `createdAt` | DateTime | auto |
| `updatedAt` | DateTime | auto |

#### CertificationTopic

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PRIMARY KEY, auto-generated |
| `domainId` | UUID | FK → CertificationDomain.id, CASCADE DELETE |
| `name` | String | NOT NULL |
| `displayOrder` | Int | NOT NULL |
| `createdAt` | DateTime | auto |
| `updatedAt` | DateTime | auto |

#### CareerRole

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PRIMARY KEY, auto-generated |
| `name` | String | UNIQUE, NOT NULL |
| `slug` | String | UNIQUE, NOT NULL |
| `description` | String | NOT NULL |
| `createdAt` | DateTime | auto |
| `updatedAt` | DateTime | auto |

#### RoleCertification

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PRIMARY KEY, auto-generated |
| `roleId` | UUID | FK → CareerRole.id, CASCADE DELETE |
| `certificationId` | UUID | FK → Certification.id, CASCADE DELETE |
| `pathOrder` | Int | NOT NULL |
| | | UNIQUE (roleId, certificationId) |

#### CareerOpportunity

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | UUID | PRIMARY KEY, auto-generated |
| `roleId` | UUID | FK → CareerRole.id, CASCADE DELETE |
| `title` | String | NOT NULL |
| `displayOrder` | Int | NOT NULL |
| `createdAt` | DateTime | auto |
| `updatedAt` | DateTime | auto |

### Cascade Rules

| Parent Table | Child Table | On Delete |
|---|---|---|
| Certification | CertificationDomain | CASCADE |
| CertificationDomain | CertificationTopic | CASCADE |
| Certification | RoleCertification | CASCADE |
| CareerRole | RoleCertification | CASCADE |
| CareerRole | CareerOpportunity | CASCADE |

---

## Endpoint Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| **Certifications** ||||
| GET | `/api/certifications` | Public | List all active certifications |
| GET | `/api/certifications/:slug` | Public | Get certification detail with domains & topics |
| **Domains** ||||
| POST | `/api/admin/certifications/:certificationId/domains` | Admin | Create domain under certification |
| PATCH | `/api/admin/domains/:domainId` | Admin | Update a domain |
| DELETE | `/api/admin/domains/:domainId` | Admin | Delete domain (cascades to topics) |
| **Topics** ||||
| POST | `/api/admin/domains/:domainId/topics` | Admin | Create topic under domain |
| PATCH | `/api/admin/topics/:topicId` | Admin | Update a topic |
| DELETE | `/api/admin/topics/:topicId` | Admin | Delete a topic |
| **Career Roles** ||||
| POST | `/api/admin/career-roles` | Admin | Create career role |
| GET | `/api/admin/career-roles` | Admin | List all career roles |
| GET | `/api/admin/career-roles/:id` | Admin | Get career role detail |
| PATCH | `/api/admin/career-roles/:id` | Admin | Update career role |
| DELETE | `/api/admin/career-roles/:id` | Admin | Delete career role (cascades) |
| **Pathway Builder** ||||
| PUT | `/api/admin/career-roles/:roleId/pathway` | Admin | Replace entire pathway |
| **Career Opportunities** ||||
| POST | `/api/admin/career-roles/:roleId/opportunities` | Admin | Create opportunity |
| PATCH | `/api/admin/opportunities/:id` | Admin | Update opportunity |
| DELETE | `/api/admin/opportunities/:id` | Admin | Delete opportunity |
| **Learner Pathways** ||||
| GET | `/api/career-pathways` | Public | List all career roles |
| GET | `/api/career-pathways/:slug` | Public | Get pathway detail with certs & opportunities |
