-- 为博客表添加分类字段
-- 目的：支持博客分类功能，匹配卡片设计要求
-- 涉及：添加 category 字段，创建索引

-- 添加分类字段
alter table public.blogs add column if not exists category text default 'design';

-- 添加字段注释
comment on column public.blogs.category is '博客分类，如：design, tech, lifestyle 等';

-- 为分类字段创建索引以提高查询性能
create index if not exists blogs_category_idx on public.blogs(category);

-- 更新现有博客的默认分类
update public.blogs set category = 'design' where category is null; 