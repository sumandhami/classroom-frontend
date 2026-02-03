import React from 'react';
import {useApiUrl, useCustom} from "@refinedev/core";
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
    const apiUrl = useApiUrl();

    const { data: stats } = useCustom({
        url: `${apiUrl}/dashboard/stats`,
        method: "get",
    });

    const { data: trends } = useCustom({
        url: `${apiUrl}/dashboard/charts/enrollment-trends`,
        method: "get",
    });

    const { data: depts } = useCustom({
        url: `${apiUrl}/dashboard/charts/classes-by-dept`,
        method: "get",
    });

    const { data: users } = useCustom({
        url: `${apiUrl}/dashboard/charts/user-distribution`,
        method: "get",
    });

    const { data: capacity } = useCustom({
        url: `${apiUrl}/dashboard/charts/capacity-status`,
        method: "get",
    });

    const statsData = stats?.data?.data || { users: 0, classes: 0, enrollments: 0, subjects: 0 };
    const trendsData = trends?.data?.data || [];
    const deptsData = depts?.data?.data || [];
    const usersData = users?.data?.data || [];
    const capacityData = capacity?.data?.data || [];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>

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
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
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
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={deptsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* User Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>User Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
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
                    </CardContent>
                </Card>

                {/* Capacity Status */}
                <Card>
                    <CardHeader>
                        <CardTitle>Class Capacity Status</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
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
