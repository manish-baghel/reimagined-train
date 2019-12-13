
export interface IRole {
  title: "customer"|"agent"|"admin"
}
interface IUserModelServiceResponse {
  status: string,
  data?: any,
  err?: Error
}

export interface IAddUserProps {
  email:string,
  password: string
}

export interface IAddTempUserProps {
  name?: string,
  first_name? : string,
  last_name? : string,
  gender? : string,
  college? : string,
  college_year? : string,
  college_stream? : string,
  ref_type? : string,
  ref_by? : string,
  ref_code? : string,
  email: string,
  phone: string,
  role: IRole
}
export interface IUser {
  first_name: string,
  middle_name? :string,
  last_name: string,
  email: string,
  phone: string,
  role: string |any,
  age: string,
  gender: string
}

export interface IUserRegister {
  first_name: string,
  middle_name? :string,
  last_name: string,
  email: string,
  phone: string,
  password:string,
  role: string |any,
  dob: string,
  gender: string
}

