export interface UserDecodedToken {
  id: number,
  isAdmin: boolean,
  username: string,
  savedRecipes: Array<{mealId: number}>
}