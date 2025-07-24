import type { UserResponseDTO } from "../../types/UserDTO";

const UserImmutableData = ({user}: {user: UserResponseDTO}) => {
    return (
        <section className="w-full">
          <ul className="pt-4 space-y-2 flex flex-col items-center">
            <li className="border border-gray-300 rounded-md px-4 py-2 w-80">
              <div className="flex justify-between">
                <span className="font-medium">E-mail:</span>
                <span>{user.email}</span>
              </div>
            </li>
            <li className="border border-gray-300 rounded-md px-4 py-2 w-80">
              <div className="flex justify-between">
                <span className="font-medium">Role:</span>
                <span>{user.role}</span>
              </div>
            </li>
            <li className="border border-gray-300 rounded-md px-4 py-2 w-80">
              <div className="flex justify-between">
                <span className="font-medium">Account enabled:</span>
                <span>{user.enabled ? "Yes" : "No"}</span>
              </div>
            </li>
          </ul>
        </section>
    );

};

export default UserImmutableData;