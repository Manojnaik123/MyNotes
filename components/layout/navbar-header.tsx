"use client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
    BreadcrumbPage
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { FoldersQueryKey } from "@/lib/query-keys";
import { Folder } from "@/types/folder";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const NavbarHeader = () => {
    const queryClient = useQueryClient();
    const { folderId } = useParams();
    const folders: Folder[] = queryClient.getQueryData([FoldersQueryKey]) ?? [];

    const folderName = folders.find((folder) => folder.id === Number(folderId))?.folderName;

    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2 px-4 w-full">
                    <SidebarTrigger className="-ml-1" />
                    {folderId &&
                        (
                            <>
                                <Separator
                                    orientation="vertical"
                                    className="mr-2 data-[orientation=vertical]:h-4"
                                />
                                <Breadcrumb>

                                    <BreadcrumbList>
                                        <BreadcrumbItem className="hidden md:block">
                                            <BreadcrumbLink>
                                                {folderName}
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator className="hidden md:block" />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>{'yet to add this'}</BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </BreadcrumbList>

                                </Breadcrumb>
                            </>
                        )}
                </div>
            </header>
        </>
    )
}

export default NavbarHeader