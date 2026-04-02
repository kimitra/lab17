import prisma from "@/app/lib/prisma";
import AddProfileForm from "@/components/AddProfileForm";
import DeleteButton from "@/components/DeleteButton";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function fetchProfile(id) {
  const data = await prisma.profiles.findUnique({
    where: { id: parseInt(id) },
  });
  return data || null;
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  return {
    title: `Edit Profile ${id}`,
    description: `Edit details of profile with ID ${id}`,
  };
}

export default async function EditProfilePage({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const profile = await fetchProfile(id);

  if (!profile) {
    return <p>Profile not found.</p>;
  }

  return (
    <div>
      <h1>Edit Profile {profile.name}</h1>
      <AddProfileForm existingProfile={profile} />
      <DeleteButton profileId={profile.id} />
    </div>
  );
}