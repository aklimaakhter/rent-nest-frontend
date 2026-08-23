import UpdatePropertyForm from "../../_components/updatePropertyForm";


export default function EditPropertyPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Property</h1>
      <UpdatePropertyForm />
    </div>
  );
}