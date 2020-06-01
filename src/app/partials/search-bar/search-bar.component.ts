import {
	Component,
	OnInit,
	ViewChild,
	ElementRef,
	EventEmitter,
	Output
} from "@angular/core";
import { SearchesService } from "@services/searches/searches.service";
import { AutocompleteItems } from "@interfaces/autocomplete-items";
import { FormBuilder, FormGroup } from "@angular/forms";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Router } from "@angular/router";
import {
	switchMap,
	debounceTime,
	tap,
	share,
	distinctUntilChanged
} from "rxjs/operators";
import { of, Observable, iif } from "rxjs";

@Component({
	selector: "app-search-bar",
	templateUrl: "./search-bar.component.html",
	styleUrls: ["./search-bar.component.scss"]
})
export class SearchBarComponent implements OnInit {
	@ViewChild("name", { static: true }) nameInput: ElementRef;
	faSearch = faSearch;
	highlightedIndex: number = -1;
	autocompleteItems: Array<AutocompleteItems> = [];
	@Output() completeSearch = new EventEmitter<boolean>(false);

	form: FormGroup = this.fb.group({ name: "" });
	recipes$: Observable<AutocompleteItems[]> = this.name.valueChanges.pipe(
		debounceTime(300),
		distinctUntilChanged(),
		switchMap(val =>
			iif(() => val.length, this.searchesService.recipesByName(val, 10), of([]))
		),
		tap(items => (this.autocompleteItems = items)),
		share()
	);

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private searchesService: SearchesService
	) {}

	ngOnInit() {
		this.nameInput.nativeElement.focus();
	}

	get name() {
		return this.form.get("name");
	}

	onArrowDown(): void {
		this.highlightedIndex =
			this.highlightedIndex === this.autocompleteItems.length - 1
				? 0
				: this.highlightedIndex + 1;

		this.name.patchValue(this.autocompleteItems[this.highlightedIndex].name, {
			emitEvent: false
		});
	}

	onArrowUp(event: Event): void {
		// stop cursor from going to beginning of input field
		event.preventDefault();

		this.highlightedIndex =
			this.highlightedIndex <= 0
				? this.autocompleteItems.length - 1
				: this.highlightedIndex - 1;

		this.name.patchValue(this.autocompleteItems[this.highlightedIndex].name, {
			emitEvent: false
		});
	}

	onEscape() {
		this.completeSearch.emit(true);
	}

	chooseSearchItem(id: number) {
		this.router.navigate(["/recipes", id]);
		this.completeSearch.emit(true);
	}

	onSubmit(): void {
		this.router.navigate(["/recipes", this.name.value]);
		this.completeSearch.emit(true);
	}
}
