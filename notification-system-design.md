# Notification System Design

## Stage 1: REST API Design

### Get All Notifications

GET /notifications

Response:

```json
{
  "notifications": []
}
```

### Get Notification By ID

GET /notifications/{id}

### Create Notification

POST /notifications

### Mark Notification As Read

PUT /notifications/{id}/read

### Delete Notification

DELETE /notifications/{id}

Status Codes:

- 200 OK
- 201 Created
- 400 Bad Request
- 401 Unauthorized
- 404 Not Found
- 500 Internal Server Error

---

## Stage 2: Database Design

### Students Table

| Column | Type |
|----------|----------|
| student_id | UUID |
| name | VARCHAR |
| email | VARCHAR |

### Notifications Table

| Column | Type |
|----------|----------|
| notification_id | UUID |
| type | VARCHAR |
| message | TEXT |
| created_at | TIMESTAMP |

### Notification Reads Table

| Column | Type |
|----------|----------|
| id | UUID |
| student_id | UUID |
| notification_id | UUID |
| is_read | BOOLEAN |

Indexes:

```sql
CREATE INDEX idx_notifications
ON notifications(notification_id);
```

---

## Stage 3: Query Optimization

Original Query:

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt DESC;
```

Problem:

- Full table scans on large datasets
- Slow sorting

Solution:

```sql
CREATE INDEX idx_notifications_read
ON notifications(studentID, isRead, createdAt DESC);
```

Additional Query:

```sql
SELECT *
FROM notifications
WHERE type='Placement'
AND createdAt >= NOW() - INTERVAL '7 days';
```

---

## Stage 4: Performance Improvements

### Caching

Use Redis to store frequently accessed notifications.

### Pagination

```http
GET /notifications?page=1&limit=20
```

### Read Replicas

Use read replicas to reduce database load.

### Background Processing

Use queue workers for notification delivery.

---

## Stage 5: Scalable Architecture

Current Approach:

```text
API
 ↓
Database
 ↓
Send Notifications
```

Improved Approach:

```text
API
 ↓
Message Queue
 ↓
Worker Services
 ↓
Email Service
 ↓
Push Notification Service
```

Benefits:

- Better scalability
- Faster response times
- Fault tolerance
- Asynchronous processing