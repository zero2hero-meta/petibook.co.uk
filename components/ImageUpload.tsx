'use client'

import { useState } from 'react'
import { Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void
  title: string
  preview?: string
  error?: string
}

export default function ImageUpload({
  onImageSelect,
  title,
  preview,
  error
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleFile(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const preview = e.target?.result as string
      onImageSelect(file, preview)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">{title}</h3>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all ${
          isDragging
            ? 'border-purple-500 bg-purple-50'
            : preview
            ? 'border-green-500 bg-green-50'
            : error
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 bg-gray-50 hover:border-purple-400 hover:bg-purple-50'
        }`}
      >
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/heic"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          id={`upload-${title}`}
        />

        {preview ? (
          <div className="text-center">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 mx-auto rounded-lg mb-4 object-cover"
            />
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Photo looks great!</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Click or drag to change</p>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 font-medium mb-2">
              Drop your photo here or click to browse
            </p>
            <p className="text-sm text-gray-500">
              JPG, PNG, HEIC accepted. Max 10MB.
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-center justify-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      {preview && (
        <div className="mt-3 text-sm text-gray-600 space-y-1">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Clear photo quality</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Good lighting detected</span>
          </div>
        </div>
      )}
    </div>
  )
}
