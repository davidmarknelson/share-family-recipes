import { Injectable } from "@angular/core";
import { toast } from "bulma-toast";

@Injectable({
	providedIn: "root"
})
export class ToastService {
	constructor() {}

	successToast(message: string): void {
		toast({
			message,
			type: "is-success",
			dismissible: true,
			duration: 5000,
			position: "top-center",
			closeOnClick: true,
			pauseOnHover: true
		});
	}
}
