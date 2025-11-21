# Believe India Sportswear - MongoDB Version

A modern, fully-responsive website for "Believe India Sportswear" using **Next.js 14**, **MongoDB**, **NextAuth.js**, and **Cloudinary**.

## 🌟 Features

### Public Website
- **Hero Section**: Eye-catching gradient design with stats
- **About Section**: Company information dynamically loaded from MongoDB
- **Gallery**: Real-time image gallery with lightbox modal
- **Responsive Design**: Mobile, tablet, and desktop optimized

### Admin Dashboard
- **Secure Authentication**: NextAuth.js with credentials provider
- **Image Upload**: Cloudinary integration with progress tracking
- **Company Management**: Update all company details in real-time
- **Protected Routes**: Session-based authentication

### Tech Stack
- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Database**: MongoDB Atlas (Free tier)
- **Authentication**: NextAuth.js
- **Image Hosting**: Cloudinary (Free tier)
- **Deployment**: Vercel (Free tier)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- MongoDB Atlas account (free)
- Cloudinary account (free)

### 1. Clone & Install

```bash
cd d:\Tech\BelieveIndia
npm install
```

### 2. Set Up Services

Follow the detailed guide in **[MONGODB-SETUP.md](./MONGODB-SETUP.md)** to set up:
- MongoDB Atlas database
- Cloudinary account
- Admin user creation

### 3. Configure Environment

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```env
MONGODB_URI=mongodb+srv://...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### 4. Create Admin User

**Option A: Using Script**
```bash
node scripts/create-admin.js
```

**Option B: Manual MongoDB Insert**
See [MONGODB-SETUP.md](./MONGODB-SETUP.md) for instructions.

### 5. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

---

## 📁 Project Structure

```
BelieveIndia/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth endpoints
│   │   ├── about/                # Company details API
│   │   ├── gallery/              # Gallery CRUD API
│   │   └── upload/               # Cloudinary upload
│   ├── admin/
│   │   ├── login/               # Admin login page
│   │   └── page.js              # Admin dashboard
│   ├── globals.css              # Global styles
│   ├── layout.js                # Root layout
│   ├── page.js                  # Homepage
│   └── providers.js             # SessionProvider
├── components/
│   ├── admin/
│   │   ├── CompanyForm.jsx      # Company details form
│   │   └── ImageUpload.jsx      # Image upload component
│   ├── About.jsx                # About section
│   ├── Footer.jsx               # Footer
│   ├── Gallery.jsx              # Gallery section
│   ├── Header.jsx               # Header
│   └── Hero.jsx                 # Hero section
├── lib/
│   └── db.js                    # MongoDB connection
├── models/
│   ├── About.js                 # About model
│   ├── Gallery.js               # Gallery model
│   └── User.js                  # User model
├── scripts/
│   ├── create-admin.js          # Create admin script
│   └── generate-hash.js         # Password hash generator
└── Configuration files...
```

---

## 🔐 Authentication

- **Admin Login**: `/admin/login`
- **Protected Routes**: `/admin/*`
- **Session Duration**: 30 days
- **Provider**: Credentials (email/password)

---

## 🎨 Customization

### Update Company Details
1. Login to admin dashboard
2. Go to "Company Details" tab
3. Update fields and save

### Add Gallery Images
1. Login to admin dashboard
2. Go to "Upload Images" tab
3. Select image, add title, upload

### Styling
- Edit `app/globals.css` for custom CSS
- Modify `tailwind.config.js` for theme changes

---

## 📦 API Routes

### Public Routes
- `GET /api/about` - Fetch company details
- `GET /api/gallery` - Fetch all images

### Protected Routes (Auth Required)
- `POST /api/about` - Update company details
- `POST /api/gallery` - Add new image
- `DELETE /api/gallery/[id]` - Delete image
- `POST /api/upload` - Upload to Cloudinary

---

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

See [MONGODB-SETUP.md](./MONGODB-SETUP.md) for detailed deployment instructions.

---

## 🆓 Free Tier Limits

All services have generous free tiers:

| Service | Free Tier |
|---------|-----------|
| MongoDB Atlas | 512MB storage |
| Cloudinary | 25GB storage, 25GB bandwidth/month |
| Vercel | 100GB bandwidth/month |
| NextAuth.js | Unlimited (open-source) |

---

## 🛠️ Troubleshooting

See [MONGODB-SETUP.md](./MONGODB-SETUP.md) for comprehensive troubleshooting guide.

---

## 📝 License

MIT License - Feel free to use for your projects!

---

**Built with ❤️ for Believe India Sportswear**
