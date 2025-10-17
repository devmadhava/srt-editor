import env from "#start/env";
import { defineConfig, services } from "@adonisjs/ally";

// const allyConfig = defineConfig({
//     google: services.google({
//       clientId: env.get('GOOGLE_CLIENT_ID'),
//       clientSecret: env.get('GOOGLE_CLIENT_SECRET'),
//       callbackUrl: '',
//     }),
// });

const allyConfigObject: Record<string, any> = {};
if (env.get("GOOGLE_CLIENT_ID")) {
    allyConfigObject.google = services.google({
        clientId: env.get("GOOGLE_CLIENT_ID", ""),
        clientSecret: env.get("GOOGLE_CLIENT_SECRET", ""),
        callbackUrl: env.get("GOOGLE_REDIRECT_URI", ""),
    });
}
const allyConfig = defineConfig(allyConfigObject);

export default allyConfig;

declare module "@adonisjs/ally/types" {
    interface SocialProviders extends InferSocialProviders<typeof allyConfig> {}
}
