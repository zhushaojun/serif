-- 添加模型字段到聊天表
ALTER TABLE chats 
ADD COLUMN model TEXT NOT NULL DEFAULT 'gpt-3.5-turbo';

-- 更新现有聊天记录的模型字段
UPDATE chats 
SET model = 'gpt-3.5-turbo' 
WHERE model IS NULL;

-- 添加模型字段的注释
COMMENT ON COLUMN chats.model IS 'AI model used for this chat (e.g., gpt-3.5-turbo, qwen3-235b-a22b-2507:free, glm-4.5-flash, ernie-4.5-vl-28b-a3b)'; 