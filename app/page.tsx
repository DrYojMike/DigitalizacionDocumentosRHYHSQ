"use client";
import {
    useAuth
} from "@/app/context/AuthContext";


import Welcome from "@/app/components/home/Welcome";
import EmployeeView from "@/app/components/home/EmployeeView";
import AdminView from "@/app/components/home/AdminView";



export default function Home() {
    const {user,loading} = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Cargando...
            </div>
        )
    }
    console.log(user);
    return (
        
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-7xl mx-auto px-8py-20">
                {
                    !user && (
                        <Welcome />
                    )
                }
                {
                    user && (
                        <>
                            <div className="mb-12">
                                <h1 className="text-5xl font-bold">
                                    Hola {user.name} 👋
                                </h1>
                                <p className=" text-gray-600 mt-4 text-lg">
                                    Bienvenido al portal de documentación.
                                </p>
                            </div>
                            {
                                user.role === "EMPLEADO"
                                    ?
                                    <EmployeeView
                                        evaluacion={user.permissions?.evaluacion}
                                        tipoEvaluacion={user.permissions?.tipoEvaluacion}
                                        empleadoAcargo={user.permissions?.empleadosCargo}
                                        documento={user.documento}
                                    />
                                    :
                                    <AdminView />
                            }
                        </>
                    )
                }
            </main>
        </div>
    )
}