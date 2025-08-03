'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/extension-bubble-menu'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Link2,
  Unlink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCallback } from 'react'

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export function TiptapEditor({ content, onChange, placeholder = '开始编写你的博客...', className }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
      }),
      TextStyle,
      Color,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-gray max-w-none focus:outline-none min-h-[300px] p-4 border rounded-lg',
      },
    },
    immediatelyRender: false,
  })

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href
    const url = window.prompt('请输入链接地址:', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div className={className}>
      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <div className="flex items-center gap-1 p-2 bg-white border rounded-lg shadow-lg">
          <Button
            variant={editor.isActive('bold') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className="h-8 w-8 p-0"
          >
            <Bold className="h-4 w-4" />
          </Button>
          
          <Button
            variant={editor.isActive('italic') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className="h-8 w-8 p-0"
          >
            <Italic className="h-4 w-4" />
          </Button>

          <Button
            variant={editor.isActive('code') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className="h-8 w-8 p-0"
          >
            <Code2 className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <Button
            variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className="h-8 w-8 p-0"
          >
            <Heading1 className="h-4 w-4" />
          </Button>

          <Button
            variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className="h-8 w-8 p-0"
          >
            <Heading2 className="h-4 w-4" />
          </Button>

          <Button
            variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className="h-8 w-8 p-0"
          >
            <Heading3 className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <Button
            variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
          </Button>

          <Button
            variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className="h-8 w-8 p-0"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>

          <Button
            variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className="h-8 w-8 p-0"
          >
            <Quote className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <Button
            variant={editor.isActive('link') ? 'default' : 'ghost'}
            size="sm"
            onClick={setLink}
            className="h-8 w-8 p-0"
          >
            <Link2 className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().unsetLink().run()}
            disabled={!editor.isActive('link')}
            className="h-8 w-8 p-0"
          >
            <Unlink className="h-4 w-4" />
          </Button>
        </div>
      </BubbleMenu>

      <EditorContent editor={editor} />

      {/* 工具栏 */}
      <div className="flex items-center gap-2 p-2 border-t bg-gray-50 rounded-b-lg">
        <div className="text-sm text-gray-500">
          选择文本显示格式化选项 | 按 Ctrl+B 加粗 | 按 Ctrl+I 斜体
        </div>
      </div>
    </div>
  )
} 