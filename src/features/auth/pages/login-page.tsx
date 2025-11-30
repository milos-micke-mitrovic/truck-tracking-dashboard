import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { TFunction } from 'i18next'
import { Truck } from 'lucide-react'
import { toast } from 'sonner'
import { useLogin, useAuth } from '@/features/auth'
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
            <Truck className="text-primary-foreground size-6" />
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
      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="bg-primary flex size-10 items-center justify-center rounded-lg">
              <Truck className="text-primary-foreground size-6" />
            </div>
            <H4>{t('common:app.name')}</H4>
          </div>

          <div className="mb-8">
            <H1 className="mb-2">{t('login.title')}</H1>
            <BodySmall className="text-muted-foreground">
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
            <Label className="text-muted-foreground mb-2 block">
              {t('login.demo.title')}
            </Label>
            <div className="space-y-1">
              <BodySmall className="text-muted-foreground">
                <Label>{t('login.demo.admin')}:</Label> admin / admin123
              </BodySmall>
              <BodySmall className="text-muted-foreground">
                <Label>{t('login.demo.dispatcher')}:</Label> dispatcher /
                dispatch123
              </BodySmall>
              <BodySmall className="text-muted-foreground">
                <Label>{t('login.demo.driver')}:</Label> driver / driver123
              </BodySmall>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
