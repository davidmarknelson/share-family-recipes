export interface UserProfile {
	id: number;
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	isAdmin: boolean;
	isVerified: boolean;
	profilePic: {
		profilePicName: string;
	};
	createdAt: string;
	updatedAt: string;
}
