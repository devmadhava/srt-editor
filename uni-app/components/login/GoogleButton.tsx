import GoogleLogo from "../../assets/google.png";

interface GoogleLoginButtonProps {
    active: boolean;
}

export default function GoogleLoginButton({ active }: GoogleLoginButtonProps) {
    if (!active) return null;

    return (
        <button className="btn btn-outline btn-primary w-full flex items-center gap-2">
            <img src={GoogleLogo} alt="Google Logo" className="w-5 h-5" />
            Sign in with Google
        </button>
    );
}
