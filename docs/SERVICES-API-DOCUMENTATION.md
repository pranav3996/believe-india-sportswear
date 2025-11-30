# Services API Documentation

Complete REST API documentation for the Services endpoints.

---

## Base URL

```
http://localhost:3000/api/services
```

For production, replace with your actual domain.

---

## Endpoints Overview

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/services` | Get all services | No |
| POST | `/api/services` | Create new service | No* |
| GET | `/api/services/[id]` | Get service by ID | No |
| PUT | `/api/services/[id]` | Update service | No* |
| DELETE | `/api/services/[id]` | Delete service | No* |

*Auth can be added later using NextAuth (similar to products API)

---

## Response Format

All API responses follow this consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": { /* service object or array */ },
  "message": "Optional success message",
  "count": 6 // Only for GET all
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "details": ["Optional array of detailed errors"],
  "field": "fieldName" // If error is field-specific
}
```

---

## Data Model

### Service Object

```typescript
{
  _id: ObjectId,              // MongoDB ID
  title: string,              // Service name (required, 3-100 chars)
  description: string,        // Service description (required, 10-1000 chars)
  icon: string,               // Icon emoji or identifier (default: '⚡')
  image?: string,             // Image URL (optional)
  category: string,           // Category (enum, default: 'other')
  featured: boolean,          // Featured status (default: false)
  features: string[],         // Array of feature strings
  createdAt: Date,            // Created timestamp (auto)
  updatedAt: Date,            // Updated timestamp (auto)
}
```

**Valid Categories:**
- `design`
- `ordering`
- `customization`
- `quality`
- `delivery`
- `support`
- `other`

---

## API Endpoints

### 1. GET /api/services

Fetch all services with optional filtering.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | string | Filter by category (optional) |
| `featured` | boolean | Filter featured services: 'true' or 'false' (optional) |

**Examples:**

```javascript
// Get all services
fetch('/api/services')
  .then(res => res.json())
  .then(data => console.log(data));

// Get featured services only
fetch('/api/services?featured=true')
  .then(res => res.json())
  .then(data => console.log(data));

// Get services by category
fetch('/api/services?category=design')
  .then(res => res.json())
  .then(data => console.log(data));
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Custom Design",
      "description": "Create unique sportswear...",
      "icon": "🎨",
      "category": "design",
      "featured": true,
      "features": ["Logo placement", "Color customization"],
      "createdAt": "2025-11-29T12:00:00.000Z",
      "updatedAt": "2025-11-29T12:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### 2. POST /api/services

Create a new service.

**Request Body:**

```json
{
  "title": "New Service",
  "description": "Service description here",
  "icon": "🎯",
  "image": "https://example.com/image.jpg",
  "category": "design",
  "featured": true,
  "features": ["Feature 1", "Feature 2", "Feature 3"]
}
```

**Required Fields:**
- `title` (string, 3-100 characters)
- `description` (string, 10-1000 characters)

**Optional Fields:**
- `icon` (string, default: '⚡')
- `image` (string, URL)
- `category` (enum, default: 'other')
- `featured` (boolean, default: false)
- `features` (array of strings)

**JavaScript Example:**

```javascript
// Using fetch
async function createService(serviceData) {
  const response = await fetch('/api/services', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(serviceData),
  });

  const result = await response.json();
  return result;
}

// Usage
const newService = {
  title: 'Premium Packaging',
  description: 'Professional packaging for all orders with custom branding options.',
  icon: '📦',
  category: 'delivery',
  featured: false,
  features: [
    'Custom branded boxes',
    'Eco-friendly materials',
    'Gift wrapping available'
  ]
};

createService(newService)
  .then(data => console.log('Service created:', data))
  .catch(error => console.error('Error:', error));
```

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Premium Packaging",
    "description": "Professional packaging...",
    "icon": "📦",
    "category": "delivery",
    "featured": false,
    "features": ["Custom branded boxes", "Eco-friendly materials"],
    "createdAt": "2025-11-29T12:30:00.000Z",
    "updatedAt": "2025-11-29T12:30:00.000Z"
  },
  "message": "Service created successfully"
}
```

**Error Response (400):**

```json
{
  "success": false,
  "error": "Service title is required",
  "field": "title"
}
```

---

### 3. GET /api/services/[id]

Fetch a single service by ID.

**URL Parameters:**
- `id` - MongoDB ObjectId of the service

**JavaScript Example:**

```javascript
// Get specific service
const serviceId = '507f1f77bcf86cd799439011';

fetch(`/api/services/${serviceId}`)
  .then(res => res.json())
  .then(data => console.log(data));
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Custom Design",
    "description": "Create unique sportswear...",
    "icon": "🎨",
    "category": "design",
    "featured": true,
    "features": ["Logo placement", "Color customization"],
    "createdAt": "2025-11-29T12:00:00.000Z",
    "updatedAt": "2025-11-29T12:00:00.000Z"
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "error": "Service not found"
}
```

**Error Response (400 - Invalid ID):**

```json
{
  "success": false,
  "error": "Invalid service ID format"
}
```

---

### 4. PUT /api/services/[id]

Update an existing service. All fields are optional, but at least one must be provided.

**URL Parameters:**
- `id` - MongoDB ObjectId of the service

**Request Body (partial update):**

```json
{
  "title": "Updated Title",
  "featured": true,
  "features": ["New feature 1", "New feature 2"]
}
```

**JavaScript Example:**

```javascript
// Update service
async function updateService(id, updates) {
  const response = await fetch(`/api/services/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  const result = await response.json();
  return result;
}

// Usage
const serviceId = '507f1f77bcf86cd799439011';
const updates = {
  title: 'Custom Design Services',
  featured: true,
  features: [
    'Logo placement',
    'Color customization',
    'Name & number printing',
    '3D mockup previews'
  ]
};

updateService(serviceId, updates)
  .then(data => console.log('Updated:', data))
  .catch(error => console.error('Error:', error));
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Custom Design Services",
    "description": "Create unique sportswear...",
    "icon": "🎨",
    "category": "design",
    "featured": true,
    "features": ["Logo placement", "Color customization", "Name & number printing", "3D mockup previews"],
    "createdAt": "2025-11-29T12:00:00.000Z",
    "updatedAt": "2025-11-29T13:15:00.000Z"
  },
  "message": "Service updated successfully"
}
```

**Error Response (400 - No data):**

```json
{
  "success": false,
  "error": "No update data provided"
}
```

---

### 5. DELETE /api/services/[id]

Delete a service permanently.

**URL Parameters:**
- `id` - MongoDB ObjectId of the service

**JavaScript Example:**

```javascript
// Delete service
async function deleteService(id) {
  const response = await fetch(`/api/services/${id}`, {
    method: 'DELETE',
  });

  const result = await response.json();
  return result;
}

// Usage
const serviceId = '507f1f77bcf86cd799439011';

deleteService(serviceId)
  .then(data => console.log('Deleted:', data))
  .catch(error => console.error('Error:', error));
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Service deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Custom Design",
    "description": "Create unique sportswear...",
    // ... rest of deleted service data
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "error": "Service not found"
}
```

---

## Frontend Integration Examples

### React Component Example

```jsx
import { useState, useEffect } from 'react';

function ServicesManager() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all services
  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    try {
      setLoading(true);
      const response = await fetch('/api/services');
      const data = await response.json();
      
      if (data.success) {
        setServices(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  }

  // Create new service
  async function addService(newService) {
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newService),
      });

      const data = await response.json();
      
      if (data.success) {
        setServices([...services, data.data]);
        return data.data;
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error('Error creating service:', err);
      throw err;
    }
  }

  // Update service
  async function updateService(id, updates) {
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      
      if (data.success) {
        setServices(services.map(s => s._id === id ? data.data : s));
        return data.data;
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error('Error updating service:', err);
      throw err;
    }
  }

  // Delete service
  async function deleteService(id) {
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        setServices(services.filter(s => s._id !== id));
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error('Error deleting service:', err);
      throw err;
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {services.map(service => (
        <div key={service._id}>
          <h3>{service.icon} {service.title}</h3>
          <p>{service.description}</p>
          <button onClick={() => deleteService(service._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

---

## Error Codes

| Status Code | Meaning |
|-------------|---------|
| 200 | Success |
| 201 | Created successfully |
| 400 | Bad request (validation error) |
| 404 | Resource not found |
| 409 | Conflict (duplicate) |
| 500 | Server error |

---

## Testing the API

### Using cURL

```bash
# Get all services
curl http://localhost:3000/api/services

# Get featured services
curl http://localhost:3000/api/services?featured=true

# Create service
curl -X POST http://localhost:3000/api/services \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Service",
    "description": "This is a test service",
    "icon": "🧪",
    "category": "other",
    "featured": false
  }'

# Get single service (replace ID)
curl http://localhost:3000/api/services/507f1f77bcf86cd799439011

# Update service (replace ID)
curl -X PUT http://localhost:3000/api/services/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{"featured": true}'

# Delete service (replace ID)
curl -X DELETE http://localhost:3000/api/services/507f1f77bcf86cd799439011
```

### Using Postman

1. Import as new collection
2. Set base URL: `http://localhost:3000`
3. Create requests for each endpoint listed above

---

## Database Setup

Make sure MongoDB is running and you have set `MONGODB_URI` in `.env.local`:

```env
MONGODB_URI=mongodb://localhost:27017/believe-india
# or for MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/believe-india
```

---

## Seeding Sample Data

To populate the database with sample services:

```bash
# Add sample services
node scripts/seed-services.js

# Force re-seed (deletes existing data)
node scripts/seed-services.js --force
```

---

## Notes

- All timestamps are in ISO 8601 format
- IDs are MongoDB ObjectIds (24-character hex strings)
- The API uses connection pooling for better performance
- Frontend can cache services for better UX (they don't change often)
- Consider adding pagination for large datasets in the future
