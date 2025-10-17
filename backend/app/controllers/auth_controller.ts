import type { HttpContext } from "@adonisjs/core/http";
import User from "#models/user";
import { LoginValidator, RegisterValidator } from "#validators/auth";
import { GoogleScopes, RedirectRequestContract } from "@adonisjs/ally/types";

export default class AuthController {
    public async register({ request, response }: HttpContext) {
        const data = await request.validateUsing(RegisterValidator);
        const user = await User.create({...data, authType: 'email'});
        // return response.created(user);
        const token = await User.accessTokens.create(user);
        return response.ok({
            token: token,
            ...user.serialize(),
        });
    }

    public async login({ request, response }: HttpContext) {
        const { email, password } = await request.validateUsing(LoginValidator);
        const user = await User.verifyCredentials(email, password);
        if (user.authType !== "email") {
            return response.unauthorized("Please log in using Google.");
        }

        const token = await User.accessTokens.create(user);
        return response.ok({
            token: token,
            ...user.serialize(),
        });
    }

    public async googleRedirect({ ally, response }: HttpContext) {
        if (!ally.config.google) {
            return response.badRequest({
                message: 'Google Auth is not initialized.',
            })
        }

        return ally.use("google").redirect((request: RedirectRequestContract<GoogleScopes>) => {
            request
                .clearParam('redirect_uri')
                .param('redirect_uri', 'http://localhost:3333/google/callback')
        });
    }

    public async googleCallback({ ally, response }: HttpContext) {
        if (!ally.config.google) {
            return response.badRequest({
                message: 'Google Auth is not initialized.',
            })
        }
        
        const gl = ally.use("google");
        if (gl.accessDenied()) {
            return "You have cancelled the login process";
        }

        if (gl.stateMisMatch()) {
            return "We are unable to verify the request. Please try again";
        }

        if (gl.hasError()) {
            return gl.getError()
        }
        
        const glUser = await gl.user();
        let user = await User.findBy('email', glUser.email);

        if (!user) {
            user = await User.create({
                email: glUser.email,
                fullName: glUser.name,
                googleId: glUser.id,
                authType: "google",
                password: null,
            })
        } else if (user.authType !== "google") {
            return response.unauthorized("This email is registered with a password. Please log in using your password.");
        }

        const token = await User.accessTokens.create(user);
        return response.ok({
            token: token,
            ...user.serialize(),
        });
    }
}
