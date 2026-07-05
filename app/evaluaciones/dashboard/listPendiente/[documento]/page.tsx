import PendingEmployees from "@/app/evaluaciones/Componnents/ListOfEmployeesAtEvaluation";

interface Props {
    params: Promise<{
        documento: string;
    }>;
}

export default async function Page({
    params
}: Props) {

    const { documento } = await params;

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

            <PendingEmployees
                documento={documento}
            />

        </div>
    );
}