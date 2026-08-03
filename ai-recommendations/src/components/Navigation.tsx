import {
  Activity,
  BarChart3,
  Briefcase,
  ClipboardCheck,
  Database,
  FileText,
  HeartHandshake,
  LayoutDashboard,
  Lightbulb,
  LineChart,
  Lock,
  MessageSquare,
  RotateCw,
  Umbrella,
  type LucideIcon,
} from 'lucide-react'
import logoPath1 from '../assets/brand/logo-path-1.svg'
import logoPath2 from '../assets/brand/logo-path-2.svg'
import { cn } from '../lib/utils'

const TOP_ITEMS: { icon: LucideIcon; selected?: boolean }[] = [
  { icon: Briefcase, selected: true },
  { icon: FileText },
  { icon: HeartHandshake },
  { icon: Umbrella },
  { icon: Lock },
  { icon: ClipboardCheck },
]

const MID_ITEMS: { icon: LucideIcon }[] = [
  { icon: MessageSquare },
  { icon: RotateCw },
  { icon: Activity },
  { icon: LineChart },
  { icon: BarChart3 },
  { icon: Lightbulb },
  { icon: Database },
]

const BOTTOM_ITEMS: { icon: LucideIcon }[] = [{ icon: LayoutDashboard }]

function NavItem({ icon: Icon, selected }: { icon: LucideIcon; selected?: boolean }) {
  return (
    <div
      className={cn(
        'flex w-full shrink-0 items-center justify-center rounded-[8px] px-[12px] py-[10px]',
        selected ? 'bg-[#eae7fe]' : 'hover:bg-[var(--color-bg-secondary)]',
      )}
    >
      <Icon size={20} className={selected ? 'text-[var(--color-text-interactive)]' : 'text-[var(--color-text-tertiary)]'} />
    </div>
  )
}

function Divider() {
  return (
    <div className="flex w-full shrink-0 items-center justify-center px-[4px] pb-[8px] pt-[12px]">
      <div className="h-[2px] w-full rounded-[10px] bg-[var(--color-bg-muted)]" />
    </div>
  )
}

export function Navigation() {
  return (
    <div className="flex h-full w-[76px] shrink-0 flex-col items-center gap-0 border-r border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] px-[16px] pb-[40px]">
      <div className="flex w-full flex-1 flex-col items-start gap-[12px] overflow-hidden">
        <div className="flex w-full items-center justify-center px-[12px] py-[20px]">
          <div className="relative size-[24px]">
            <img src={logoPath2} alt="" className="absolute inset-0 size-full -scale-x-100" />
            <img src={logoPath1} alt="" className="absolute inset-0 size-full -scale-x-100" />
          </div>
        </div>
        <div className="flex w-full flex-col items-start gap-[4px]">
          <Divider />
          {TOP_ITEMS.map((item, i) => (
            <NavItem key={i} icon={item.icon} selected={item.selected} />
          ))}
          <Divider />
          {MID_ITEMS.map((item, i) => (
            <NavItem key={i} icon={item.icon} />
          ))}
          <Divider />
          {BOTTOM_ITEMS.map((item, i) => (
            <NavItem key={i} icon={item.icon} />
          ))}
        </div>
      </div>
    </div>
  )
}
