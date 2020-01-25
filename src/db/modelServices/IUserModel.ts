
export interface IRole {
  title: "donor"|"schoolAdmin"|"admin"
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

