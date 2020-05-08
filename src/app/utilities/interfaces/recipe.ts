export interface Recipe {
  id?: number,
  mealPic?: {
    mealPicName: string
  },
  creator?: {
    username: string,
    profilePic: {
      profilePicName: string
    }
  },
  creatorId?: number,
  likes?: Array<{userId: number}>,
  savedRecipes?: Array<{userId: number}>,
  name?: string,
  description?: string,
  ingredients?: Array<string>,
  instructions?: Array<string>,
  cookTime?: number,
  difficulty?: number,
  originalRecipeUrl?: string,
  youtubeUrl?: string,
  createdAt?: string,
  updatedAt?: string,
  message?: string // for error messages
}