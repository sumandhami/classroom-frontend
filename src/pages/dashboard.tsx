import React from 'react';
import {useCustom, useGetIdentity} from "@refinedev/core";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {BookOpen, GraduationCap, Users, UserCheck, TrendingUp, PieChart as PieChartIcon} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';

const Dashboard = () => {
       const { data: user } = useGetIdentity<{
        name: string;
        organization?: {
            name: string;
            logo?: string;
        };
    }>();
    // ✅ Destructure correctly from useCustom
    const { query: statsQuery } = useCustom({
        url: `/dashboard/stats`,
        method: "get",
    });

    const { query: trendsQuery } = useCustom({
        url: `/dashboard/charts/enrollment-trends`,
        method: "get",
    });

    const { query: deptsQuery } = useCustom({
        url: `/dashboard/charts/classes-by-dept`,
        method: "get",
    });

    const { query: usersQuery } = useCustom({
        url: `/dashboard/charts/user-distribution`,
        method: "get",
    });

    const { query: capacityQuery } = useCustom({
        url: `/dashboard/charts/capacity-status`,
        method: "get",
    });

    // ✅ Access data from query.data
    const statsData = statsQuery.data?.data?.data || { users: 0, classes: 0, enrollments: 0, subjects: 0 };
    const trendsData = trendsQuery.data?.data?.data || [];
    const deptsData = deptsQuery.data?.data?.data || [];
    const usersData = usersQuery.data?.data?.data || [];
    const capacityData = capacityQuery.data?.data?.data || [];

    console.log('📦 Final extracted data:', {
        statsData,
        trendsData,
        deptsData,
        usersData,
        capacityData
    });

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    if (statsQuery.isLoading) {
        return <div className="p-6">Loading dashboard...</div>;
    }

    if (statsQuery.isError) {
        return (
            <div className="p-6">
                <h1 className="text-3xl font-bold text-red-600">Error Loading Dashboard</h1>
                <pre className="mt-4 p-4 bg-red-50 rounded">
                    {JSON.stringify(statsQuery.error, null, 2)}
                </pre>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
                {user?.organization?.logo && (
                    <img 
                        src={user.organization.logo} 
                        alt={user.organization.name || "Organization"}
                        className="w-10 h-10 rounded object-cover"
                    />
                )}
                <h1 className="text-3xl font-bold">
                    {user?.organization?.name || "Dashboard"}
                </h1>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard 
                    title="Total Users" 
                    value={statsData.users} 
                    icon={<Users className="h-6 w-6" />}
                    description="Registered accounts"
                />
                <MetricCard 
                    title="Active Classes" 
                    value={statsData.classes} 
                    icon={<GraduationCap className="h-6 w-6" />}
                    description="Current sessions"
                />
                <MetricCard 
                    title="Enrollments" 
                    value={statsData.enrollments} 
                    icon={<UserCheck className="h-6 w-6" />}
                    description="Student joins"
                />
                <MetricCard 
                    title="Subjects" 
                    value={statsData.subjects} 
                    icon={<BookOpen className="h-6 w-6" />}
                    description="Curriculum items"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Enrollment Trends */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Enrollment Trends
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {trendsData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendsData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                No enrollment data
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Classes by Department */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChartIcon className="h-5 w-5" />
                            Classes by Department
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {deptsData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={deptsData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                No department data
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* User Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>User Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {usersData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={usersData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {usersData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                No user data
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Capacity Status */}
                <Card>
                    <CardHeader>
                        <CardTitle>Class Capacity Status</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {capacityData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={capacityData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {capacityData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={entry.name === 'Full' ? '#ef4444' : entry.name === 'Near Capacity' ? '#f59e0b' : '#10b981'} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                No capacity data
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const MetricCard = ({ title, value, icon, description }: any) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <div className="text-muted-foreground">{icon}</div>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </CardContent>
    </Card>
);

export default Dashboard;