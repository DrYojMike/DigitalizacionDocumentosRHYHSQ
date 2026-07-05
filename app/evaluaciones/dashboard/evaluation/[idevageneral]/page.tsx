
import MyEvaluation from "@/app/evaluaciones/Componnents/GetMyEvaluacion";
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
                Evaluacion
            </h1>

            <MyEvaluation
                idevageneral={idevageneral}
            />

        </div>
    );
}