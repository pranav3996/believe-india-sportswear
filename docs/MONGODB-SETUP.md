# MongoDB Migration - Setup Guide

## 🎉 Migration Complete!

Your Believe India Sportswear website has been successfully migrated from Firebase to MongoDB, NextAuth.js, and Cloudinary.

---

## 📋 What You Need to Set Up

### 1. MongoDB Atlas (Free Tier)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for a free account
3. Click **"Build a Database"**
4. Choose **"M0 FREE"** option
5. Select **Cloud Provider** (AWS/Google Cloud/Azure) and **Region** (choose closest to you)
6. Click **"Create"**
7. Create a database user:
   - Username: `admin` (or your choice)
   - Password: (save this securely)
   - Click **"Create User"**
8. Add IP Access:
   - Click **"Add IP Address"**
   - Choose **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Click **"Confirm"**
9. Click **"Connect"** button
10. Choose **"Drivers"**, select **Node.js**
11. Copy the connection string (looks like: `mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/`)
12. Replace `<password>` with your actual password
13. Add `/believe-india` at the end: `mongodb+srv://admin:password@cluster0.xxxxx.mongodb.net/believe-india`

---

### 2. Cloudinary (Free Tier)

1. Go to https://cloudinary.com/users/register/free
2. Sign up for a free account
3. After signup, go to **Dashboard**
4. Copy these values:
   - **Cloud Name** (e.g., `dxxxxx`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (click "eye" icon to reveal)

---

### 3. Create Admin User

You need to manually create your first admin user in MongoDB:

1. Go to MongoDB Atlas Dashboard
2. Click **"Browse Collections"**
3. Select database **"believe-india"**
4. Click **"+ CREATE DATABASE"** if it doesn't exist
   - Database name: `believe-india`
   - Collection name: `users`
5. Click on **"users"** collection
6. Click **"INSERT DOCUMENT"**
7. Switch to **"{}** (JSON) view"
8. Paste this (replace email and generate a password hash):

```json
{
  "email": "abdtest1999@gmail.com",
  "password": "$2a$10$YourHashedPasswordHere",
  "name": "Admin",
  "role": "admin",
  "createdAt": {"$date": "2024-01-01T00:00:00.000Z"}
}
```

**To generate the password hash:**

Run this Node.js script:

```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-password-here', 10));"
```

Replace `'your-password-here'` with your desired password. Copy the output and paste it in the JSON above.

---

### 4. Configure Environment Variables

Create/update `.env.local` file in your project root:

```env
# MongoDB
MONGODB_URI=mongodb+srv://admin:password@cluster0.xxxxx.mongodb.net/believe-india

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-min-32-characters-long

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxxxxx
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-api-secret
```

**To generate NEXTAUTH_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🚀 Installation & Running

### Install Dependencies

```bash
cd d:\Tech\BelieveIndia
npm install
```

### Run Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

---

## ✅ Testing Checklist

1. **Homepage** - Visit http://localhost:3000
   - Hero section should load
   - About section should display (even if empty)
   - Gallery section should display (even if empty)

2. **Admin Login** - Visit http://localhost:3000/admin/login
   - Login with your email and password
   - Should redirect to `/admin` dashboard

3. **Company Details**
   - Go to "Company Details" tab
   - Fill in all fields
   - Click "Save Changes"
   - Refresh homepage - changes should appear

4. **Image Upload**
   - Go to "Upload Images" tab
   - Select an image
   - Add a title
   - Click "Upload Image"
   - Wait for success message
   - Visit homepage - image should appear in gallery

---

## 🔧 Troubleshooting

### "MongoDB connection failed"
- Check your `MONGODB_URI` is correct
- Ensure IP `0.0.0.0/0` is whitelisted in MongoDB Atlas
- Verify database user credentials

### "Invalid password" or "No user found"
- Make sure admin user is created in MongoDB
- Verify the hashed password is correct
- Check email matches exactly

### "Cloudinary upload failed"
- Verify all Cloudinary credentials in `.env.local`
- Check Cloud Name, API Key, and API Secret

### "Unauthorized" errors
- Logout and login again
- Clear browser cookies
- Check NEXTAUTH_SECRET is set

---

## 📊 MongoDB Collections Structure

Your database will have 3 collections:

### `users`
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  name: String,
  role: String,
  createdAt: Date
}
```

### `abouts` (singular document)
```javascript
{
  _id: ObjectId,
  companyName: String,
  description: String,
  ownerImage: String,
  instagram: String,
  instagramLink: String,
  location: String,
  contactPerson: String,
  phone: String,
  updatedAt: Date
}
```

### `galleries`
```javascript
{
  _id: ObjectId,
  title: String,
  url: String,
  publicId: String,
  timestamp: Date
}
```

---

## 🎯 Free Tier Limits

### MongoDB Atlas (FREE Forever)
- ✅ 512MB storage
- ✅ Shared RAM
- ✅ No expiration

### Cloudinary (FREE Forever)
- ✅ 25GB storage
- ✅ 25GB bandwidth/month
- ✅ No credit card required

### NextAuth.js
- ✅ Free & open-source
- ✅ Unlimited users

---

## 🔐 Security Notes

1. **Never commit `.env.local`** - It's already gitignored
2. **Use strong passwords** for MongoDB and admin account
3. **Change NEXTAUTH_SECRET** in production
4. **For production**, restrict MongoDB IP whitelist to your server's IP

---

## 📦 Deployment (Vercel)

1. Push code to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `NEXTAUTH_URL` (set to your domain)
   - `NEXTAUTH_SECRET`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
4. Deploy!

---

**Need Help?** Review the error messages in your console for specific issues!
