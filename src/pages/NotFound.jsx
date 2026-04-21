import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider.jsx'

export default function NotFound() {
  const { t } = useI18n()
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <div className="text-7xl font-serif gradient-text mb-4">404</div>
      <h1 className="text-2xl font-serif mb-3">{t('notFound.title')}</h1>
      <p className="text-slate-400 mb-8">
        {t('notFound.description')}
      </p>
      <Link to="/" className="btn-primary">
        <Home className="h-4 w-4" />
        {t('notFound.home')}
      </Link>
    </div>
  )
}
