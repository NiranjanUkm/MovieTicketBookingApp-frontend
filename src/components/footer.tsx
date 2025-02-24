// Removed unused React import
import { Text, ActionIcon, Group, Title, Divider } from "@mantine/core"; // Removed Container
import {
  IconBrandTwitter,
  IconBrandYoutube,
  IconBrandInstagram,
  IconMail,
  IconPhone,
} from "@tabler/icons-react";
import { useTheme } from "../components/ThemeContext";
import logo from "../assets/image1.png";

const data = [
  {
    title: "About",
    links: [
      { label: "Features", link: "#" },
      { label: "Pricing", link: "#" },
      { label: "Support", link: "#" },
      { label: "Forums", link: "#" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "Contribute", link: "#" },
      { label: "Media assets", link: "#" },
      { label: "Changelog", link: "#" },
      { label: "Releases", link: "#" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Join Discord", link: "#" },
      { label: "Follow on Twitter", link: "#" },
      { label: "Email newsletter", link: "#" },
      { label: "GitHub discussions", link: "#" },
    ],
  },
];

export function FooterLinks() {
  const { theme } = useTheme();

  const groups = data.map((group) => {
    const links = group.links.map((link, index) => (
      <Text<"a">
        key={index}
        className={`text-sm font-medium ${
          theme === "light"
            ? "text-gray-700 hover:text-teal-600"
            : "text-gray-200 hover:text-teal-400"
        } transition-colors duration-200`}
        component="a"
        href={link.link}
        onClick={(event) => event.preventDefault()}
      >
        {link.label}
      </Text>
    ));

    return (
      <div className="flex flex-col" key={group.title}>
        <Text
          className={`text-lg font-semibold ${
            theme === "light" ? "text-gray-900" : "text-white"
          } mb-2`}
        >
          {group.title}
        </Text>
        <div className="flex flex-col gap-2">{links}</div>
      </div>
    );
  });

  return (
    <footer
      className={`w-full py-12 ${
        theme === "light" ? "bg-gray-100" : "bg-gray-900"
      }`}
      style={{
        backgroundImage:
          theme === "light"
            ? "radial-gradient(circle at 10px 10px, #e5e7eb 1px, transparent 1px)"
            : "radial-gradient(circle at 10px 10px, #6b7280 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-12">
          {/* Logo and Info */}
          <div className="flex flex-col items-center md:items-start">
            <img src={logo} alt="CineHub Logo" width={70} height={70} />
            <Title
              order={2}
              c={theme === "light" ? "teal.7" : "teal.4"}
              fw={700}
              mt="md"
            >
              CineHub
            </Title>
            <Text
              size="sm"
              c={theme === "light" ? "gray.7" : "gray.2"}
              className="text-center md:text-left mt-2 max-w-xs"
            >
              Your ultimate movie ticket booking experience—fast, easy, and cinematic.
            </Text>
            <Group mt="md" gap="lg">
              <ActionIcon
                size="lg"
                color="gray"
                variant="transparent"
                className={theme === "light" ? "text-gray-600" : "text-gray-300"}
              >
                <IconMail size={20} />
              </ActionIcon>
              <Text
                size="sm"
                c={theme === "light" ? "gray.7" : "gray.2"}
              >
                support@cinehub.com
              </Text>
              <ActionIcon
                size="lg"
                color="gray"
                variant="transparent"
                className={theme === "light" ? "text-gray-600" : "text-gray-300"}
              >
                <IconPhone size={20} />
              </ActionIcon>
              <Text
                size="sm"
                c={theme === "light" ? "gray.7" : "gray.2"}
              >
                +91 944-727-7118
              </Text>
            </Group>
          </div>

          {/* Link Groups */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center sm:text-left">
            {groups}
          </div>
        </div>

        {/* Bottom Section */}
        <Divider
          my="lg"
          color={theme === "light" ? "gray.2" : "gray.6"}
          className="mt-12"
        />
        <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-6">
          <Text
            size="sm"
            c={theme === "light" ? "gray.6" : "gray.3"}
            className="text-center sm:text-left"
          >
            © 2025 CineHub. All rights reserved.
          </Text>

          <Group gap="xl">
            <ActionIcon
              size="xl"
              color={theme === "light" ? "teal" : "teal"}
              variant="subtle"
              className={`${
                theme === "light"
                  ? "hover:bg-teal-100 hover:text-teal-700"
                  : "hover:bg-teal-800 hover:text-teal-300"
              } transition-colors`}
            >
              <IconBrandTwitter size={24} stroke={1.5} />
            </ActionIcon>
            <ActionIcon
              size="xl"
              color={theme === "light" ? "teal" : "teal"}
              variant="subtle"
              className={`${
                theme === "light"
                  ? "hover:bg-teal-100 hover:text-teal-700"
                  : "hover:bg-teal-800 hover:text-teal-300"
              } transition-colors`}
            >
              <IconBrandYoutube size={24} stroke={1.5} />
            </ActionIcon>
            <ActionIcon
              size="xl"
              color={theme === "light" ? "teal" : "teal"}
              variant="subtle"
              className={`${
                theme === "light"
                  ? "hover:bg-teal-100 hover:text-teal-700"
                  : "hover:bg-teal-800 hover:text-teal-300"
              } transition-colors`}
            >
              <IconBrandInstagram size={24} stroke={1.5} />
            </ActionIcon>
          </Group>
        </div>
      </div>
    </footer>
  );
}

export default FooterLinks;