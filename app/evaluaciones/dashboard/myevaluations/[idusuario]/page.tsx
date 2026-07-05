import EmployeeEvaluationList from "@/app/evaluaciones/Componnents/MylistOfEvaluations";
interface Props {
    params: Promise<{
        idusuario: string;
    }>;
}

export default async function Page({
    params
}: Props) {

    const { idusuario } = await params;

    return (
        <div className="p-10">

            <h1
                className="
                    text-4xl
                    font-bold
                    mb-8
                "
            >
                Evaluaciones Realizadas
            </h1>

            <EmployeeEvaluationList
                idUsuario={idusuario}
            />

        </div>
    );
}