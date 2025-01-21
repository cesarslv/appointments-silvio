import { getSession } from "@acme/auth";

export default async function Page() {
  const session = await getSession();
  return (
    <div>
      <h1>{session?.user.name}</h1>
    </div>
  );
}
