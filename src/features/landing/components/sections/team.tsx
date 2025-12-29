import GithubIcon from "@/shared/components/icons/github-icon";
import LinkedInIcon from "@/shared/components/icons/linkedin-icon";
import XIcon from "@/shared/components/icons/x-icon";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/shared/components/ui/card";

interface TeamProps {
  imageUrl: string;
  firstName: string;
  lastName: string;
  positions: string[];
  socialNetworks: SocialNetworkProps[];
}
interface SocialNetworkProps {
  name: string;
  url: string;
}
export const TeamSection = () => {
  const teamList: TeamProps[] = [
    {
      imageUrl: "https://i.pravatar.cc/250?img=58",
      firstName: "Tống Nguyễn",
      lastName: "Thành Đô",
      positions: ["Trưởng Dự Án", "Full Stack Developer"],
      socialNetworks: [
        {
          name: "Github",
          url: "https://github.com",
        },
      ],
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      firstName: "Nguyễn Hồ",
      lastName: "Quốc Bảo",
      positions: ["Backend Developer", "Tích Hợp AI"],
      socialNetworks: [
        {
          name: "Github",
          url: "https://github.com",
        },
      ],
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      firstName: "Phạm Chí",
      lastName: "Cường",
      positions: ["Frontend Developer", "Thiết Kế UI/UX"],
      socialNetworks: [
        {
          name: "Github",
          url: "https://github.com",
        },
      ],
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1573497161161-c3e73707e25c?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      firstName: "Lê Văn",
      lastName: "Huy Hoàng",
      positions: ["Full Stack Developer", "Tích Hợp IoT"],
      socialNetworks: [
        {
          name: "Github",
          url: "https://github.com",
        },
      ],
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1616805765352-beedbad46b2a?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      firstName: "Nguyễn Thượng",
      lastName: "Phong",
      positions: ["Backend Developer", "Chuyên Gia Bảo Mật"],
      socialNetworks: [
        {
          name: "Github",
          url: "https://github.com",
        },
      ],
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      firstName: "Nguyễn Trung",
      lastName: "Kiên",
      positions: ["Cố Vấn Dự Án", "Giảng Viên"],
      socialNetworks: [
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com",
        },
      ],
    },
  ];
  const socialIcon = (socialName: string) => {
    switch (socialName) {
      case "LinkedIn":
        return <LinkedInIcon />;
      case "Github":
        return <GithubIcon />;
      case "X":
        return <XIcon />;
    }
  };

  return (
    <section id="team" className="container lg:w-[75%] py-8 sm:py-12">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          Đội Ngũ
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold">
          Gặp Gỡ Đội Ngũ Lockerly
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {teamList.map(
          (
            { imageUrl, firstName, lastName, positions, socialNetworks },
            index
          ) => (
            <Card
              key={index}
              className="bg-muted/60 dark:bg-card flex flex-col h-full overflow-hidden group/hoverimg"
            >
              <CardHeader className="p-0 gap-0">
                <div className="h-full overflow-hidden">
                  <img
                    src={imageUrl}
                    alt=""
                    width={300}
                    height={300}
                    className="w-full aspect-square object-cover saturate-0 transition-all duration-200 ease-linear size-full group-hover/hoverimg:saturate-100 group-hover/hoverimg:scale-[1.01]"
                  />
                </div>
                <CardTitle className="py-6 pb-4 px-6">
                  {firstName}
                  <span className="text-primary ml-2">{lastName}</span>
                </CardTitle>
              </CardHeader>
              {positions.map((position, index) => (
                <CardContent
                  key={index}
                  className={`pb-0 text-muted-foreground ${
                    index === positions.length - 1 && "pb-6"
                  }`}
                >
                  {position}
                  {index < positions.length - 1 && <span>,</span>}
                </CardContent>
              ))}

              <CardFooter className="space-x-4 mt-auto">
                {socialNetworks.map(({ name, url }, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-all"
                  >
                    {socialIcon(name)}
                  </a>
                ))}
              </CardFooter>
            </Card>
          )
        )}
      </div>
    </section>
  );
};

