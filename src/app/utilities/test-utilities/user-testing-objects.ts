import { UserProfile } from "@utilities/interfaces/user-profile";

export class UserTestingObjects {
	fullUserObject: UserProfile = {
		id: 1,
		firstName: "Jack",
		lastName: "Smith",
		username: "jacksmith",
		email: "smith@email.com",
		isAdmin: true,
		isVerified: true,
		profilePic: {
			profilePicName: "www.awesomepic.com"
		},
		createdAt: "Oct 08, 2019",
		updatedAt: "Oct 08, 2019"
	};

	userObject: UserProfile = {
		id: 1,
		firstName: "John",
		lastName: "Doe",
		username: "johndoe",
		email: "example@email.com",
		isAdmin: false,
		isVerified: false,
		profilePic: {
			profilePicName: "assets/images/default-img/default-profile-pic.jpg"
		},
		createdAt: "Oct 08, 2019",
		updatedAt: "Oct 08, 2019"
	};

	fullUserObjectBeforeFormatter: object = {
		id: 1,
		firstName: "Jack",
		lastName: "Smith",
		username: "jacksmith",
		email: "smith@email.com",
		isAdmin: true,
		isVerified: true,
		profilePic: {
			profilePicName: "www.awesomepic.com"
		},
		createdAt: "2019-10-08T07:45:48.214Z",
		updatedAt: "2019-10-08T07:45:48.214Z"
	};

	userObjectBeforeFormatter: object = {
		id: 1,
		firstName: "John",
		lastName: "Doe",
		username: "johndoe",
		email: "example@email.com",
		isAdmin: false,
		isVerified: false,
		profilePic: null,
		createdAt: "2019-10-08T07:45:48.214Z",
		updatedAt: "2019-10-08T07:45:48.214Z"
	};

	userToSignin = {
		firstName: "John",
		lastName: "Doe",
		username: "myUser",
		email: "example@email.com",
		password: "password",
		passwordConfirmation: "password"
	};
}
