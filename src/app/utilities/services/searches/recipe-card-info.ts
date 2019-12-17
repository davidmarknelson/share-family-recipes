export interface RecipeCardInfo {
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
    name?: string,
    description?: string,
    cookTime?: number,
    difficulty?: number,
    createdAt?: string,
    updatedAt?: string
  }>,
  message?: string // for error messages
}