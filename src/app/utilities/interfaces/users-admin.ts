export interface UsersAdmin {
  count: number,
  rows: [
    {
      id: number,
      username: string,
      profilePic: string,
      firstName: string,
      lastName: string,
      email: string,
      isVerified: boolean,
      isAdmin: boolean,
      createdAt: string,
      meals: [
        { 
          id: number 
        }
      ]
    }
  ]
}
