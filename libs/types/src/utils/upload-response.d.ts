export type UploadInstructionResponse = {
    uploadId: string;
    upload: {
        url: string;
        method: "PUT" | "POST";
        headers?: Record<string, string>;
        formFields?: Record<string, string>;
    };
    complete?: {
        url: string;
        method: "POST" | "PUT";
    };
    finalUrl: string;
};
