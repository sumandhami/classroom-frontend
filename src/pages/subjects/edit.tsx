import {EditView, EditViewHeader} from "@/components/refine-ui/views/edit-view.tsx";
import {useForm} from "@refinedev/react-hook-form";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Controller} from "react-hook-form";
import {useSelect} from "@refinedev/core";
import {DeleteButton} from "@/components/refine-ui/buttons/delete.tsx";

const SubjectsEdit = () => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        refineCore: { onFinish, formLoading, queryResult },
    } = useForm({
        refineCoreProps: {
            resource: "subjects",
            redirect: "list",
        },
    });

    const { options: departmentOptions } = useSelect({
        resource: "departments",
        optionLabel: "name",
        optionValue: "id",
    });

    const subjectData = queryResult?.data?.data;

    return (
        <EditView>
            <EditViewHeader 
                title="Edit Subject" 
                actionsSlot={
                    <DeleteButton 
                        resource="subjects" 
                        recordItemId={subjectData?.id} 
                        variant="destructive"
                    />
                }
            />
            
            <Card className="mt-4">
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit(onFinish)} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="departmentId">Department</Label>
                            <Controller
                                control={control}
                                name="departmentId"
                                rules={{ required: "Department is required" }}
                                render={({ field }) => (
                                    <Select onValueChange={(val) => field.onChange(parseInt(val))} value={field.value?.toString()}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departmentOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value.toString()}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.departmentId && <p className="text-sm text-destructive">{errors.departmentId.message as string}</p>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="code">Code</Label>
                            <Input
                                id="code"
                                placeholder="e.g. CS101"
                                {...register("code", { required: "Code is required" })}
                            />
                            {errors.code && <p className="text-sm text-destructive">{errors.code.message as string}</p>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. Introduction to Computer Science"
                                {...register("name", { required: "Name is required" })}
                            />
                            {errors.name && <p className="text-sm text-destructive">{errors.name.message as string}</p>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Subject description..."
                                {...register("description")}
                            />
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

export default SubjectsEdit;
