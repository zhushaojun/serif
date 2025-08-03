-- 修复中文字符的 slug 生成
-- 目的：支持中文字符的博客标题生成正确的 slug
-- 变更：更新 generate_slug 函数以正确处理中文字符

-- 创建改进的生成 slug 函数，支持中文字符
create or replace function public.generate_slug(input_title text)
returns text as $$
declare
    base_slug text;
    final_slug text;
    counter integer := 0;
begin
    -- 将标题转换为 slug，保留中文字符
    base_slug := lower(regexp_replace(
        regexp_replace(
            -- 只移除特殊符号，保留字母、数字、中文、空格和短横线
            regexp_replace(input_title, '[^\p{L}\p{N}\s\-]', '', 'g'),
            '\s+', '-', 'g'
        ),
        '-+', '-', 'g'
    ));
    
    -- 移除首尾的短横线
    base_slug := trim(both '-' from base_slug);
    
    -- 如果生成的slug为空，使用时间戳作为默认值
    if base_slug = '' or base_slug is null then
        base_slug := 'blog-' || extract(epoch from now())::text;
    end if;
    
    final_slug := base_slug;
    
    -- 检查是否已存在，如果存在则添加数字后缀
    while exists(select 1 from public.blogs where slug = final_slug) loop
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
    end loop;
    
    return final_slug;
end;
$$ language plpgsql;

comment on function public.generate_slug(text) is '根据标题生成唯一的 URL slug，支持中文字符';

-- 为现有的博客重新生成 slug（如果它们的 slug 为空或有问题）
do $$
declare
    blog_record record;
    new_slug text;
begin
    -- 遍历所有可能有问题的博客
    for blog_record in 
        select id, title, slug from public.blogs 
        where slug is null or slug = '' or length(slug) < 3
    loop
        -- 重新生成 slug
        new_slug := public.generate_slug(blog_record.title);
        
        -- 更新博客的 slug
        update public.blogs 
        set slug = new_slug 
        where id = blog_record.id;
        
        raise notice '更新博客 ID % 的 slug 为: %', blog_record.id, new_slug;
    end loop;
end;
$$; 