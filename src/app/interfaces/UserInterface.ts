import { RoleUserInterface } from './RoleUser';

export interface UserInterface {
    id_user: number;
    role_user_id: number;
    firstname_user: string;
    password: string;
    lastname_user: string;
    email_user: string;
    license_number_user: string;
    phone_number_user: string;
    exp: number;
    iat: number;
  }
  
  export interface TokenResponse {
    token: string;
    success: boolean;
    message: string;
  }
  
  export interface TokenPayloadLogin {
    login_user: string;
    password_user: string;
  }
  
  
  export interface TokenPayloadRegister {
    firstname_user: string;
    lastname_user: string;
    email_user: string;
    role_user_id: number;
    password_user?: string;
    phone_number_user: string;
  }
  
  export interface UserInfoInterface {
    id_user: number;
    role_user: RoleUserInterface;
    firstname_user: string;
    lastname_user: string;
    email_user: string;
    license_number_user: string;
    phone_number_user: string;
  }