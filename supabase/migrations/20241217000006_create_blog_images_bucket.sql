-- 创建博客图片存储桶
-- 目的：为博客文章提供图片存储功能
-- 涉及：Storage bucket、RLS 策略和访问权限

-- 创建博客图片存储桶
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-images',
  'blog-images',
  true,
  5242880, -- 5MB 文件大小限制
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- 注意：无法为 storage.buckets 添加注释，因为这是系统表

-- 创建存储策略：所有人都可以查看博客图片
create policy "Blog images are publicly viewable"
  on storage.objects for select
  to public
  using (bucket_id = 'blog-images');

-- 创建存储策略：认证用户可以上传博客图片
create policy "Authenticated users can upload blog images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'blog-images' 
    and auth.role() = 'authenticated'
  );

-- 创建存储策略：用户可以更新自己上传的博客图片
create policy "Users can update own blog images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'blog-images' 
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'blog-images' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- 创建存储策略：用户可以删除自己上传的博客图片
create policy "Users can delete own blog images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'blog-images' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- 创建辅助函数：生成图片文件路径
create or replace function public.get_blog_image_path(user_id uuid, filename text)
returns text as $$
begin
  return user_id::text || '/' || filename;
end;
$$ language plpgsql;

comment on function public.get_blog_image_path(uuid, text) is '生成博客图片的存储路径，格式为 user_id/filename';

-- 创建辅助函数：获取图片的公共 URL
create or replace function public.get_blog_image_url(file_path text)
returns text as $$
declare
  base_url text;
begin
  -- 获取 Supabase 项目的基础 URL
  -- 在实际环境中，这应该从环境变量或配置中获取
  base_url := current_setting('app.supabase_url', true);
  
  if base_url is null then
    base_url := 'https://your-project-id.supabase.co';
  end if;
  
  return base_url || '/storage/v1/object/public/blog-images/' || file_path;
end;
$$ language plpgsql;

comment on function public.get_blog_image_url(text) is '根据文件路径生成博客图片的公共访问 URL'; 