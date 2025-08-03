-- 简化slug生成，因为现在使用ID进行路由
-- slug仅用于SEO目的，不用于路由

-- 创建简化的slug生成函数
create or replace function public.generate_slug(input_title text)
returns text as $$
declare
    base_slug text;
    final_slug text;
    counter integer := 0;
begin
    -- 基本slug生成：小写 + 替换空格为连字符
    base_slug := lower(
        regexp_replace(
            regexp_replace(input_title, '[^a-zA-Z0-9\s\-]', '', 'g'),
            '\s+', '-', 'g'
        )
    );
    
    -- 清理首尾的连字符
    base_slug := trim(both '-' from base_slug);
    
    -- 如果为空或太短，使用简单的fallback
    if base_slug = '' or base_slug is null or length(base_slug) < 2 then
        base_slug := 'blog-post';
    end if;
    
    -- 确保slug唯一性（虽然不用于路由，但保持数据库完整性）
    final_slug := base_slug;
    
    while exists (select 1 from public.blogs where slug = final_slug) loop
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
    end loop;
    
    return final_slug;
end;
$$ language plpgsql; 