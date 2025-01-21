import type { Metadata } from "next";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";

import { ResetPasswordForm } from "@/app/(auth)/_components/reset-password-form";

export const metadata: Metadata = {
  title: "Esqueci a Senha",
  description: "Insira seu e-mail para redefinir sua senha",
};

export default function ForgotPasswordPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Redefinir senha</CardTitle>
        <CardDescription>
          Digite a nova senha e confirme-a para redefinir sua senha
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm />
      </CardContent>
    </Card>
  );
}
