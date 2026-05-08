import PanIndiaTemplate from './PanIndiaTemplate'
import { NoirTemplate, AuroraTemplate, EditorialTemplate, BloomTemplate, NeoTemplate } from './GenZTemplates'

export default function BioTemplate({ data }) {
  const t = data?.template || 'lotus'
  if (t === 'noir')      return <NoirTemplate      data={data} />
  if (t === 'aurora')    return <AuroraTemplate    data={data} />
  if (t === 'editorial') return <EditorialTemplate data={data} />
  if (t === 'bloom')     return <BloomTemplate     data={data} />
  if (t === 'neo')       return <NeoTemplate       data={data} />
  return <PanIndiaTemplate data={data} />
}
