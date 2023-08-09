const CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

// Auth

type AuthCredentials = {
    access_token: string;
    expires_in: number;
    token_type: string;
};

async function authApp(): Promise<AuthCredentials> {
    const res = await fetch(
        `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`,
        {
            method: "POST",
        }
    );
    const data: AuthCredentials = await res.json();
    return data;
}

const { access_token, expires_in, token_type } = await authApp();


