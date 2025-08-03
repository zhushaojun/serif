'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { CheckCircle, File, Upload, X } from 'lucide-react'
import { createContext, type PropsWithChildren, useCallback, useContext } from 'react'
import type { UseSupabaseUploadReturn, FileWithErrors } from '@/hooks/use-supabase-upload'

export const formatBytes = (
  bytes: number,
  decimals = 2,
  size?: 'bytes' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB' | 'EB' | 'ZB' | 'YB'
) => {
  const k = 1000
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  if (bytes === 0 || bytes === undefined) return size !== undefined ? `0 ${size}` : '0 bytes'
  const i = size !== undefined ? sizes.indexOf(size) : Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// 类型已从 hooks/use-supabase-upload.ts 导入

type DropzoneContextType = Omit<UseSupabaseUploadReturn, 'getRootProps' | 'getInputProps'>

const DropzoneContext = createContext<DropzoneContextType | undefined>(undefined)

const useDropzoneContext = () => {
  const context = useContext(DropzoneContext)

  if (!context) {
    throw new Error('useDropzoneContext must be used within a Dropzone')
  }

  return context
}

type DropzoneProps = UseSupabaseUploadReturn & {
  className?: string
}

const Dropzone = ({ 
  className,
  children,
  getRootProps,
  getInputProps,
  ...restProps
}: PropsWithChildren<DropzoneProps>) => {
  const isSuccess = restProps.isSuccess
  const isActive = restProps.isDragActive
  const isInvalid =
    (restProps.isDragActive && restProps.isDragReject) ||
    (restProps.errors.length > 0 && !restProps.isSuccess) ||
    restProps.files.some((file) => file.errors.length !== 0)

  return (
    <DropzoneContext.Provider value={{ ...restProps }}>
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-gray-300 rounded-lg p-6 text-center bg-card transition-colors duration-300 text-foreground',
          className,
          isSuccess ? 'border-solid' : 'border-dashed',
          isActive && 'border-primary bg-primary/10',
          isInvalid && 'border-destructive bg-destructive/10'
        )}
      >
        <input {...getInputProps()} />
        {children}
      </div>
    </DropzoneContext.Provider>
  )
}

const DropzoneEmptyState = ({ className }: { className?: string }) => {
  const { maxFiles, maxFileSize, inputRef, isSuccess } = useDropzoneContext()

  if (isSuccess) {
    return null
  }

  return (
    <div className={cn('flex flex-col items-center gap-y-2', className)}>
      <Upload size={20} className="text-muted-foreground" />
      <p className="text-sm">
        上传{!!maxFiles && maxFiles > 1 ? ` ${maxFiles}` : ''} 个文件
        {!maxFiles || maxFiles > 1 ? '' : ''}
      </p>
      <div className="flex flex-col items-center gap-y-1">
        <p className="text-xs text-muted-foreground">
          拖拽文件到此处或{' '}
          <a
            onClick={() => inputRef.current?.click()}
            className="underline cursor-pointer transition hover:text-foreground"
          >
            选择{maxFiles === 1 ? `文件` : '文件'}上传
          </a>
        </p>
        {maxFileSize !== Number.POSITIVE_INFINITY && (
          <p className="text-xs text-muted-foreground">
            最大文件大小: {formatBytes(maxFileSize, 2)}
          </p>
        )}
      </div>
    </div>
  )
}

const DropzoneContent = ({ className }: { className?: string }) => {
  const { 
    files,
    setFiles,
    loading,
    successes,
    maxFileSize,
    maxFiles,
    isSuccess,
  } = useDropzoneContext()

  const exceedMaxFiles = files.length > maxFiles

  const handleRemoveFile = useCallback(
    (fileName: string) => {
      setFiles(files.filter((file) => file.name !== fileName))
    },
    [files, setFiles]
  )

  if (isSuccess) {
    return (
      <div className={cn('flex flex-row items-center gap-x-2 justify-center', className)}>
        <CheckCircle size={16} className="text-primary" />
        <p className="text-primary text-sm">
          成功上传 {files.length} 个文件{files.length > 1 ? '' : ''}
        </p>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col', className)}>
      {files.map((file, idx) => {
        const isSuccessfullyUploaded = !!successes.find((e) => e === file.name)

        return (
          <div
            key={`${file.name}-${idx}`}
            className="flex items-center gap-x-4 border-b py-2 first:mt-4 last:mb-4"
          >
            {file.type.startsWith('image/') ? (
              <div className="h-10 w-10 rounded border overflow-hidden shrink-0 bg-muted flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={file.preview} alt={file.name} className="object-cover" />
              </div>
            ) : (
              <div className="h-10 w-10 rounded border bg-muted flex items-center justify-center">
                <File size={18} />
              </div>
            )}

            <div className="shrink grow flex flex-col items-start truncate">
              <p title={file.name} className="text-sm truncate max-w-full">
                {file.name}
              </p>
              {file.errors.length > 0 ? (
                <p className="text-xs text-destructive">
                  {file.errors
                    .map((e) =>
                      e.message.startsWith('File is larger than')
                        ? `文件大小超过 ${formatBytes(maxFileSize, 2)} (当前: ${formatBytes(file.size, 2)})`
                        : e.message
                    )
                    .join(', ')}
                </p>
              ) : loading && !isSuccessfullyUploaded ? (
                <p className="text-xs text-muted-foreground">上传中...</p>
              ) : (
                <p className="text-xs text-muted-foreground">{formatBytes(file.size, 2)}</p>
              )}
            </div>
            <div className="flex items-center gap-x-2">
              {!isSuccessfullyUploaded && !loading && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveFile(file.name)}
                  className="h-6 w-6"
                >
                  <X size={14} />
                </Button>
              )}
            </div>
          </div>
        )
      })}
      {exceedMaxFiles && (
        <p className="text-xs text-destructive mt-2">
          已超过最大文件数量 ({maxFiles})。
        </p>
      )}
    </div>
  )
}

export { Dropzone, DropzoneContent, DropzoneEmptyState, useDropzoneContext }
export type { FileWithErrors, UseSupabaseUploadReturn } 