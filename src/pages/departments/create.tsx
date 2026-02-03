import {CreateView, CreateViewHeader} from "@/components/refine-ui/views/create-view.tsx";
import {useForm} from "@refinedev/react-hook-form";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";

const DepartmentsCreate = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        refineCore: { onFinish, formLoading },
    } = useForm({
        refineCoreProps: {
            resource: "departments",
            redirect: "list",
        },
    });

    return (
        <CreateView>
            <CreateViewHeader title="Create Department" />
            
            <Card className="mt-4">
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit(onFinish)} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="code">Code</Label>
                            <Input
                                id="code"
                                placeholder="e.g. CS, MATH, PHY"
                                {...register("code", { required: "Code is required" })}
                            />
                            {errors.code && <p className="text-sm text-destructive">{errors.code.message as string}</p>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. Computer Science"
                                {...register("name", { required: "Name is required" })}
                            />
                            {errors.name && <p className="text-sm text-destructive">{errors.name.message as string}</p>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Department description..."
                                {...register("description")}
                            />
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <Button type="submit" disabled={formLoading}>
                                {formLoading ? "Saving..." : "Create"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </CreateView>
    );
};

export default DepartmentsCreate;
