import { useRef, useState } from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Trash2, Upload, FileCheck, Plus, File, Eye } from 'lucide-react'
import {
  IconButton,
  Input,
  Select,
  TabsContent,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  BodySmall,
} from '@/shared/ui'
import { Checkbox } from '@/shared/ui/primitives'
import { FormField } from '@/shared/ui/form'
import { Label } from '@/shared/ui/primitives/label'
import type { CompanyFormValues } from '../../../types'
import { COMPANY_DOCUMENT_TYPES } from '../../../constants'

type DeleteConfirmState = {
  open: boolean
  index: number | null
  hasFile: boolean
  removeWholeDocument: boolean
}

export function DocumentsTab() {
  const { t } = useTranslation('admin')
  const { control, watch, setValue } = useFormContext<CompanyFormValues>()
  const fileInputRefs = useRef<Map<number, HTMLInputElement>>(new Map())
  const fileDataRefs = useRef<Map<number, File>>(new Map())

  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmState>({
    open: false,
    index: null,
    hasFile: false,
    removeWholeDocument: false,
  })

  const {
    fields: documentFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'documents',
  })

  const documents = watch('documents')

  const documentTypeOptions = COMPANY_DOCUMENT_TYPES.map((type) => ({
    value: type,
    label: t(`companyDialog.documentTypes.${type}`),
  }))

  const handleUploadClick = (index: number) => {
    const input = fileInputRefs.current.get(index)
    if (input) {
      input.click()
    }
  }

  const handleFileChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setValue(`documents.${index}.fileName`, file.name)
      fileDataRefs.current.set(index, file)
    }
    event.target.value = ''
  }

  const handleViewPdf = (index: number) => {
    const file = fileDataRefs.current.get(index)
    if (file) {
      const url = URL.createObjectURL(file)
      window.open(url, '_blank')
    }
  }

  const handleDeleteClick = (index: number) => {
    const hasFile = !!documents?.[index]?.fileName
    setDeleteConfirm({
      open: true,
      index,
      hasFile,
      removeWholeDocument: !hasFile,
    })
  }

  const handleDeleteConfirm = () => {
    if (deleteConfirm.index === null) return

    if (deleteConfirm.removeWholeDocument || !deleteConfirm.hasFile) {
      remove(deleteConfirm.index)
      fileDataRefs.current.delete(deleteConfirm.index)
    } else {
      setValue(`documents.${deleteConfirm.index}.fileName`, null)
      fileDataRefs.current.delete(deleteConfirm.index)
    }

    setDeleteConfirm({
      open: false,
      index: null,
      hasFile: false,
      removeWholeDocument: false,
    })
  }

  const handleDeleteCancel = () => {
    setDeleteConfirm({
      open: false,
      index: null,
      hasFile: false,
      removeWholeDocument: false,
    })
  }

  const handleAddRow = () => {
    append({
      id: `doc-${Date.now()}`,
      type: '',
      fileName: null,
      expirationDate: null,
    })
  }

  return (
    <>
      <TabsContent value="documents" className="mt-0">
        <div className="overflow-hidden rounded-lg border">
          <Table className="min-w-[480px]">
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-muted/50">
                <TableHead className="w-10" />
                <TableHead>{t('companyDialog.documentType')}</TableHead>
                <TableHead>{t('companyDialog.expirationDate')}</TableHead>
                <TableHead className="w-20">
                  {t('companyDialog.actions')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documentFields.map((field, index) => {
                const hasFile = !!documents?.[index]?.fileName
                return (
                  <TableRow key={field.id}>
                    <TableCell>
                      {hasFile ? (
                        <FileCheck className="h-4 w-4 text-green-600" />
                      ) : (
                        <File className="text-muted-foreground h-4 w-4" />
                      )}
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`documents.${index}.type`}
                        render={({ field: typeField }) => (
                          <Select
                            options={documentTypeOptions}
                            value={typeField.value}
                            onChange={typeField.onChange}
                            placeholder={t('companyDialog.selectDocumentType')}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`documents.${index}.expirationDate`}
                        render={({ field: dateField }) => (
                          <Input
                            type="date"
                            value={dateField.value || ''}
                            onChange={dateField.onChange}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <input
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          ref={(el) => {
                            if (el) fileInputRefs.current.set(index, el)
                          }}
                          onChange={(e) => handleFileChange(index, e)}
                        />
                        {hasFile ? (
                          <IconButton
                            type="button"
                            variant="ghost"
                            size="sm"
                            icon={<Eye />}
                            onClick={() => handleViewPdf(index)}
                            aria-label={t('companyDialog.viewPdf')}
                          />
                        ) : (
                          <IconButton
                            type="button"
                            variant="ghost"
                            size="sm"
                            icon={<Upload />}
                            onClick={() => handleUploadClick(index)}
                            aria-label={t('companyDialog.uploadPdf')}
                          />
                        )}
                        <IconButton
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          icon={<Trash2 />}
                          onClick={() => handleDeleteClick(index)}
                          aria-label={t('companyDialog.delete')}
                          disabled={documentFields.length === 1 && !hasFile}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3"
          prefixIcon={<Plus />}
          onClick={handleAddRow}
        >
          {t('companyDialog.addDocument')}
        </Button>
      </TabsContent>

      <Dialog
        open={deleteConfirm.open}
        onOpenChange={(open) => !open && handleDeleteCancel()}
      >
        <DialogContent showCloseButton={false} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('companyDialog.deleteConfirmTitle')}</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <BodySmall className="text-muted-foreground">
              {t('companyDialog.deleteConfirmMessage')}
            </BodySmall>
            {deleteConfirm.hasFile && (
              <div className="mt-4 flex items-center gap-2">
                <Checkbox
                  id="remove-whole-document"
                  checked={deleteConfirm.removeWholeDocument}
                  onCheckedChange={(checked) =>
                    setDeleteConfirm((prev) => ({
                      ...prev,
                      removeWholeDocument: !!checked,
                    }))
                  }
                />
                <Label
                  htmlFor="remove-whole-document"
                  className="cursor-pointer text-sm"
                >
                  {t('companyDialog.removeWholeDocument')}
                </Label>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDeleteCancel}
            >
              {t('dialogs.cancel')}
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDeleteConfirm}
            >
              {t('companyDialog.confirmDelete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
