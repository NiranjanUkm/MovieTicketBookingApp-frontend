// import React from 'react';
import { Text, Container, ActionIcon, Group } from '@mantine/core';
import { IconBrandTwitter, IconBrandYoutube, IconBrandInstagram } from '@tabler/icons-react';
import logo from '../assets/image1.png'
import './FooterLinks.css';  // Make sure this file exists and is properly styled.

const data = [
  {
    title: 'About',
    links: [
      { label: 'Features', link: '#' },
      { label: 'Pricing', link: '#' },
      { label: 'Support', link: '#' },
      { label: 'Forums', link: '#' },
    ],
  },
  {
    title: 'Project',
    links: [
      { label: 'Contribute', link: '#' },
      { label: 'Media assets', link: '#' },
      { label: 'Changelog', link: '#' },
      { label: 'Releases', link: '#' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Join Discord', link: '#' },
      { label: 'Follow on Twitter', link: '#' },
      { label: 'Email newsletter', link: '#' },
      { label: 'GitHub discussions', link: '#' },
    ],
  },
];

export function FooterLinks() {
  const groups = data.map((group) => {
    const links = group.links.map((link, index) => (
      <Text<'a'>
        key={index}
        className="text-gray-500 hover:text-blue-600 transition duration-200"
        component="a"
        href={link.link}
        onClick={(event) => event.preventDefault()}
      >
        {link.label}
      </Text>
    ));

    return (
      <div className="flex flex-col" key={group.title}>
        <Text className="text-lg font-semibold text-gray-800">{group.title}</Text>
        <div className="flex flex-col space-y-1">{links}</div>
      </div>
    );
  });

  return (
    <footer className="bg-gray-900 text-white py-10">
      <Container className="flex flex-col md:flex-row md:justify-between items-center">
        <div className="flex flex-col items-center md:items-start mb-10 md:mb-0">
        <img src={logo} alt="Logo" width={50} height={50} />
        <Text size="xs pt-3" color="dimmed" className="text-gray-400 mt-2">
            CineHub: An Efficient Movie Ticket Booking Application
          </Text>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
          {groups}
        </div>
      </Container>

      <Container className="flex flex-col sm:flex-row sm:justify-between items-center mt-8 pt-4 border-t border-gray-700">
        <Text size="sm" className="text-gray-500">
          © 2024 CineHub. All rights reserved.
        </Text>

        <Group className="mt-4 sm:mt-0">
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandTwitter size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandYoutube size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandInstagram size={18} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Container>
    </footer>
  );
}

export default FooterLinks;
