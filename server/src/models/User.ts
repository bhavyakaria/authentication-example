export interface User {
    id?: number,
    email: string,
    first_name: string,
    last_name: string,
    password: string,
    password_salt?: string,
    password_hash_algorithm?: string,
    token?: string
}