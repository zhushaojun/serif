'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Button } from '@/components/ui/button'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Heading1,
  Heading2,
} from 'lucide-react'

interface SimpleEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export function SimpleEditor({ content, onChange, placeholder = '开始编写你的博客...', className }: SimpleEditorProps) {
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
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-gray max-w-none focus:outline-none min-h-[300px] p-4 border-x',
        placeholder,
      },
    },
    immediatelyRender: false,
  })

  if (!editor) {
    return (
      <div className={className}>
        <div className="border rounded-lg p-4 min-h-[300px] bg-gray-50 animate-pulse">
          加载编辑器中...
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* 工具栏 */}
      <div className="border rounded-t-lg border-b-0 p-2 bg-gray-50 flex items-center gap-1">
        <Button
          type="button"
          variant={editor.isActive('bold') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="h-8 w-8 p-0"
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant={editor.isActive('italic') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="h-8 w-8 p-0"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Button
          type="button"
          variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className="h-8 w-8 p-0"
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className="h-8 w-8 p-0"
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Button
          type="button"
          variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="h-8 w-8 p-0"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="h-8 w-8 p-0"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className="h-8 w-8 p-0"
        >
          <Quote className="h-4 w-4" />
        </Button>
      </div>

      {/* 编辑器内容 */}
      <EditorContent editor={editor} />

      {/* 底部提示 */}
      <div className="border-x border-b rounded-b-lg p-2 bg-gray-50 text-sm text-gray-500">
        使用工具栏格式化文本 | 按 Ctrl+B 加粗 | 按 Ctrl+I 斜体
      </div>
    </div>
  )
} 