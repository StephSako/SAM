import { RoleUserInterface } from './roleUser';

export interface UserInterface {
    id_user: number;
    role: string;
    firstname: string;
    password: string;
    lastname: string;
    role_user_id: number;
    email: string;
    phone_number: string;
    profile_pic_name: string;
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
    profile_pic_name: string;
  }
