import { redirect } from "next/navigation";

import { getSession } from "@acme/auth";

export default async function Page() {
  const session = await getSession();

  if (!session?.user) {
    return redirect("/login");
  }

  return (
    <div>
      <h1>{session.user.name}</h1>
    </div>
  );
}
