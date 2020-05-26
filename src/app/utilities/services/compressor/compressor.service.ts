import { Injectable, EventEmitter } from "@angular/core";
import { Observable } from "rxjs";
// compressor
import Compressor from "compressorjs";

@Injectable({
	providedIn: "root"
})
export class CompressorService {
	constructor() {}

	compressImage(file: File): Observable<File> {
		const emitter = new EventEmitter<File>();
		const compressor = new Compressor(file, {
			quality: 0.5,
			success(blobResult) {
				const compressedFile = new File([blobResult], file.name, {
					type: file.type,
					lastModified: Date.now()
				});
				emitter.emit(compressedFile);
			},
			error(err) {}
		});
		return emitter.asObservable();
	}
}
