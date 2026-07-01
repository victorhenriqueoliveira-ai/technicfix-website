import { getBanners } from '@/actions/banners'
import { BannersClientPage } from './BannersClientPage'

export default async function BannersPage() {
  const banners = await getBanners()

  return <BannersClientPage banners={banners} />
}
