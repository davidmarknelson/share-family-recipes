import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { EmailMessageComponent } from "./email-message.component";
import { EmailVerificationService } from "@services/email-verification/email-verification.service";
import { of, throwError } from "rxjs";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";

let fixture: ComponentFixture<EmailMessageComponent>;
let defaultMsg: DebugElement;
let emailSending: DebugElement;
let successMsg: DebugElement;
let errorMsg: DebugElement;
let sendEmailLink: DebugElement;

function selectElements() {
	defaultMsg = fixture.debugElement.query(By.css("[data-test=emailVerifyMsg]"));
	emailSending = fixture.debugElement.query(By.css("[data-test=emailSending]"));
	successMsg = fixture.debugElement.query(
		By.css("[data-test=emailVerifySuccess]")
	);
	errorMsg = fixture.debugElement.query(By.css("[data-test=emailVerifyError]"));
	sendEmailLink = fixture.debugElement.query(
		By.css("[data-test='sendEmailLink']")
	);
}

class MockEmailVerificationService {
	sendVerificationEmail() {
		return of();
	}
}

describe("EmailMessageComponent", () => {
	let component: EmailMessageComponent;
	let emailVerificationService: EmailVerificationService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [EmailMessageComponent],
			providers: [
				{
					provide: EmailVerificationService,
					useClass: MockEmailVerificationService
				}
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(EmailMessageComponent);
		component = fixture.componentInstance;
		emailVerificationService = fixture.debugElement.injector.get(
			EmailVerificationService
		);
		component.email = "email@email.com";
	});

	it("should create", () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	describe("initialization", () => {
		it("should show the default message", () => {
			fixture.detectChanges();
			selectElements();

			expect(defaultMsg).toBeTruthy();
		});
	});

	describe("sending verification email", () => {
		it("should show the loader when link is clicked", () => {
			spyOn(component, "sendVerificationEmail").and.callThrough();
			fixture.detectChanges();
			selectElements();

			sendEmailLink.nativeElement.click();
			fixture.detectChanges();
			selectElements();

			expect(emailSending).toBeTruthy();
		});
	});

	describe("email successfully sent", () => {
		beforeEach(() => {
			spyOn(component, "sendVerificationEmail").and.callThrough();
			spyOn(
				emailVerificationService,
				"sendVerificationEmail"
			).and.callFake(() =>
				of({ message: "Email has successfully been sent." })
			);
			fixture.detectChanges();
			selectElements();

			sendEmailLink.nativeElement.click();
			fixture.detectChanges();
			selectElements();
		});

		it("should show a success message", () => {
			expect(successMsg).toBeTruthy();
			expect(emailVerificationService.sendVerificationEmail).toHaveBeenCalled();
		});

		it("should resend the message when the send email link is clicked in the success message", () => {
			expect(successMsg).toBeTruthy();
			sendEmailLink.nativeElement.click();
			fixture.detectChanges();
			expect(
				emailVerificationService.sendVerificationEmail
			).toHaveBeenCalledTimes(2);
		});
	});

	describe("email error", () => {
		beforeEach(() => {
			spyOn(component, "sendVerificationEmail").and.callThrough();
			spyOn(emailVerificationService, "sendVerificationEmail").and.callFake(
				() =>
					throwError({
						error: {
							message: "There was an error sending the email."
						}
					})
			);
			fixture.detectChanges();
			selectElements();

			sendEmailLink.nativeElement.click();
			fixture.detectChanges();
			selectElements();
		});

		it("should show an error message", () => {
			expect(errorMsg).toBeTruthy();
			expect(emailVerificationService.sendVerificationEmail).toHaveBeenCalled();
		});

		it("should resend the message when the send email link is clicked in the error message", () => {
			expect(errorMsg).toBeTruthy();
			sendEmailLink.nativeElement.click();
			fixture.detectChanges();
			expect(
				emailVerificationService.sendVerificationEmail
			).toHaveBeenCalledTimes(2);
		});
	});
});
