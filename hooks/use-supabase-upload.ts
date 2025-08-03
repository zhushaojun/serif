'use client'

import { useState, useRef, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { createClient } from '@/lib/client'
// 类型定义
interface FileWithErrors extends File {
  preview?: string
  errors: Array<{ message: string }>
}

interface UseSupabaseUploadReturn {
  files: FileWithErrors[]
  setFiles: (files: FileWithErrors[]) => void
  errors: Array<{ name: string; message: string }>
  successes: string[]
  uploadedPaths: Array<{ fileName: string; filePath: string }>
  loading: boolean
  isSuccess: boolean
  isDragActive: boolean
  isDragReject: boolean
  maxFiles: number
  maxFileSize: number
  onUpload: () => void
  inputRef: React.RefObject<HTMLInputElement | null>
  getRootProps: () => Record<string, any>
  getInputProps: () => Record<string, any>
}

interface UseSupabaseUploadOptions {
  bucketName: string
  path?: string
  allowedMimeTypes?: string[]
  maxFiles?: number
  maxFileSize?: number
}

export type { UseSupabaseUploadReturn, FileWithErrors, UseSupabaseUploadOptions }

export function useSupabaseUpload({
  bucketName,
  path = '',
  allowedMimeTypes = ['image/*'],
  maxFiles = 1,
  maxFileSize = 5 * 1024 * 1024, // 5MB
}: UseSupabaseUploadOptions): UseSupabaseUploadReturn {
  const [files, setFiles] = useState<FileWithErrors[]>([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Array<{ name: string; message: string }>>([])
  const [successes, setSuccesses] = useState<string[]>([])
  const [uploadedPaths, setUploadedPaths] = useState<Array<{ fileName: string; filePath: string }>>([])
  const [isSuccess, setIsSuccess] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const supabase = createClient()

  const validateFile = (file: File): Array<{ message: string }> => {
    const fileErrors: Array<{ message: string }> = []

    // 检查文件大小
    if (file.size > maxFileSize) {
      fileErrors.push({
        message: `File is larger than ${maxFileSize} bytes`
      })
    }

    // 检查文件类型
    const isValidType = allowedMimeTypes.some(type => {
      if (type.endsWith('/*')) {
        const baseType = type.slice(0, -2)
        return file.type.startsWith(baseType)
      }
      return file.type === type
    })

    if (!isValidType && allowedMimeTypes.length > 0) {
      fileErrors.push({
        message: `File type ${file.type} is not allowed`
      })
    }

    return fileErrors
  }

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // 处理接受的文件
    const processedFiles: FileWithErrors[] = acceptedFiles.map(file => {
      const fileWithPreview = Object.assign(file, {
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        errors: validateFile(file)
      })
      return fileWithPreview
    })

    // 处理被拒绝的文件
    const rejectedProcessedFiles: FileWithErrors[] = rejectedFiles.map(({ file, errors }) => {
      return Object.assign(file, {
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        errors: errors.map((error: any) => ({ message: error.message }))
      })
    })

    const allFiles = [...processedFiles, ...rejectedProcessedFiles]
    
    // 限制文件数量
    const filesToSet = allFiles.slice(0, maxFiles)
         setFiles(filesToSet)
     setIsSuccess(false)
     setErrors([])
     setSuccesses([])
     setUploadedPaths([])
  }, [maxFiles, allowedMimeTypes, maxFileSize])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    maxFiles,
    maxSize: maxFileSize,
    accept: allowedMimeTypes.reduce((acc, type) => {
      acc[type] = []
      return acc
    }, {} as Record<string, string[]>),
    multiple: maxFiles > 1
  })

  const generateFilePath = async (file: File): Promise<string> => {
    // 获取当前用户
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id || 'anonymous'
    
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const extension = file.name.split('.').pop()
    const filename = `${timestamp}_${randomStr}.${extension}`
    
    // 使用用户ID作为路径前缀
    const userPath = `${userId}/${filename}`
    
    if (path) {
      return `${path}/${userPath}`
    }
    return userPath
  }

  const onUpload = async () => {
    if (files.length === 0 || files.some(file => file.errors.length > 0)) {
      return
    }

         setLoading(true)
     setErrors([])
     setSuccesses([])
     setUploadedPaths([])

              try {
       const uploadPromises = files.map(async (file) => {
         const filePath = await generateFilePath(file)
         
         const { data, error } = await supabase.storage
           .from(bucketName)
           .upload(filePath, file, {
             cacheControl: '3600',
             upsert: false
           })

         if (error) {
           throw new Error(`上传 ${file.name} 失败: ${error.message}`)
         }

         return { fileName: file.name, filePath: data.path }
       })

       const results = await Promise.allSettled(uploadPromises)
       
       const uploadErrors: Array<{ name: string; message: string }> = []
       const uploadSuccesses: string[] = []
       const uploadedPathsResult: Array<{ fileName: string; filePath: string }> = []

       results.forEach((result, index) => {
         const fileName = files[index].name
         
         if (result.status === 'fulfilled') {
           uploadSuccesses.push(fileName)
           uploadedPathsResult.push(result.value)
         } else {
           uploadErrors.push({
             name: fileName,
             message: result.reason.message || '上传失败'
           })
         }
       })

       setErrors(uploadErrors)
       setSuccesses(uploadSuccesses)
       setUploadedPaths(uploadedPathsResult)
       setIsSuccess(uploadErrors.length === 0)
      
    } catch (error) {
      console.error('Upload error:', error)
      setErrors([{ name: '通用错误', message: '上传过程中发生错误' }])
    } finally {
      setLoading(false)
    }
  }

     return {
     files,
     setFiles,
     errors,
     successes,
     uploadedPaths,
     loading,
     isSuccess,
     isDragActive,
     isDragReject,
     maxFiles,
     maxFileSize,
     onUpload,
     inputRef,
     getRootProps,
     getInputProps
   }
}
