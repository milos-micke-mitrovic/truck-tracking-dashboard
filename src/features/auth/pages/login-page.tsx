import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { TFunction } from 'i18next'
import { toast } from 'sonner'
import { Logo } from '@/shared/components'
import { useLogin, useAuth } from '@/features/auth'
import { Smartphone, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import {
  Button,
  H1,
  H2,
  H4,
  Body,
  BodySmall,
  Caption,
  Label,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Input,
} from '@/shared/ui'

const DRIVER_APP_URL = 'https://truck-drive.vercel.app'

const createLoginSchema = (t: TFunction) =>
  z.object({
    username: z.string().min(1, t('login.validation.usernameRequired')),
    password: z.string().min(1, t('login.validation.passwordRequired')),
  })

type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>

export function LoginPage() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const { login } = useAuth()
  const loginMutation = useLogin()
  const [showInstallGuide, setShowInstallGuide] = useState(false)

  const loginSchema = useMemo(() => createLoginSchema(t), [t])

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const response = await loginMutation.mutateAsync({
        username: values.username.trim(),
        password: values.password,
      })

      login(response.user, response.token)
      toast.success(`Welcome back, ${response.user.name}!`)
      navigate('/admin')
    } catch {
      toast.error(t('login.error.invalidCredentials'))
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Branding */}
      <div className="from-primary to-primary/80 hidden w-1/2 flex-col justify-between bg-gradient-to-br p-12 lg:flex">
        <div className="flex items-center gap-3">
          <div className="bg-primary-foreground/10 flex size-10 items-center justify-center rounded-lg">
            <Logo size="md" className="text-primary-foreground" />
          </div>
          <H4 className="text-primary-foreground">{t('common:app.name')}</H4>
        </div>

        <div className="space-y-6">
          <H2
            as="h2"
            className="text-primary-foreground text-4xl leading-tight"
          >
            {t('login.branding.headline')}
          </H2>
          <Body className="text-primary-foreground/80 max-w-md text-lg">
            {t('login.branding.description')}
          </Body>
        </div>

        <Caption className="text-primary-foreground/60">
          © {new Date().getFullYear()} Skyhard. All rights reserved.
        </Caption>
      </div>

      {/* Right side - Login form */}
      <div className="flex w-full flex-col justify-center px-8 py-8 lg:w-1/2 lg:px-16 lg:py-0">
        <div className="mx-auto w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="bg-primary flex size-10 items-center justify-center rounded-lg">
              <Logo size="md" className="text-primary-foreground" />
            </div>
            <H4>{t('common:app.name')}</H4>
          </div>

          <div className="mb-8">
            <H1 className="mb-2">{t('login.title')}</H1>
            <BodySmall color="muted">
              {t('login.subtitle')}
            </BodySmall>
          </div>

          <Form form={form} onSubmit={onSubmit} className="space-y-5">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('login.username')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('login.usernamePlaceholder')}
                      autoComplete="username"
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('login.password')}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={t('login.passwordPlaceholder')}
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              loading={loginMutation.isPending}
            >
              {loginMutation.isPending
                ? t('login.submitting')
                : t('login.submit')}
            </Button>
          </Form>

          {/* Demo credentials hint */}
          <div className="bg-muted/50 mt-8 rounded-lg border p-4">
            <Label color="muted" className="mb-2 block">
              {t('login.demo.title')}
            </Label>
            <div className="space-y-1">
              <BodySmall color="muted">
                <Label>{t('login.demo.admin')}:</Label> admin / admin123
              </BodySmall>
              <BodySmall color="muted">
                <Label>{t('login.demo.dispatcher')}:</Label> dispatcher /
                dispatch123
              </BodySmall>
              <BodySmall color="muted">
                <Label>{t('login.demo.driver')}:</Label> driver / driver123
              </BodySmall>
            </div>
          </div>

          {/* Driver App section */}
          <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Smartphone className="h-5 w-5 text-primary" />
              <Label className="text-primary">{t('login.driverApp.title')}</Label>
            </div>
            <BodySmall color="muted" className="mb-3">
              {t('login.driverApp.description')}
            </BodySmall>

            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => window.open(DRIVER_APP_URL, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {t('login.driverApp.openApp')}
              </Button>

              <button
                type="button"
                onClick={() => setShowInstallGuide(!showInstallGuide)}
                className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('login.driverApp.installGuide')}
                {showInstallGuide ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            </div>

            {showInstallGuide && (
              <div className="mt-4 space-y-4 pt-4 border-t border-primary/10">
                {/* iOS Instructions */}
                <div>
                  <Label className="text-xs font-medium mb-2 block">
                    {t('login.driverApp.ios.title')}
                  </Label>
                  <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>{t('login.driverApp.ios.step1')}</li>
                    <li>{t('login.driverApp.ios.step2')}</li>
                    <li>{t('login.driverApp.ios.step3')}</li>
                  </ol>
                </div>

                {/* Android Instructions */}
                <div>
                  <Label className="text-xs font-medium mb-2 block">
                    {t('login.driverApp.android.title')}
                  </Label>
                  <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>{t('login.driverApp.android.step1')}</li>
                    <li>{t('login.driverApp.android.step2')}</li>
                    <li>{t('login.driverApp.android.step3')}</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
