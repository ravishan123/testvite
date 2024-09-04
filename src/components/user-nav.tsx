import { SignedIn, UserButton } from "@clerk/clerk-react";

export function UserNav() {
  return (
    <SignedIn>
      <UserButton
        appearance={{
          elements: {
            formField__emailAddress: { display: "none" },
          },
        }}
      />
    </SignedIn>
  );
}
