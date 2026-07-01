interface MetricCardProps {
  title: string
  value: number
  icon?: React.ReactNode
}

export function MetricCard({ title, value, icon }: MetricCardProps) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {icon && <span className="text-gray-400">{icon}</span>}
      </div>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}
