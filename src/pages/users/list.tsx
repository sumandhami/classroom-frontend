import {ListView} from "@/components/refine-ui/views/list-view.tsx";
import {Breadcrumb} from "@/components/refine-ui/layout/breadcrumb.tsx";
import {Search} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {useMemo, useState} from "react";
import {DataTable} from "@/components/refine-ui/data-table/data-table.tsx";
import {useTable} from "@refinedev/react-table";
import {User, UserRole} from "@/types";
import {ColumnDef} from "@tanstack/react-table";
import {Badge} from "@/components/ui/badge.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {EditButton} from "@/components/refine-ui/buttons/edit.tsx";

const UsersList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');

    const roleFilters = selectedRole === 'all' ? [] : [
        {field: 'role', operator: 'eq' as const, value: selectedRole}
    ];

    const searchFilters = searchQuery ? [
        {field: 'q', operator: 'contains' as const, value: searchQuery}
    ] : [];

    const userTable = useTable<User>({
        columns: useMemo<ColumnDef<User>[]>(() => [
            {
                id: 'avatar',
                size: 60,
                header: () => <p className="column-title ml-2">User</p>,
                cell: ({ row }) => (
                    <Avatar className="ml-2 h-8 w-8">
                        <AvatarImage src={row.original.image} alt={row.original.name} />
                        <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                )
            },
            {
                id: 'name',
                accessorKey: 'name',
                size: 200,
                header: () => <p className="column-title">Name</p>,
                cell: ({ getValue }) => <span className="text-foreground font-medium">{getValue<string>()}</span>,
            },
            {
                id: 'email',
                accessorKey: 'email',
                size: 250,
                header: () => <p className="column-title">Email</p>,
            },
            {
                id: 'role',
                accessorKey: 'role',
                size: 120,
                header: () => <p className="column-title">Role</p>,
                cell: ({ getValue }) => {
                    const role = getValue<UserRole>();
                    return (
                        <Badge variant={role === UserRole.ADMIN ? 'destructive' : role === UserRole.TEACHER ? 'default' : 'secondary'}>
                            {role.toUpperCase()}
                        </Badge>
                    );
                }
            },
            {
                id: 'actions',
                size: 100,
                header: () => <p className="column-title">Actions</p>,
                cell: ({ row }) => (
                    <EditButton resource="users" recordItemId={row.original.id} variant="outline" size="sm" />
                )
            }
        ], []),
        refineCoreProps: {
            resource: 'users',
            pagination: {pageSize: 10, mode: 'server'},
            filters: {
                permanent: [...roleFilters, ...searchFilters]
            },
            sorters: {
                initial: [
                    {field: 'createdAt', order: 'desc'},
                ]
            },
        }
    });

    return (
        <ListView>
            <Breadcrumb />

            <h1 className="page-title">Users</h1>

            <div className="intro-row">
                <p>Manage system users and their roles.</p>

                <div className="actions-row">
                    <div className="search-field">
                        <Search className="search-icon" />

                        <Input
                            type="text"
                            placeholder="Search by name or email..."
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Filter by Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="student">Student</SelectItem>
                                <SelectItem value="teacher">Teacher</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
            
            <DataTable table={userTable} />
        </ListView>
    )
}
export default UsersList
