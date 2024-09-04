import { SignedOut, SignIn, useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Loader from "@/components/loader";

export default function Login() {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/");
    }
  }, [isSignedIn, navigate]);

  if (!isLoaded) {
    return <Loader />;
  }
  return (
    <div className="login-container">
      <main>
        <div className="container grid h-svh flex-col items-center justify-center lg:max-w-none lg:px-0">
          <div className="mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8 login-card">
            <div className="mb-4 flex items-center justify-center">
              <SignedOut>
                <SignIn
                  appearance={{
                    elements: {
                      footer: { display: "none" },

                      formButtonPrimary: {
                        borderRadius: "400px !important",
                      },
                    },
                  }}
                />
              </SignedOut>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
