import { redirect } from "next/navigation";

export default function AdminSurveyRedirectPage() {
  redirect("/admin/surveys");
}
