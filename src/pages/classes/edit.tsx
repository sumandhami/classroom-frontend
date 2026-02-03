import {EditView, EditViewHeader} from "@/components/refine-ui/views/edit-view.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useBack, useList} from "@refinedev/core";
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm} from "@refinedev/react-hook-form";
import {classSchema} from "@/lib/schema.ts";
import * as z from "zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Loader2} from "lucide-react";
import UploadWidget from "@/components/upload-widget.tsx";
import {Subject, User} from "@/types";
import {DeleteButton} from "@/components/refine-ui/buttons/delete.tsx";

const Edit = () => {
    const back = useBack();

    const form = useForm({
        resolver: zodResolver(classSchema),
        refineCoreProps: {
            resource: "classes",
            redirect: "list",
        }
    });

    const {
        refineCore: { onFinish, queryResult },
        handleSubmit,
        formState: { isSubmitting },
        control,
    } = form;

    const classData = queryResult?.data?.data;

    const onSubmit = async (values: z.infer<typeof classSchema>) => {
        try {
            await onFinish(values);
        } catch (error) {
            console.error("Error updating class:", error);
        }
    };

    const { query: subjectsQuery } = useList<Subject>({
        resource: 'subjects',
        pagination: { pageSize: 100 }
    })

    const { query: teachersQuery } = useList<User>({
        resource: 'users',
        filters: [{ field: 'role', operator: 'eq' , value: 'teacher' }],
        pagination: { pageSize: 100 }
    })

    const subjects = subjectsQuery.data?.data ?? [];
    const teachers = teachersQuery.data?.data ?? [];

    const setBannerImage = (file: any, field: any) => {
        if(file) {
            field.onChange(file.url);
            form.setValue('bannerCldPubId', file.publicId);
        } else {
            field.onChange('');
            form.setValue('bannerCldPubId', '');
        }
    }

    return (
        <EditView>
            <EditViewHeader 
                title="Edit Class" 
                actionsSlot={
                    <DeleteButton 
                        resource="classes" 
                        recordItemId={classData?.id} 
                        variant="destructive"
                    />
                }
            />

            <div className="my-4">
                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-bold">Class Information</h2>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Class Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Class Name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={control}
                                        name="subjectId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Subject</FormLabel>
                                                <Select onValueChange={(val) => field.onChange(parseInt(val))} value={field.value?.toString()}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a subject" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {subjects.map(s => (
                                                            <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="teacherId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Teacher</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a teacher" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {teachers.map(t => (
                                                            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={control}
                                        name="capacity"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Capacity</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Status</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="active">Active</SelectItem>
                                                        <SelectItem value="inactive">Inactive</SelectItem>
                                                        <SelectItem value="archived">Archived</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Class description" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="bannerUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Banner Image</FormLabel>
                                            <FormControl>
                                                <UploadWidget 
                                                    value={field.value ? {url: field.value, publicId: form.getValues('bannerCldPubId') || ''} : null}
                                                    onChange={(val) => setBannerImage(val, field)} 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button variant="outline" type="button" onClick={() => back()}>Cancel</Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </EditView>
    );
};

export default Edit;
