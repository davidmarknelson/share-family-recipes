export interface UserRecipeCardInfo {
  id: number,
  username: string,
  profilePic: {
    profilePicName: string
  },
  count: number,
  rows: Array<{
    id?: number,
    mealPic?: {
      mealPicName: string
    },
    creator?: {
      username: string
    },
    creatorId?: number,
    likes?: Array<{userId: number}>,
    savedRecipes?: Array<{userId: number}>,
    name?: string,
    description?: string,
    cookTime?: number,
    difficulty?: number,
    createdAt?: string,
    updatedAt?: string
  }>,
  message?: string // for error messages
}