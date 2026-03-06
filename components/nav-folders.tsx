"use client"

import { FolderSideBar } from "@/types/folder"
import { usePathname } from "next/navigation"

import {
  CircleArrowRight,
  Folder,
  Forward,
  MoreHorizontal,
  Pen,
  Plus,
  SquarePen,
  Trash2,
  type LucideIcon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import AddFolderDialog from "./notes/add-folder-dialog"
import { useState } from "react"
import { Button } from "./tiptap-ui-primitive/button"
import { DeleteConformationDialog } from "./conformation/delete-conformation"

export function NavFolders({
  folders,
}: {
  folders: FolderSideBar[]
}) {
  const { isMobile } = useSidebar()
  const pathName = usePathname();
  const [openAddFolder, setOpenAddFolder] = useState<boolean>(false);
  const [openDeleteConformation, setOpenDeleteConformation] = useState<boolean>(false);
  const [selectedFolderId, setSelectedFolderId] = useState<number>();

  const handleEditFolderClick = (folderId: number) => {
    setSelectedFolderId(folderId);
    setOpenAddFolder(true);
  }

  const handleDeleteFolder = (folderId: number) => {
    setSelectedFolderId(folderId);
    setOpenDeleteConformation(true);
  }

  return (
    <>
      <AddFolderDialog
        open={openAddFolder}
        setOpen={setOpenAddFolder}
        folderId={selectedFolderId}
      />
      <DeleteConformationDialog
        open={openDeleteConformation}
        setOpen={setOpenDeleteConformation}
        folderId={selectedFolderId}
      />
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel className="flex justify-between pb-2">
          Folders
          <Button variant="ghost" className="" onClick={() => setOpenAddFolder(true)}>
            <Plus className="h-4" />
          </Button>
        </SidebarGroupLabel>
        <SidebarMenu>
          {folders.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={pathName === item.url}>
                <Link href={item.url}>
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem onClick={() => handleEditFolderClick(item.id)}>
                    <SquarePen className="text-muted-foreground" />
                    <span>Edit Folder Details</span>
                  </DropdownMenuItem>

                  {/* <Link href={`/home/dashboard/`}>
                    <DropdownMenuItem>
                      <CircleArrowRight className="text-muted-foreground" />
                      <span>Open Folder</span>
                    </DropdownMenuItem>
                  </Link> */}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => handleDeleteFolder(item.id)}>
                    <Trash2 className="text-destructive" />
                    <span className="text-destructive">Delete Folder</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </>
  )
}
