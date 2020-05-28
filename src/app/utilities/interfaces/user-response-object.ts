import { UserProfile } from "./user-profile";

export interface UserResponseObject {
	jwt: string;
	user: UserProfile;
}
