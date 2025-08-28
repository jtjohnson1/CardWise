import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { 
  LayoutDashboard, 
  Library, 
  Heart, 
  ArrowLeftRight, 
  BarChart3, 
  Settings, 
  Scan,
  ChevronLeft,
  ChevronRight,
  CreditCard
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Collection", href: "/collection", icon: Library },
  { name: "Wishlist", href: "/wishlist", icon: Heart },
  { name: "Trade Lists", href: "/trade-lists", icon: ArrowLeftRight },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Scan Cards", href: "/scan", icon: Scan },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <div className={cn(
      "flex flex-col bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-r border-slate-200/50 dark:border-slate-700/50 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200/50 dark:border-slate-700/50">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              CardCat
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link key={item.name} to={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  collapsed && "px-2",
                  isActive && "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Stats */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Total Cards</span>
              <Badge variant="secondary">1,247</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Collection Value</span>
              <Badge variant="secondary">$12,450</Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}