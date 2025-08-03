-- 创建博客系统的数据库迁移
-- 目的：建立完整的博客内容管理系统
-- 涉及：blogs 表、RLS 策略、索引和触发器

-- 创建 blogs 表
create table if not exists public.blogs (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    slug text not null unique,
    subtitle text,
    image text, -- 博客封面图片 URL
    content text not null, -- TipTap 富文本内容
    author text not null,
    author_id uuid references auth.users(id) on delete cascade not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

comment on table public.blogs is '博客文章表，存储所有博客内容和元数据';
comment on column public.blogs.title is '博客标题';
comment on column public.blogs.slug is '博客 URL slug，由标题自动生成';
comment on column public.blogs.subtitle is '博客副标题（可选）';
comment on column public.blogs.image is '博客封面图片 URL';
comment on column public.blogs.content is 'TipTap 编辑器的富文本内容';
comment on column public.blogs.author is '作者名称';
comment on column public.blogs.author_id is '作者用户 ID，关联到 auth.users';

-- 为 blogs 表创建 updated_at 触发器
create trigger handle_blogs_updated_at
    before update on public.blogs
    for each row execute function public.handle_updated_at();

-- 启用 RLS
alter table public.blogs enable row level security;

-- 创建 RLS 策略：公开访问 - 所有人都可以查看已发布的博客
create policy "Blogs are viewable by everyone"
    on public.blogs
    for select
    to anon, authenticated
    using (true);

-- 创建 RLS 策略：认证用户可以插入自己的博客
create policy "Authenticated users can insert own blogs"
    on public.blogs
    for insert
    to authenticated
    with check (auth.uid() = author_id);

-- 创建 RLS 策略：用户只能更新自己的博客
create policy "Users can update own blogs"
    on public.blogs
    for update
    to authenticated
    using (auth.uid() = author_id)
    with check (auth.uid() = author_id);

-- 创建 RLS 策略：用户只能删除自己的博客
create policy "Users can delete own blogs"
    on public.blogs
    for delete
    to authenticated
    using (auth.uid() = author_id);

-- 创建索引以提高查询性能
create index if not exists blogs_author_id_idx on public.blogs(author_id);
create index if not exists blogs_slug_idx on public.blogs(slug);
create index if not exists blogs_created_at_idx on public.blogs(created_at desc);
create index if not exists blogs_title_idx on public.blogs using gin(to_tsvector('english', title));
create index if not exists blogs_content_idx on public.blogs using gin(to_tsvector('english', content));

-- 创建生成 slug 的函数
create or replace function public.generate_slug(input_title text)
returns text as $$
declare
    base_slug text;
    final_slug text;
    counter integer := 0;
begin
    -- 将标题转换为 slug
    base_slug := lower(regexp_replace(
        regexp_replace(
            regexp_replace(input_title, '[^\w\s-]', '', 'g'),
            '\s+', '-', 'g'
        ),
        '-+', '-', 'g'
    ));
    
    -- 移除首尾的短横线
    base_slug := trim(both '-' from base_slug);
    
    final_slug := base_slug;
    
    -- 检查是否已存在，如果存在则添加数字后缀
    while exists(select 1 from public.blogs where slug = final_slug) loop
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
    end loop;
    
    return final_slug;
end;
$$ language plpgsql;

comment on function public.generate_slug(text) is '根据标题生成唯一的 URL slug';

-- 创建自动生成 slug 的触发器函数
create or replace function public.set_blog_slug()
returns trigger as $$
begin
    -- 只在插入或标题发生变化时生成新的 slug
    if (tg_op = 'INSERT') or (tg_op = 'UPDATE' and old.title != new.title) then
        new.slug := public.generate_slug(new.title);
    end if;
    return new;
end;
$$ language plpgsql;

-- 为 blogs 表创建 slug 生成触发器
create trigger set_blog_slug_trigger
    before insert or update on public.blogs
    for each row execute function public.set_blog_slug();

comment on trigger set_blog_slug_trigger on public.blogs is '在插入或更新博客时自动生成 slug'; 