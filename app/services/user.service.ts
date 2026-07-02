import {httpClient} from "@/app/services/api/client";
import {User} from "@/app/services/api/types";

export const userService = {

    // getAll() {
    //     return httpClient.get<User[]>("/users/");
    // },

    getMe() {
        return httpClient.get<User>("auth/me/");
    },

    // getById(id: string){
    //     return httpClient.get<User>(`/users/${id}/`);
    // },

    // create(data: any) {
    //     return httpClient.post<User>("/users/",data);
    // },

    // update(id: string,data: any) {
    //     return httpClient.put<User>(`/users/${id}/`,data);
    // },

    // remove(id: string) {
    //     return httpClient.delete(`/users/${id}/`);
    // }
}