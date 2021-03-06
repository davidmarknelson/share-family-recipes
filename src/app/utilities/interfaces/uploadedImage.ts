export interface UploadedImage {
	access_mode: string;
	bytes: number;
	created_at: string;
	etag: string;
	format: string;
	height: number;
	width: number;
	original_extension: string;
	original_filename: string;
	placeholder: boolean;
	public_id: string;
	resource_type: string;
	secure_url: string;
	signature: string;
	tags: Array<string>;
	type: string;
	url: string;
	version: number;
	delete_token: string;
}
