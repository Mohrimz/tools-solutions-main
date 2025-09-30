# Image Upload Configuration Guide

## Problem
When deploying to hosting platforms like Vercel, Netlify, or similar services, the local file system approach fails because:
- Production environments have read-only file systems
- Serverless functions can't persist files
- Files uploaded during runtime are lost when functions restart

## Solution: Cloudinary Integration

### 1. Set up Cloudinary Account
1. Go to [Cloudinary](https://cloudinary.com) and create a free account
2. In your dashboard, note down:
   - **Cloud Name**
   - **API Key** 
   - **API Secret**

### 2. Environment Variables
Create a `.env.local` file in your project root:

```bash
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. Deploy Environment Variables
Add the same environment variables to your hosting platform:

**Vercel:**
- Go to your project dashboard
- Settings → Environment Variables
- Add all three Cloudinary variables

**Netlify:**
- Go to your site dashboard
- Site settings → Environment variables
- Add all three Cloudinary variables

### 4. Features Included
- ✅ Cloud storage (works in production)
- ✅ Automatic image optimization
- ✅ Format conversion (WebP, AVIF)
- ✅ Quality optimization
- ✅ CDN delivery worldwide
- ✅ Image transformations available
- ✅ Free tier: 25GB storage, 25GB bandwidth

### 5. Backward Compatibility
The code is designed to handle both:
- New Cloudinary URLs (https://res.cloudinary.com/...)
- Existing local paths (/images/products/...)

### 6. Alternative Solutions

#### Option A: AWS S3 + CloudFront
```bash
npm install @aws-sdk/client-s3
```

#### Option B: Vercel Blob Storage
```bash
npm install @vercel/blob
```

#### Option C: Supabase Storage
```bash
npm install @supabase/supabase-js
```

### 7. Testing
1. Test locally with your Cloudinary credentials
2. Deploy to staging/production
3. Try uploading an image in the admin panel
4. Verify the image appears correctly

### 8. Troubleshooting

**Upload fails with "Invalid credentials":**
- Check your environment variables are set correctly
- Verify Cloud Name, API Key, and API Secret

**Images don't display:**
- Check the browser console for CORS errors
- Verify the Cloudinary URL structure

**Build errors:**
- Make sure you've installed the cloudinary package
- Check import paths are correct

For more help, check the [Cloudinary Next.js documentation](https://cloudinary.com/documentation/nextjs_integration).