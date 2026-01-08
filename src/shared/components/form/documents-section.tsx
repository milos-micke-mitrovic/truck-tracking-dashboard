import { useTranslation } from 'react-i18next'
import { Plus, Trash2 } from 'lucide-react'
import type { FieldArrayWithId, FieldValues, Control } from 'react-hook-form'
import { Button, Select, FileUpload, DatePicker } from '@/shared/ui'
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form'
import { FormSection } from './form-section'

export type DocumentFormValue = {
  id?: number
  type: string
  tempFileName?: string
  originalFileName?: string
  expirationDate?: string
  isNew?: boolean
}

type DocumentsSectionProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  fields: FieldArrayWithId<FieldValues, 'documents', 'id'>[]
  /** Function to get current document value at index */
  getDocument: (index: number) => DocumentFormValue | undefined
  documentTypeOptions: { value: string; label: string }[]
  onFileUpload: (index: number, file: File) => Promise<void>
  onRemove: (index: number) => void
  onAdd: () => void
  onFileClear: (index: number) => void
  isUploading?: boolean
  /** Translation namespace for labels (defaults to 'admin') */
  namespace?: string
}

export function DocumentsSection({
  control,
  fields,
  getDocument,
  documentTypeOptions,
  onFileUpload,
  onRemove,
  onAdd,
  onFileClear,
  isUploading,
  namespace = 'admin',
}: DocumentsSectionProps) {
  const { t } = useTranslation(namespace)

  return (
    <FormSection title={t('documents.title')}>
      <div className="space-y-3">
        {fields.map((field, index) => {
          const doc = getDocument(index)
          return (
            <div
              key={field.id}
              className="flex flex-col gap-3 rounded-md border p-3 md:flex-row md:flex-wrap"
            >
              <FormField
                control={control}
                name={`documents.${index}.type`}
                rules={{ required: t('validation.required') }}
                render={({ field: typeField }) => (
                  <FormItem className="md:flex-1 md:min-w-[180px]">
                    <FormLabel required>{t('documents.type')}</FormLabel>
                    <Select
                      options={documentTypeOptions}
                      value={typeField.value as string}
                      onChange={typeField.onChange}
                      placeholder={t('documents.selectType')}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`documents.${index}.expirationDate`}
                render={({ field: expField }) => (
                  <FormItem className="md:flex-1 md:min-w-[180px]">
                    <FormLabel>{t('documents.expirationDate')}</FormLabel>
                    <DatePicker
                      value={expField.value as string}
                      onChange={expField.onChange}
                      placeholder={t('documents.selectDate')}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-end gap-2 w-full order-last">
                <FormItem className="flex-1">
                  <FormLabel>{t('documents.uploadPdf')}</FormLabel>
                  <FileUpload
                    variant="compact"
                    fileName={doc?.originalFileName}
                    onFileSelect={(files) =>
                      onFileUpload(index, Array.isArray(files) ? files[0] : files)
                    }
                    onRemove={() => onFileClear(index)}
                    loading={isUploading}
                    accept=".pdf,.jpg,.jpeg,.png"
                    buttonLabel={t('documents.uploadPdf')}
                  />
                </FormItem>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mb-0.5 h-9 w-9 shrink-0"
                  onClick={() => onRemove(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          )
        })}
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus className="mr-1 h-4 w-4" />
          {t('documents.addDocument')}
        </Button>
      </div>
    </FormSection>
  )
}
