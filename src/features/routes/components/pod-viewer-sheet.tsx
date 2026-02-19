import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Download, FileText, ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Button,
  Spinner,
  Badge,
  BodySmall,
  Caption,
} from '@/shared/ui'
import { useRoutePods, downloadPodDocument } from '../api'
import type { PodSubmissionResponse, PodDocumentResponse } from '../types'

type PodViewerSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  routeId: string | null
}

function getFileIcon(contentType: string | null) {
  if (contentType?.startsWith('image/')) return ImageIcon
  return FileText
}

function formatFileSize(bytes: number | null) {
  if (bytes == null) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function getStatusVariant(status: string) {
  switch (status) {
    case 'APPROVED':
      return 'default' as const
    case 'REJECTED':
      return 'destructive' as const
    default:
      return 'secondary' as const
  }
}

export function PodViewerSheet({ open, onOpenChange, routeId }: PodViewerSheetProps) {
  const { t } = useTranslation('routes')
  const { data: pods, isLoading } = useRoutePods(open ? routeId : null)
  const [downloadingId, setDownloadingId] = useState<number | null>(null)

  const handleDownload = async (doc: PodDocumentResponse) => {
    setDownloadingId(doc.id)
    try {
      await downloadPodDocument(doc.id)
    } catch {
      toast.error(t('pod.downloadError'))
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent size="lg" className="flex flex-col overflow-hidden p-0">
        <SheetHeader className="border-b px-6 py-3">
          <SheetTitle>{t('pod.title')}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : !pods || pods.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <FileText className="mb-2 h-10 w-10" />
              <BodySmall>{t('pod.empty')}</BodySmall>
            </div>
          ) : (
            <div className="space-y-6">
              {pods.map((pod: PodSubmissionResponse, index: number) => (
                <div key={pod.id} className="rounded-lg border bg-card">
                  <div className="flex items-center justify-between border-b px-4 py-3">
                    <div className="flex items-center gap-2">
                      <BodySmall className="font-medium">
                        {t('pod.stop')} #{index + 1}
                      </BodySmall>
                      <Badge variant={getStatusVariant(pod.status)}>
                        {pod.status}
                      </Badge>
                    </div>
                    <Caption className="text-muted-foreground">
                      {formatDate(pod.submittedAt)}
                    </Caption>
                  </div>

                  {(pod.driverName || pod.notes) && (
                    <div className="border-b px-4 py-2">
                      {pod.driverName && (
                        <Caption className="text-muted-foreground">
                          {t('pod.driver')}: {pod.driverName}
                        </Caption>
                      )}
                      {pod.notes && (
                        <Caption className="mt-1 block text-muted-foreground">
                          {t('pod.notes')}: {pod.notes}
                        </Caption>
                      )}
                    </div>
                  )}

                  <div className="divide-y">
                    {pod.documents.map((doc: PodDocumentResponse) => {
                      const Icon = getFileIcon(doc.contentType)
                      return (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between px-4 py-2"
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            <Icon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                            <BodySmall className="truncate">
                              {doc.originalFileName}
                            </BodySmall>
                            {doc.fileSize != null && (
                              <Caption className="flex-shrink-0 text-muted-foreground">
                                {formatFileSize(doc.fileSize)}
                              </Caption>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(doc)}
                            loading={downloadingId === doc.id}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
