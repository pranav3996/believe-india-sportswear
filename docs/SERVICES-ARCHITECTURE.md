# Services Architecture Documentation

## Overview

The Services section has been refactored into a **modular, data-driven architecture** that separates concerns and makes it easy to manage services without touching component code.

---

## File Structure

```
BelieveIndia/
├── data/
│   └── services.js                 # Centralized services data + helper functions
├── components/
│   └── ServiceCard.js              # Reusable service card component
└── app/
    └── services/
        └── page.js                 # Services page (now data-driven)
```

---

## How to Add/Edit/Remove Services

### ✅ Adding a New Service

1. Open `data/services.js`
2. Add a new object to the `servicesData` array:

```javascript
{
    id: 'new-service',              // Unique identifier (kebab-case)
    icon: '⚡',                      // Emoji or icon identifier
    title: 'Your Service Name',     // Display title
    description: 'Service description goes here',
    features: [                      // List of key features
        'Feature 1',
        'Feature 2',
        'Feature 3'
    ],
    category: 'support',            // Category for filtering
    featured: false,                // Set to true to highlight this service
    // image: '/images/services/new-service.jpg', // Optional image
}
```

3. Save the file - the UI will automatically update!

### ✏️ Editing an Existing Service

1. Open `data/services.js`
2. Find the service by its `id`
3. Update any field (title, description, features, etc.)
4. Save - changes appear instantly

### ❌ Removing a Service

1. Open `data/services.js`
2. Delete the entire service object from the array
3. Save - it will disappear from the UI

---

## Component Architecture

### 📦 ServiceCard Component

**Location:** `components/ServiceCard.js`

**Props:**
- `service` (object) - The service data object
- `variant` (string) - Card style: `'default'` | `'featured'` | `'compact'`
- `animate` (boolean) - Enable animations (default: `false`)

**Example Usage:**
```javascript
<ServiceCard 
    service={serviceData}
    variant="featured"
    animate={true}
/>
```

**Variants:**
- **default** - Standard white card with shadow
- **featured** - Includes a "POPULAR" badge and border
- **compact** - Smaller padding for dense layouts

---

## Data Structure Reference

### Service Object Schema

```javascript
{
    id: string,              // Required: Unique identifier
    title: string,           // Required: Service name
    description: string,     // Required: Service description
    icon: string,            // Required: Emoji or icon identifier
    features: string[],      // Required: Array of feature strings
    
    // Optional fields
    image?: string,          // Image path (e.g., '/images/services/service.jpg')
    category?: string,       // Category for filtering
    featured?: boolean,      // Highlight as featured service
}
```

---

## Helper Functions

The `data/services.js` file includes several helper functions:

### `getAllServices()`
Returns all services as an array.

```javascript
import { getAllServices } from '@/data/services';
const services = getAllServices();
```

### `getServiceById(id)`
Get a specific service by its ID.

```javascript
import { getServiceById } from '@/data/services';
const service = getServiceById('custom-design');
```

### `getFeaturedServices()`
Get only services marked as featured.

```javascript
import { getFeaturedServices } from '@/data/services';
const featured = getFeaturedServices();
```

### `getServicesByCategory(category)`
Filter services by category.

```javascript
import { getServicesByCategory } from '@/data/services';
const designServices = getServicesByCategory('design');
```

---

## Future Enhancements

### 🎨 Adding Animations

1. Install an animation library:
   ```bash
   npm install aos
   # or
   npm install framer-motion
   ```

2. In `app/services/page.js`, uncomment:
   ```javascript
   <ServiceCard 
       service={service}
       animate={true}  // ← Uncomment this
   />
   ```

3. In `components/ServiceCard.js`, integrate the animation library of your choice.

### 🖼️ Adding Service Images

1. Add images to `public/images/services/` directory:
   ```
   public/
   └── images/
       └── services/
           ├── custom-design.jpg
           ├── bulk-orders.jpg
           └── ...
   ```

2. In `data/services.js`, uncomment the image field:
   ```javascript
   {
       id: 'custom-design',
       // ... other fields
       image: '/images/services/custom-design.jpg', // ← Uncomment
   }
   ```

3. The ServiceCard component automatically handles image display!

### 🔌 Backend Integration (API)

To fetch services from a database instead of static data:

1. Create an API endpoint at `app/api/services/route.js`:
   ```javascript
   import { NextResponse } from 'next/server';
   import { getServicesFromDatabase } from '@/lib/database';

   export async function GET() {
       try {
           const services = await getServicesFromDatabase();
           return NextResponse.json(services);
       } catch (error) {
           return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
       }
   }
   ```

2. In `app/services/page.js`, make it async and use the API:
   ```javascript
   export default async function ServicesPage() {
       const response = await fetch('/api/services', { cache: 'no-store' });
       const services = await response.json();
       // ... rest of the code
   }
   ```

3. Uncomment the Suspense wrapper for loading states:
   ```javascript
   <Suspense fallback={<ServiceCardSkeleton />}>
       {/* services grid */}
   </Suspense>
   ```

### 🔍 Adding Service Categories/Filtering

1. Add a filter state in `app/services/page.js`:
   ```javascript
   const [selectedCategory, setSelectedCategory] = useState('all');
   const filteredServices = selectedCategory === 'all' 
       ? services 
       : getServicesByCategory(selectedCategory);
   ```

2. Add filter buttons above the grid:
   ```javascript
   <div className="flex gap-4 justify-center mb-8">
       <button onClick={() => setSelectedCategory('all')}>All</button>
       <button onClick={() => setSelectedCategory('design')}>Design</button>
       <button onClick={() => setSelectedCategory('ordering')}>Ordering</button>
       {/* ... more categories */}
   </div>
   ```

---

## Mobile Responsiveness

The grid layout is fully responsive:
- **Mobile** (< 768px): 1 column
- **Tablet** (768px - 1024px): 2 columns  
- **Desktop** (> 1024px): 3 columns

Tailwind classes used:
```
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```

---

## SEO Best Practices

To add page-specific metadata, uncomment the metadata export in `app/services/page.js`:

```javascript
export const metadata = {
    title: 'Our Services | Believe India Sportswear',
    description: 'Custom sportswear design, bulk orders, quality assurance...',
    keywords: ['sportswear services', 'custom design', 'bulk orders'],
};
```

---

## Benefits of This Architecture

✅ **Separation of Concerns** - Data, UI, and logic are separate  
✅ **Easy Maintenance** - Update services without touching components  
✅ **Type Safety Ready** - Can easily add TypeScript interfaces  
✅ **Scalable** - Ready for backend integration  
✅ **Reusable** - ServiceCard can be used anywhere  
✅ **DRY Principle** - Don't Repeat Yourself  
✅ **Production Ready** - Clean, commented, professional code  

---

## Quick Reference

| Task | File to Edit | What to Change |
|------|--------------|----------------|
| Add/Edit/Remove Service | `data/services.js` | Modify `servicesData` array |
| Change Card Appearance | `components/ServiceCard.js` | Update styles/structure |
| Change Page Layout | `app/services/page.js` | Update grid/sections |
| Add Animation | `components/ServiceCard.js` | Integrate animation library |
| Add Backend API | `app/api/services/route.js` | Create new file |

---

## Questions?

For issues or questions, refer to:
- Next.js Documentation: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- React Documentation: https://react.dev
