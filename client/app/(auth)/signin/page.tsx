import AuthCard from "@/components/ui/AuthCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function SignInPage(){
    return(
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
            <AuthCard title="Sign In">
                <form className="space-y-4">
                    <Input 
                        type="email"
                        placeholder="Enter you email"
                    />

                    <Input 
                        type="password"
                        placeholder="Enter your password"
                    />
                    
                    <Button>
                        Sign In
                    </Button>
                </form>
            </AuthCard>
        </div>
    )
}