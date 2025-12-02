import { useFormContext, useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Trash2, Upload, Eye } from 'lucide-react'
import {
  IconButton,
  Input,
  TabsContent,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/shared/ui'
import { FormField } from '@/shared/ui/form'
import { BodySmall } from '@/shared/ui/typography'
import type { CompanyFormValues } from '../../../types'

export function DocumentsTab() {
  const { t } = useTranslation('admin')
  const { control } = useFormContext<CompanyFormValues>()

  const { fields: documentFields } = useFieldArray({
    control,
    name: 'documents',
  })

  return (
    <TabsContent value="documents" className="mt-0">
      <div className="border rounded-lg overflow-hidden">
        <Table className="min-w-[480px]">
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-muted/50">
              <TableHead>{t('companyDialog.documentType')}</TableHead>
              <TableHead>{t('companyDialog.expirationDate')}</TableHead>
              <TableHead>{t('companyDialog.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documentFields.map((field, index) => (
              <TableRow key={field.id}>
                <TableCell>
                  <BodySmall>{t(`companyDialog.documentTypes.${field.type}`)}</BodySmall>
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
                    <IconButton
                      type="button"
                      variant="ghost"
                      size="sm"
                      icon={<Eye />}
                      aria-label="View document"
                    />
                    <IconButton
                      type="button"
                      variant="ghost"
                      size="sm"
                      icon={<Upload />}
                      aria-label="Upload document"
                    />
                    <IconButton
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      icon={<Trash2 />}
                      aria-label="Delete document"
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TabsContent>
  )
}
