# Supabase Storage Setup for Profile Photos

This guide explains how to set up Supabase Storage to handle profile photo uploads.

## 1. Create Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to Storage > Buckets
3. Click "Create bucket"
4. Name: `user-uploads`
5. Make it **Public** (so profile photos can be displayed)
6. Click "Create bucket"

## 2. Set Up Storage Policies

Navigate to Storage > Policies and create these policies for the `user-uploads` bucket:

### Policy 1: Allow users to upload their own files
```sql
CREATE POLICY "Users can upload their own files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'user-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### Policy 2: Allow users to view all files (for public profile photos)
```sql
CREATE POLICY "Anyone can view files" ON storage.objects
FOR SELECT USING (bucket_id = 'user-uploads');
```

### Policy 3: Allow users to update their own files
```sql
CREATE POLICY "Users can update their own files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'user-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### Policy 4: Allow users to delete their own files
```sql
CREATE POLICY "Users can delete their own files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'user-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## 3. File Organization

Files are organized by user ID:
```
user-uploads/
├── profile-photos/
│   ├── user-id-1-timestamp.jpg
│   ├── user-id-2-timestamp.png
│   └── ...
```

## 4. File Constraints & Optimization

- **Max file size**: 10MB (before compression)
- **Allowed types**: JPEG, PNG, GIF, WebP
- **Automatic compression**: Images are compressed to max 1MB and 800px resolution
- **Output format**: All images converted to JPEG for optimal compression
- **Naming**: `{user-id}-{timestamp}.jpg`

### Image Processing Pipeline:
1. **Validation**: Check file type and size (max 10MB)
2. **Compression**: Reduce to max 1MB, 800px width/height
3. **Format conversion**: Convert to JPEG for better compression
4. **Upload**: Store optimized image in Supabase Storage
5. **Cleanup**: Remove old profile photo if exists

## 5. Environment Variables

Make sure these are set in your `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 6. Testing

1. Log in to your app
2. Go to Profile page
3. Click "Edit Profile"
4. Hover over profile photo and click camera icon
5. Select an image file
6. Verify it uploads and displays correctly

## 7. Production Considerations

For production, consider:
- **CDN**: Use Supabase's built-in CDN ✅ (Already enabled)
- **Image optimization**: Implement image resizing/compression ✅ (Already implemented)
- **Cleanup**: Remove old profile photos when users upload new ones ✅ (Already implemented)
- **Backup**: Regular storage backups
- **Monitoring**: Track storage usage and costs
- **Progressive loading**: Add loading states and blur placeholders
- **Error recovery**: Implement retry mechanisms for failed uploads

## Troubleshooting

### Common Issues:

1. **Upload fails**: Check storage policies and bucket permissions
2. **Images don't display**: Verify bucket is public and policies allow SELECT
3. **Authentication errors**: Ensure user is logged in and has valid session
4. **File size errors**: Check file size limits (10MB before compression, 1MB after)
5. **Compression errors**: Try a different image format or smaller original file
6. **Slow uploads**: Check internet connection; compression reduces upload time significantly 