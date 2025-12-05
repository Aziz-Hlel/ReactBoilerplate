import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@radix-ui/react-separator';
import { Link } from 'react-router-dom';

type IBreadCrumb = {
  title: string;
  href?: string;
};

const BreadcrumbHeader = ({ breadcrumbs }: { breadcrumbs: IBreadCrumb[] }) => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => (
              <>
                {index < breadcrumbs.length - 1 && (
                  <>
                    <BreadcrumbItem className="hidden md:block" key={index}>
                      <BreadcrumbLink asChild>
                        <Link to={breadcrumb.href || '#'}>{breadcrumb.title}</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                  </>
                )}
              </>
            ))}

            <>
              <BreadcrumbItem className="hidden md:block" key={breadcrumbs.length - 1}>
                <BreadcrumbPage>
                  <Link to={breadcrumbs[breadcrumbs.length - 1].href || '#'}>
                    {breadcrumbs[breadcrumbs.length - 1].title}
                  </Link>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
};

export default BreadcrumbHeader;
