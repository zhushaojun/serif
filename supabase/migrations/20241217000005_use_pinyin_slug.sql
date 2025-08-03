-- 使用更智能的slug生成，处理中文标题
-- 注意：这个函数生成的是简化版本，客户端会使用pinyin库生成更智能的slug

-- 创建简单的slug生成函数，用作fallback
create or replace function public.generate_slug_simple(input_title text)
returns text as $$
declare
    base_slug text;
    final_slug text;
    counter integer := 0;
begin
    -- 基本处理：移除特殊字符，转小写
    base_slug := lower(
        regexp_replace(
            regexp_replace(input_title, '[^a-zA-Z0-9\u4e00-\u9fff\s\-]', '', 'g'),
            '\s+', '-', 'g'
        )
    );
    
    -- 清理首尾的连字符
    base_slug := trim(both '-' from base_slug);
    
    -- 如果包含中文或为空，使用时间戳
    if base_slug = '' or base_slug is null or base_slug ~ '[\u4e00-\u9fff]' then
        base_slug := 'blog-' || extract(epoch from now())::bigint::text;
    end if;
    
    -- 确保slug唯一性
    final_slug := base_slug;
    
    while exists (select 1 from public.blogs where slug = final_slug) loop
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
    end loop;
    
    return final_slug;
end;
$$ language plpgsql;

-- 更新触发器函数，使用新的生成函数
create or replace function public.set_blog_slug()
returns trigger as $$
begin
    -- 如果slug为空或者标题发生了变化，则重新生成slug
    if new.slug is null or new.slug = '' or (tg_op = 'UPDATE' and old.title != new.title) then
        new.slug := generate_slug_simple(new.title);
    end if;
    
    return new;
end;
$$ language plpgsql;

-- 注释：在实际应用中，建议在客户端使用pinyin库生成更智能的slug
-- 然后通过API传递给数据库，这个函数只作为fallback使用 