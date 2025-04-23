
export class HubSpotService {
  public constructor() {}

  public async createContact(
    email: string,
    properties: { [key: string]: string }
  ) {
    // Not Implemented
  }

  public async createOrUpdateContact(
    email: string,
    properties: { [key: string]: string }
  ) {
    // Not Implemented
  }

  public async updateContactProperties(
    id: string,
    properties: { [key: string]: string }
  ) {
    // Not Implemented
  }

  public async getContactPropertiesByEmail(
    email: string,
    properties: string[]
  ) {
    return {
      devmatch_valid_license_expiry_date: "2024-10-10",
      devmatch_valid_license: "true",
      hs_object_id: "0",
    };
  }

  public async getPortalId() {
    // Not Implemented
  }

  public async getDeals() {
    // Not Implemented
  }
}
