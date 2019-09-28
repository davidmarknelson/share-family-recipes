export interface User {
  user: {
    id: number,
    isVerified: boolean,
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    isAdmin: true,
    profilePic: string,
    originalUsername: string,
    updatedAt: string,
    createdAt: string
  },
  jwt: string
  
}
