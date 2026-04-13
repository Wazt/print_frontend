import React from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/Components/ui/sidebar";
import { AppSidebar } from "@/Components/AppSideBar";
import LanguageSwitcher from "@/Components/LanguageSwitcher";
import ThemeSwitcher from "@/Components/ThemeSwitcher";
import MobileBottomNav from "@/Components/MobileBottomNav";
import { Bell } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";

function generateBreadcrumbLabel(segment) {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function Layout() {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-[var(--ob-bg)]">
        <AppSidebar />

        {/* Right Side */}
        <div className="flex flex-1 flex-col overflow-hidden relative z-[5]">

          {/* Top Bar — glass morphism */}
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[var(--ob-brd)] px-5 h-[50px] bg-[var(--ob-surf)]/85 backdrop-blur-[16px]">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <SidebarTrigger className="rounded-[10px] p-2 border border-[var(--ob-brd)] bg-[var(--ob-surf2)] text-[var(--ob-txm)] hover:text-[var(--ob-tx)] hover:border-[var(--ob-brd2)] transition" />

              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/" className="text-[var(--ob-txd)] hover:text-[var(--ob-tx)] text-xs">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>

                  {segments.map((segment, index) => {
                    const isLast = index === segments.length - 1;
                    const path = `/${segments.slice(0, index + 1).join("/")}`;
                    const label = generateBreadcrumbLabel(segment);

                    return (
                      <React.Fragment key={path}>
                        <BreadcrumbSeparator className="text-[var(--ob-txdd)]" />
                        <BreadcrumbItem>
                          {isLast ? (
                            <BreadcrumbPage className="text-[var(--ob-tx)] text-xs font-medium">
                              {label}
                            </BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink asChild>
                              <Link to={path} className="text-[var(--ob-txd)] hover:text-[var(--ob-tx)] text-xs">{label}</Link>
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                      </React.Fragment>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <LanguageSwitcher />
              <ThemeSwitcher />
              <button className="w-[34px] h-[34px] rounded-[10px] border border-[var(--ob-brd)] bg-[var(--ob-surf2)] flex items-center justify-center text-[var(--ob-txm)] hover:text-[var(--ob-tx)] hover:border-[var(--ob-brd2)] transition relative">
                <Bell size={15} />
                <span className="absolute top-[5px] right-[5px] w-[7px] h-[7px] rounded-full bg-[var(--ob-or)] border-[1.5px] border-[var(--ob-surf)]" />
              </button>
            </div>
          </header>

          {/* Scrollable Page Content */}
          <main className="flex-1 overflow-y-auto pb-[70px] md:pb-0">
            <div className="mx-auto w-full max-w-7xl px-5 py-5 md:px-6 md:py-6">
              <Outlet />
            </div>
          </main>

          {/* Mobile bottom nav */}
          <MobileBottomNav />
        </div>
      </div>
    </SidebarProvider>
  );
}
