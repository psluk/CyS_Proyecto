export default function UserLayout({ user }) {
  return (
    <div className="relative flex items-center">
      <img className="h-10 w-10 rounded-full" src={user?.ImageUser? user.ImageUser: "/default/no-image.jpeg"} alt="" />
      <span className="ml-2 block text-gray-500 ">
        {user? `${user?.GivenName} ${user?.FamilyName}` : "Cargando..."}
      </span>
    </div>
  );
}
