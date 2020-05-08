export interface UserDecodedToken {
	id: number;
	isAdmin: boolean;
	username: string;
	iat: number;
	exp: number;
}
