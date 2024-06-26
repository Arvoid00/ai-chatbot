import { SidebarDesktop } from '@/components/sidebar-desktop'

interface ChatLayoutProps {
    children: React.ReactNode
}

export default async function AgentLayout({ children }: ChatLayoutProps) {
    return (
        <div className="relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden">
            <SidebarDesktop agentParam='' />
            {children}
        </div>
    )
}
