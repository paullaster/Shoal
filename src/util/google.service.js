export class GoogleServices {
    // Constructor for GoogleServices
    constructor(url, apiKey, clientId =null, scopes = null) {
        this.url = url;
        this.clientId = clientId;
        this.apiKey = apiKey;
        this.scopes = scopes;
    }
    async geocodingService(query) {
        const url = `${this.url}/geocode/json?${query}&key=${this.apiKey}`;
        const response = await fetch(url);
        return response.json();
    }
}