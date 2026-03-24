import client from './client'


interface LoginPayload {
    email: string
    password: string
}

interface RegisterPayload {
    email: string
    password: string
}

interface AuthResponse {
    message: string
    user_id: string
    access_token: string
}

export async function loginUser(payload: LoginPayload) {
    const response = await client.post<AuthResponse>('/auth/login', payload)
    return response.data
}


export async function registerUser(payload: RegisterPayload) {
    const response = await client.post<AuthResponse>('/auth/register', payload)
    return response.data
}


export async function deleteUser() {
    await client.delete('/auth/user')
}