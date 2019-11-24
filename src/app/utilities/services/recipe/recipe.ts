export interface Recipe {
  id?: number,
  mealPic?: string,
  name: string,
  originalName?: string,
  description: string,
  ingredients: Array<string>,
  instructions: Array<string>,
  cookTime: number,
  difficulty: number,
  originalRecipeUrl?: string,
  youtubeUrl?: string,
  createdAt?: string,
  updatedAt?: string
}