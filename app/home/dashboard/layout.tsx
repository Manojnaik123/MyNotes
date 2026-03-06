"use client";

import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { ReactNode, useState } from "react";
import { Folder } from "@/types/folder";
import NavbarHeader from "@/components/layout/navbar-header";
import { fetchFolders } from "@/lib/fetch-function-calls/fetch-folders";
import { FoldersQueryKey } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import { SpinnerCustom } from "@/components/custom-comp/spinner";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

type Props = {
    children: ReactNode
}

const Layout = ({ children }: Props) => {

    const { data: folders, isLoading, error } = useQuery({
        queryKey: [FoldersQueryKey],
        queryFn: fetchFolders
    })

    if (isLoading) return (
        <div className="w-full min-h-screen flex justify-center items-center">
            <Button variant={'link'} disabled>
                <SpinnerCustom data-icon='inline-start' />
                Application Loading...
            </Button>
        </div>
    )

    return (
        <SidebarProvider>
            <AppSidebar folders={folders ?? []} />
            <SidebarInset className="overflow-x-hidden">
                {/* Top nav layout content */}
                <NavbarHeader />
                <div className="flex flex-1 flex-col gap-4">
                    <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
                        {children}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default Layout;