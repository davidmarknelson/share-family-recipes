import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EmailMessageComponent } from "./email-message.component";

@NgModule({
	declarations: [EmailMessageComponent],
	imports: [CommonModule],
	exports: [EmailMessageComponent]
})
export class EmailMessageModule {}
