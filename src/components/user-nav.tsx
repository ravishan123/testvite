import { SignedIn, UserButton } from "@clerk/clerk-react";

export function UserNav() {
  return (
    <SignedIn>
      <UserButton />
    </SignedIn>
  );
}
