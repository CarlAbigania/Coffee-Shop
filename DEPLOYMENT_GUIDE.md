# Coffee Shop React - Deployment Guide

## Option 1: Vercel (Frontend) + Railway (Backend + Database)

### Frontend Deployment (Vercel)

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub account

2. **Deploy Frontend**
   - Click "New Project"
   - Import your GitHub repository
   - Set Build Command: `npm run build`
   - Set Output Directory: `dist`
   - Deploy!

3. **Get Frontend URL**
   - Note your Vercel URL (e.g., `https://your-app.vercel.app`)

### Backend Deployment (Railway)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub account

2. **Deploy Backend**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Set Root Directory: `backend`
   - Add Environment Variables:
     ```
     DB_HOST=your-railway-mysql-host
     DB_USER=your-railway-mysql-user
     DB_PASS=your-railway-mysql-password
     DB_NAME=your-railway-mysql-database
     ```

3. **Setup Database**
   - In Railway dashboard, add MySQL service
   - Copy connection details to environment variables
   - Run the SQL schema from `backend/database_schema.sql`

4. **Update Frontend API URLs**
   - Update your React app to use Railway backend URL
   - Redeploy frontend

## Option 2: All-in-One (InfinityFree)

1. **Create Account**
   - Go to [infinityfree.net](https://infinityfree.net)
   - Sign up for free account

2. **Upload Files**
   - Use File Manager or FTP
   - Upload `dist` folder contents to `public_html`
   - Upload `backend` folder to `public_html/backend`

3. **Setup Database**
   - Create MySQL database in control panel
   - Import `backend/database_schema.sql`
   - Update `backend/includes/db.php` with database credentials

4. **Update API URLs**
   - Change frontend API calls to use your domain
   - Example: `https://yourdomain.infinityfreeapp.com/backend/api/`

## Environment Variables for Production

Create these environment variables in your hosting platform:

```
DB_HOST=your-database-host
DB_USER=your-database-username
DB_PASS=your-database-password
DB_NAME=your-database-name
```

## Testing Your Deployment

1. **Frontend**: Visit your domain
2. **Backend**: Test API endpoints
   - Contact form: `POST /backend/api/index.php?route=contact`
   - Newsletter: `POST /backend/api/index.php?route=subscribe`
   - Orders: `POST /backend/api/index.php?route=order`

## Troubleshooting

- **CORS Issues**: Check `.htaccess` file in backend folder
- **Database Connection**: Verify environment variables
- **File Permissions**: Ensure PHP files are executable
- **API URLs**: Make sure frontend points to correct backend URL
