import { api, HydrateClient } from "@/trpc/server";
import { EmployeeDetails } from "./_components/employee-details";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  void api.employee.getById.prefetch({
    employeeId: id,
  });

  return (
    <HydrateClient>
      <EmployeeDetails />
    </HydrateClient>
  );
}
