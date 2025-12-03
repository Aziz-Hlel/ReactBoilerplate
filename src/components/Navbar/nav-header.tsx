import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { GalleryVerticalEnd } from 'lucide-react';

export interface INavbarHeader {
  name: string;
  logo: React.ElementType;
  plan: string;
}

const navbarHeader: INavbarHeader = {
  name: 'CodeNinja',
  logo: GalleryVerticalEnd,
  plan: 'Enterprise',
};

export function NavBarHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <navbarHeader.logo className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{navbarHeader.name}</span>
            <span className="truncate text-xs">{navbarHeader.plan}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
