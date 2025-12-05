import { ChevronRight, LayoutDashboard, Settings2, UsersRound } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Link } from 'react-router-dom';
import type { Prettify } from 'node_modules/zod/v4/core/util.d.cts';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

type NavRoute = {
  title: string;
  url: string;
  icon: React.ElementType;
  isActive: boolean;
  items?: Omit<NavRoute, 'items' | 'icon'>[];
};

const navRoutes: NavRoute[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
    isActive: true,
    items: [
      {
        title: 'Overview',
        url: '/dashboard/overview',
        isActive: true,
      },
      {
        title: 'Stats',
        url: '/dashboard/stats',
        isActive: false,
      },
    ],
  },
  {
    title: 'Users',
    url: '/users',
    icon: UsersRound,
    isActive: true,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings2,
    isActive: true,
    items: [
      {
        title: 'Profile',
        url: '/settings/profile',
        isActive: true,
      },
    ],
  },
];

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {navRoutes.map((navRoute, index) =>
          navRoute.items && navRoute.items.length > 0 ? (
            <NestedRoute route={navRoute as INestedRoute} key={index} />
          ) : (
            <SimpleRoute route={navRoute} key={index} />
          ),
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}

type INestedRoute = Prettify<
  Omit<NavRoute, 'items'> & {
    items: Omit<NavRoute, 'items' | 'icon'>[];
  }
>;
const NestedRoute = ({ route }: { route: INestedRoute }) => {
  const { isMobile, state } = useSidebar();

  if (state === 'expanded')
    return (
      <Collapsible key={route.title} asChild defaultOpen={route.isActive} className="group/collapsible group">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton>
              <route.icon />
              <span>{route.title}</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-open:rotate-90 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarMenuSub>
              {route.items?.map((subItem, subIndex) => (
                <SidebarMenuSubItem key={subIndex}>
                  <SidebarMenuSubButton asChild aria-disabled={!subItem.isActive}>
                    <Link to={subItem.url}>
                      <span>{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );

  return (
    <DropdownMenu key={route.title}>
      <SidebarMenuItem>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton tooltip={route.title}>
            <route.icon />
            <span>{route.title}</span>
          </SidebarMenuButton>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side={isMobile ? 'bottom' : 'right'}
          align={isMobile ? 'end' : 'start'}
          className="min-w-56 rounded-lg"
        >
          {route.items?.map((item, itemIndex) => (
            <DropdownMenuItem asChild key={itemIndex} disabled={!item.isActive}>
              <Link to={item.url}>{item.title}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </SidebarMenuItem>
    </DropdownMenu>
  );
};

type ISimpleRoute = Omit<NavRoute, 'items'>;

const SimpleRoute = ({ route }: { route: ISimpleRoute }) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton aria-disabled={!route.isActive} asChild className="cursor-pointer" tooltip={route.title}>
        <Link to={route.url} className="flex items-center gap-2">
          <route.icon />
          <span>{route.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
