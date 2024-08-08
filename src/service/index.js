import { Request } from "@brainspore/transport";
import { APPAPIBASEURL } from "@/environments";
import AuthService  from "@/packages/auth/AuthService";
const _request = new Request(AuthService, APPAPIBASEURL);

export  { _request };