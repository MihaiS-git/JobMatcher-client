import type { CustomerDetailDTO } from "@/types/CustomerDTO";
import type { FreelancerDetailDTO } from "@/types/FreelancerDTO";

type CustomerProfileProps = {
  type: "customer";
  profile: CustomerDetailDTO;
};

type FreelancerProfileProps = {
  type: "freelancer";
  profile: FreelancerDetailDTO;
};

const ProfileData = ({
  type,
  profile,
}: CustomerProfileProps | FreelancerProfileProps) => {
  console.log("profile data:", profile);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-md">
      <div className="flex justify-center w-full md:w-auto">
        <img
          className="m-4 w-80 h-80 object-cover"
          src={profile.pictureUrl || "user_icon.png"}
          alt="User profile picture"
          aria-label="user-profile-picture"
          fetchPriority="high"
        />
      </div>
      <div className="flex flex-col items-center w-full mb-8">
        <h2 className="text-2xl font-bold mb-4 e-full text-center">
          {profile.username}
        </h2>
        <section className="flex flex-col items-start w-full px-4">
          <p>Rating: {profile.rating}</p>
          {type === "customer" && (
            <p>
              <span className="font-bold">Company: </span>
              {profile.company}
            </p>
          )}
          {type === "freelancer" && (
            <p>
              <span className="font-bold">Headline: </span>
              {profile.headline}
            </p>
          )}

          <p>
            <span className="font-bold">About: </span>
            {profile.about}
          </p>

          <p>
            <span className="font-bold">Languages: </span>
            {profile.languages.map((l) => l.name).join(", ")}
          </p>

          {type === "freelancer" && (
            <>
              <p>
                <span className="font-bold">Skills: </span>
                {profile.skills.map((s) => s.name).join(", ")}
              </p>
              <p>
                <span className="font-bold">Experience Level: </span>
                {profile.experienceLevel}
              </p>
              <p>
                Project Categories:{" "}
                {profile.jobSubcategories.map((c) => c.name).join(", ")}
              </p>
              <p>
                <span className="font-bold">Hourly Rate: </span>$
                {profile.hourlyRate}
              </p>
              <p>
                <span className="font-bold">Available for Hire: </span>
                {profile.availableForHire ? "Yes" : "No"}
              </p>
            </>
          )}

          <p>
            <span className="font-bold">Website: </span>
            <a href={profile.websiteUrl} className="text-blue-500 hover:underline">{profile.websiteUrl}</a>
          </p>
          <div>
            <span className="font-bold">Social Media: </span>
            <ul>
              {profile.socialMedia.map((link, index) => (
                <li key={index}>
                  <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfileData;
