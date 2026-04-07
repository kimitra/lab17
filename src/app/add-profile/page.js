import AddProfileForm from "@/components/AddProfileForm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function AddProfilePage() {
  return (
    <main>
      <h1>Add Profile</h1>
      <AddProfileForm />
    </main>
  );
}