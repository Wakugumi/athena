import { ContentTypes, CreatePhotonoteRequest } from "@athena/types";

export class CreatePhotonoteDto implements CreatePhotonoteRequest {
  contentType: ContentTypes;

}
