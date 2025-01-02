import { useState } from 'react'
import { CircleUser } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export function UserNav() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()

  const handleSelect = (callback?: () => void) => {
    setOpen(false)
    if (callback) {
      callback()
    }
  }

  if (!user) {
    return null // Or render a login button
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              <CircleUser />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-muted-foreground">
              {user.name}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {user.user_type === 'USER' && user.organization && (
            <DropdownMenuItem asChild>
              <Link to="/organization/dashboard" onClick={() => handleSelect()}>
                Organization Dashboard
              </Link>
            </DropdownMenuItem>
          )}
          {user.user_type === 'LABOUR' && (
            <DropdownMenuItem asChild>
              <Link to="/worker/dashboard" onClick={() => handleSelect()}>
                Worker Dashboard
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link to="/profile" onClick={() => handleSelect()}>
              My Dashboard
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="bg-red-200 cursor-pointer"
          onSelect={() => handleSelect(logout)}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

