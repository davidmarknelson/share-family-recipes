import {
	Component,
	OnInit,
	Input,
	ChangeDetectionStrategy
} from "@angular/core";
import { EmailVerificationService } from "@services/email-verification/email-verification.service";
import { BehaviorSubject, Observable } from "rxjs";

const enum EmailStatus {
	DEFAULT = "Default",
	SUCCESS = "Success",
	ERROR = "Error",
	SENDING = "Sending"
}

@Component({
	selector: "app-email-message",
	templateUrl: "./email-message.component.html",
	styleUrls: ["./email-message.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailMessageComponent implements OnInit {
	@Input() email: string;
	emailError: string;
	emailStatus = new BehaviorSubject(EmailStatus.DEFAULT);
	emailStatus$: Observable<EmailStatus> = this.emailStatus.asObservable();

	constructor(private emailService: EmailVerificationService) {}

	ngOnInit() {}

	sendVerificationEmail() {
		this.emailStatus.next(EmailStatus.SENDING);
		this.emailService.sendVerificationEmail(this.email).subscribe(
			res => this.emailStatus.next(EmailStatus.SUCCESS),
			err => {
				this.emailError = err.error.message;
				this.emailStatus.next(EmailStatus.ERROR);
			}
		);
	}
}
