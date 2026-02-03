import React, {useState} from 'react'
import {useShow, useList, useCreate, useDelete} from "@refinedev/core";
import {ClassDetails, User, UserRole} from "@/types";
import {ShowView, ShowViewHeader} from "@/components/refine-ui/views/show-view.tsx";
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Button} from "@/components/ui/button.tsx";
import {AdvancedImage} from "@cloudinary/react";
import {bannerPhoto} from "@/lib/cloudinary.ts";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {AlertCircle, Trash2, UserPlus} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";

const Show = () => {
    const { query } = useShow<ClassDetails>( { resource: 'classes' });
    const { mutate: enroll } = useCreate();
    const { mutate: unenroll } = useDelete();

    const classDetails = query.data?.data;
    const { isLoading, isError } = query;

    const [selectedStudent, setSelectedStudent] = useState<string>('');

    const { data: enrolledData, refetch: refetchEnrolled } = useList<User>({
        resource: 'enrollments',
        meta: {
            endpoint: `enrollments/class/${classDetails?.id}`
        },
        queryOptions: {
            enabled: !!classDetails?.id
        }
    });

    const { data: studentsData } = useList<User>({
        resource: 'users',
        filters: [{ field: 'role', operator: 'eq', value: 'student' }],
        pagination: { pageSize: 100 }
    });

    const enrolledStudents = enrolledData?.data ?? [];
    const allStudents = studentsData?.data ?? [];
    
    // Filter out already enrolled students
    const availableStudents = allStudents.filter(s => !enrolledStudents.some(es => es.id === s.id));

    const handleEnroll = () => {
        if (!selectedStudent || !classDetails) return;
        enroll({
            resource: 'enrollments',
            values: {
                studentId: selectedStudent,
                classId: classDetails.id
            }
        }, {
            onSuccess: () => {
                setSelectedStudent('');
                refetchEnrolled();
            }
        });
    };

    const handleUnenroll = (studentId: string) => {
        if (!classDetails) return;
        unenroll({
            resource: 'enrollments',
            id: '', // Not used by our backend delete but required by refine
            meta: {
                params: { studentId, classId: classDetails.id }
            }
        }, {
            onSuccess: () => {
                refetchEnrolled();
            }
        });
    };

    if(isLoading || isError || !classDetails) {
        return (
            <ShowView className="class-view class-show">
                <ShowViewHeader resource="classes" title="Class Details" />

                <p className="state-message">
                    {isLoading ? 'Loading class details...'
                        : isError ? 'Failed to load class details...'
                            : 'Class details not found'}
                </p>
            </ShowView>
        )
    }

    const teacherName = classDetails.teacher?.name ?? 'Unknown';
    const teachersInitials =
        teacherName
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase())
            .join('')

    const placeholderUrl = `https://placehold.co/600x400?text=${encodeURIComponent(teachersInitials || 'NA')}`;

    const { id, name, description, status, capacity, bannerUrl, bannerCldPubId, subject, teacher, department, inviteCode } = classDetails;

    const isNearCapacity = enrolledStudents.length >= capacity * 0.8;
    const isFull = enrolledStudents.length >= capacity;

    return (
        <ShowView className="class-view class-show">
            <ShowViewHeader resource="classes" title="Class Details" />

            <div className="banner">
                {bannerUrl && bannerCldPubId? (
                    <AdvancedImage alt="Class Banner" cldImg={bannerPhoto
                    (bannerCldPubId ?? '', name)}/>
                ) : <div className="placeholder" /> }
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardContent className="pt-6 space-y-6">
                        <div>
                            <div className="flex justify-between items-start">
                                <h1 className="text-3xl font-bold">{name}</h1>
                                <Badge variant={status === 'active' ? 'default' : 'secondary'}>{status.toUpperCase()}</Badge>
                            </div>
                            <p className="text-muted-foreground mt-2">{description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Subject</h3>
                                <p className="font-semibold">{subject?.name} ({subject?.code})</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Department</h3>
                                <p className="font-semibold">{department?.name}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Instructor</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={teacher?.image} />
                                        <AvatarFallback>{teacher?.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <p className="font-semibold">{teacherName}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Invite Code</h3>
                                <Badge variant="outline" className="font-mono text-lg">{inviteCode}</Badge>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Enrolled Students</h2>
                                <Badge variant={isFull ? "destructive" : isNearCapacity ? "warning" : "outline"}>
                                    {enrolledStudents.length} / {capacity} Students
                                </Badge>
                            </div>

                            {isNearCapacity && (
                                <Alert variant={isFull ? "destructive" : "default"} className="mb-4">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>{isFull ? "Class Full" : "Near Capacity"}</AlertTitle>
                                    <AlertDescription>
                                        {isFull ? "This class has reached its maximum capacity." : "This class is almost full. Only a few spots left."}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {enrolledStudents.map((student) => (
                                        <TableRow key={student.id}>
                                            <TableCell className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={student.image} />
                                                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                {student.name}
                                            </TableCell>
                                            <TableCell>{student.email}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => handleUnenroll(student.id)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {enrolledStudents.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                                                No students enrolled yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <h3 className="font-bold">Enroll Student</h3>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Select value={selectedStudent} onValueChange={setSelectedStudent} disabled={isFull}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a student" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableStudents.map(s => (
                                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button className="w-full" onClick={handleEnroll} disabled={!selectedStudent || isFull}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Enroll
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <h3 className="font-bold">Quick Actions</h3>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" className="w-full justify-start">Generate New Invite Code</Button>
                            <Button variant="outline" className="w-full justify-start">Export Attendance</Button>
                            <Button variant="outline" className="w-full justify-start text-destructive hover:bg-destructive/10">Archive Class</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ShowView>
    )
}
export default Show
