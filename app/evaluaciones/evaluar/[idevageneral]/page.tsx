import EmployeeEvaluation from "@/app/evaluaciones/Componnents/EvaluateAnEmployee";

interface Props {
    params: Promise<{
        idevageneral: number;
    }>;
}

export default async function Page({
    params
}: Props) {

    const { idevageneral } = await params;

    return (
        <div className="p-10">

            <h1
                className="
                    text-4xl
                    font-bold
                    mb-8
                "
            >
                Empleados pendientes
            </h1>

            <EmployeeEvaluation
                idevageneral={idevageneral}
            />

        </div>
    );
}