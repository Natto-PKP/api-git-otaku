export type UserRole = 'OWNER' | 'ADMIN' | 'HELPER' | 'USER';

export const UserRoles: UserRole[] = ['OWNER', 'ADMIN', 'HELPER', 'USER'];

export const UsernameRegex = /^[a-z](?:[a-z]*_?[a-z]+){3,32}$/;
export const PasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/;
export const PseudoRegex = /^[A-Za-z0-9](?:[A-Za-z0-9]*[-_ :]?[A-Za-z0-9]+){3,32}$/;
