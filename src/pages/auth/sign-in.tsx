import { useEffect } from "react";
import { RedirectToSignIn, SignedOut, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const { isSignedIn } = useAuth(); // Get the signed-in status
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/"); // Redirect to the dashboard or any other route after login
    }
  }, [isSignedIn, navigate]);

  return (
    <div>
      <header>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </header>

      <main>
        {/* You can add any additional content or components here if needed */}
      </main>
    </div>
  );
}
