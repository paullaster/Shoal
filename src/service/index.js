import { Request } from "@brainspore/transport";
import { appApiBaseUrl } from "@/environments";
import AuthService  from "@/packages/auth/AuthService";
const _request = new Request(AuthService, appApiBaseUrl);

export  { _request };