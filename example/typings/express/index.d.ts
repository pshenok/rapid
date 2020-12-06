

// tslint:disable-next-line:no-namespace
declare namespace Express {

	// tslint:disable-next-line:interface-name
	export interface Request {
		rawBody?: Buffer;
		auth: {
			sessionId?: string;
			phone?: string | null;
			userId?: string | null;
			counterpartyId?: string | null;
			publicKey?: string | null;
		};
	}
}
