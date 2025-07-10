export type Role = 'ADMIN' | 'CUSTOMER' | 'STAFF';

export type AuthUserDTO = {
    id: string;
    email: string;
    role: Role;
    firstName: string;
    lastName: string;
    pictureUrl: string;
}