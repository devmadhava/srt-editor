import vine from "@vinejs/vine";

export const RegisterValidator = vine.compile(
    vine.object({
        email: vine
            .string()
            .trim()
            .email()
            .toLowerCase()
            .unique(async (db, value) => {
                const exists = await db
                    .from("users")
                    .where("email", value)
                    .first();
                return !exists;
            }),
        password: vine.string().minLength(8),
        fullName: vine.string().minLength(3),
    })
);

export const LoginValidator = vine.compile(
    vine.object({
        email: vine.string().trim().email().toLowerCase(),
        password: vine.string().minLength(8),
    })
);
