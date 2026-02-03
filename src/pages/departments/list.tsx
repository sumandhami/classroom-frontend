import {ListView} from "@/components/refine-ui/views/list-view.tsx";
import {Breadcrumb} from "@/components/refine-ui/layout/breadcrumb.tsx";
import {Search} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {useMemo, useState} from "react";
import {CreateButton} from "@/components/refine-ui/buttons/create.tsx";
import {DataTable} from "@/components/refine-ui/data-table/data-table.tsx";
import {useTable} from "@refinedev/react-table";
import {Department} from "@/types";
import {ColumnDef} from "@tanstack/react-table";
import {EditButton} from "@/components/refine-ui/buttons/edit.tsx";
import {DeleteButton} from "@/components/refine-ui/buttons/delete.tsx";

const DepartmentsList = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const searchFilters = searchQuery ? [
        {field: 'q', operator: 'contains' as const, value: searchQuery}
    ] : [];

    const departmentTable = useTable<Department>({
        columns: useMemo<ColumnDef<Department>[]>(() => [
            {
                id: 'id',
                accessorKey: 'id',
                size: 80,
                header: () => <p className="column-title ml-2">ID</p>,
            },
            {
                id: 'code',
                accessorKey: 'code',
                size: 100,
                header: () => <p className="column-title">Code</p>,
            },
            {
                id: 'name',
                accessorKey: 'name',
                size: 200,
                header: () => <p className="column-title">Name</p>,
                cell: ({ getValue }) => <span className="text-foreground font-medium">{getValue<string>()}</span>,
            },
            {
                id: 'description',
                accessorKey: 'description',
                size: 300,
                header: () => <p className="column-title">Description</p>,
                cell: ({ getValue }) => <span className="truncate line-clamp-2">{getValue<string>()}</span>,
            },
            {
                id: 'actions',
                size: 150,
                header: () => <p className="column-title">Actions</p>,
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <EditButton resource="departments" recordItemId={row.original.id} variant="outline" size="sm" />
                        <DeleteButton resource="departments" recordItemId={row.original.id} variant="outline" size="sm" />
                    </div>
                )
            }
        ], []),
        refineCoreProps: {
            resource: 'departments',
            pagination: {pageSize: 10, mode: 'server'},
            filters: {
                permanent: [...searchFilters]
            },
            sorters: {
                initial: [
                    {field: 'id', order: 'desc'},
                ]
            },
        }
    });

    return (
        <ListView>
            <Breadcrumb />

            <h1 className="page-title">Departments</h1>

            <div className="intro-row">
                <p>Manage academic departments and their details.</p>

                <div className="actions-row">
                    <div className="search-field">
                        <Search className="search-icon" />

                        <Input
                            type="text"
                            placeholder="Search by name..."
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <CreateButton />
                    </div>
                </div>
            </div>
            
            <DataTable table={departmentTable} />
        </ListView>
    )
}
export default DepartmentsList
