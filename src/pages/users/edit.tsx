import {EditView, EditViewHeader} from "@/components/refine-ui/views/edit-view.tsx";
import {useForm} from "@refinedev/react-hook-form";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Controller} from "react-hook-form";

const UsersEdit = () => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        refineCore: { onFinish, formLoading },
    } = useForm({
        refineCoreProps: {
            resource: "users",
            redirect: "list",
        },
    });

    return (
        <EditView>
            <EditViewHeader title="Edit User" />
            
            <Card className="mt-4">
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit(onFinish)} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                {...register("name", { required: "Name is required" })}
                            />
                            {errors.name && <p className="text-sm text-destructive">{errors.name.message as string}</p>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                disabled
                                {...register("email")}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Controller
                                control={control}
                                name="role"
                                rules={{ required: "Role is required" }}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="student">Student</SelectItem>
                                            <SelectItem value="teacher">Teacher</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.role && <p className="text-sm text-destructive">{errors.role.message as string}</p>}
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <Button type="submit" disabled={formLoading}>
                                {formLoading ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </EditView>
    );
};

export default UsersEdit;
