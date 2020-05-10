import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { PageTitleComponent } from "@partials/page-title/page-title.component";

describe("PageTitleComponent", () => {
	let component: PageTitleComponent;
	let fixture: ComponentFixture<PageTitleComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PageTitleComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PageTitleComponent);
		component = fixture.componentInstance;
	});

	it("should create", () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});
});
