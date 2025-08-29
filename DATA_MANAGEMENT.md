# 📊 Data Management Guide

This guide explains how to manage data between your development and production environments.

## 🎯 **Three Approaches to Data Synchronization**

### **Option 1: Production Seeding (Recommended)**
Create fresh demo data directly in production using predefined templates.

**Pros:**
- ✅ Clean, consistent data structure
- ✅ No risk of importing development artifacts
- ✅ Easy to repeat and maintain
- ✅ No data corruption issues

**Cons:**
- ❌ Doesn't preserve development customizations
- ❌ Requires manual setup

**Usage:**
```bash
npm run seed:production
```

### **Option 2: Data Export/Import**
Export data from development and import to production.

**Pros:**
- ✅ Preserves all development data and customizations
- ✅ Exact copy of development environment
- ✅ Good for testing with real data

**Cons:**
- ❌ Risk of importing development artifacts
- ❌ Potential data corruption
- ❌ More complex process

**Usage:**
```bash
# Export development data
npm run export:data

# Review data-export.json
# Edit the script to enable import
# Run import to production
```

### **Option 3: Built-in Demo Data (Current)**
Your app already has demo data built into the frontend components.

**Pros:**
- ✅ Always available, no setup needed
- ✅ Works offline
- ✅ Consistent across environments
- ✅ No database dependency

**Cons:**
- ❌ Limited to predefined demo data
- ❌ No real database persistence
- ❌ Can't be customized

## 🚀 **Recommended Workflow**

### **For Initial Production Setup:**
1. **Use Production Seeding** - Creates clean, professional demo data
2. **Test thoroughly** - Ensure all features work with production data
3. **Customize as needed** - Add real client data through the UI

### **For Ongoing Development:**
1. **Keep development data separate** - Don't sync development artifacts
2. **Use production seeding** - When you need fresh demo data
3. **Test with production data** - Ensure features work with real data structure

## 📋 **Available Scripts**

```bash
# Development seeding
npm run seed:demo              # Create demo user account
npm run seed:workspace         # Create demo workspace with data
npm run create:demo            # Create additional demo accounts

# Production seeding
npm run seed:production        # Seed production database with demo data

# Data export/import
npm run export:data            # Export development data to JSON
```

## 🔧 **Production Seeding Details**

The production seeding script creates:

- **1 Demo Workspace** - "Demo Financial Advisory"
- **3 Demo Clients** - John Smith, Sarah Johnson, Mike Davis
- **3 Loan Types** - FHA, Conventional, Commercial
- **2 Loan Files** - Active and pending loans
- **2 Demo Tasks** - Sample workflow tasks

## ⚠️ **Important Notes**

### **Environment Variables**
Make sure your production environment is properly configured:
```bash
# Check env.production file
VITE_CONVEX_URL=https://sensible-ermine-539.convex.cloud
CONVEX_DEPLOYMENT=prod:sensible-ermine-539
```

### **Convex Deployment**
Ensure your Convex functions are deployed to production:
```bash
npx convex deploy
```

### **Data Safety**
- **Never** import development data directly to production without review
- **Always** backup production data before major changes
- **Test** seeding scripts in development first

## 🎯 **Quick Start for Production**

1. **Deploy Convex functions:**
   ```bash
   npx convex deploy
   ```

2. **Seed production database:**
   ```bash
   npm run seed:production
   ```

3. **Test demo account:**
   - Visit your production site
   - Click "Sign In" → "Try Demo Account"
   - Verify navigation to dashboard works
   - Check that demo data is visible

4. **Customize as needed:**
   - Add real client data through the UI
   - Configure loan types for your business
   - Set up workflows and tasks

## 🔍 **Troubleshooting**

### **Demo Account Not Working:**
- Check browser console for errors
- Verify Convex deployment is successful
- Ensure environment variables are set correctly

### **No Data Visible:**
- Run production seeding script
- Check Convex dashboard for data
- Verify authentication is working

### **Build Errors:**
- Check for TypeScript errors
- Verify all dependencies are installed
- Ensure Convex schema is up to date

## 📞 **Need Help?**

If you encounter issues:
1. Check the browser console for error messages
2. Verify your Convex deployment status
3. Review environment variable configuration
4. Test with the built-in demo data first
