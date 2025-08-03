'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/server'
import type { Chat, CreateChatRequest, ChatWithLastMessage, Message } from '@/types/chats'

export async function createChat(data: CreateChatRequest): Promise<{ success: boolean; chat?: Chat; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('Auth error in createChat:', authError)
      return { success: false, error: 'Unauthorized' }
    }

    console.log('Creating chat for user:', user.id)

    const { data: chat, error } = await supabase
      .from('chats')
      .insert({
        user_id: user.id,
        title: data.title || 'New Chat',
        model: data.model || 'gpt-3.5-turbo',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating chat:', error)
      return { success: false, error: 'Failed to create chat' }
    }

    console.log('Chat created successfully:', chat)
    revalidatePath('/chat')
    return { success: true, chat }
  } catch (error) {
    console.error('Error creating chat:', error)
    return { success: false, error: 'Failed to create chat' }
  }
}

export async function deleteChat(chatId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { error } = await supabase
      .from('chats')
      .delete()
      .eq('id', chatId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting chat:', error)
      return { success: false, error: 'Failed to delete chat' }
    }

    revalidatePath('/chat')
    return { success: true }
  } catch (error) {
    console.error('Error deleting chat:', error)
    return { success: false, error: 'Failed to delete chat' }
  }
}

export async function getChats(): Promise<ChatWithLastMessage[]> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return []
    }

    console.log('Fetching chats for user:', user.id)

    // 获取用户的所有聊天
    const { data: chats, error } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching chats:', error)
      return []
    }

    console.log('Fetched chats:', chats?.length || 0, 'chats')

    if (error) {
      console.error('Error fetching chats:', error)
      return []
    }

    // 为每个聊天获取最后一条消息
    const processedChats: ChatWithLastMessage[] = []
    
    for (const chat of chats || []) {
      const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chat.id)
        .order('created_at', { ascending: false })
        .limit(1)

      const lastMessage = messages && messages.length > 0 ? messages[0] : null

      processedChats.push({
        ...chat,
        last_message: lastMessage,
        message_count: 0, // 可以优化为实际计数
      })
    }

    return processedChats
  } catch (error) {
    console.error('Error fetching chats:', error)
    return []
  }
}

export async function getChatMessages(chatId: string): Promise<Message[]> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return []
    }

    console.log('Getting messages for chatId:', chatId, 'user:', user.id)

    // 验证用户是否拥有该聊天
    const { data: chat, error: chatError } = await supabase
      .from('chats')
      .select('user_id')
      .eq('id', chatId)
      .single()

    console.log('Chat lookup result:', { chat, chatError })

    if (chatError || !chat || chat.user_id !== user.id) {
      console.error('Chat access denied:', { chatError, chat, userId: user.id })
      throw new Error('Chat not found or unauthorized')
    }

    // 获取聊天消息
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching messages:', error)
      return []
    }

    return messages || []
  } catch (error) {
    console.error('Error fetching messages:', error)
    return []
  }
}

export async function updateChatTitle(chatId: string, title: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { error } = await supabase
      .from('chats')
      .update({ title })
      .eq('id', chatId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error updating chat title:', error)
      return { success: false, error: 'Failed to update chat title' }
    }

    revalidatePath('/chat')
    return { success: true }
  } catch (error) {
    console.error('Error updating chat title:', error)
    return { success: false, error: 'Failed to update chat title' }
  }
} 