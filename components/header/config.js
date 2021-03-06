import { logout } from 'services/user';
import {
  HOWTO_URL,
  DATA_PORTAL_URL,
  BLOG_URL,
  DEVELOPERS_URL,
} from 'utils/constants';

import gfwPro from 'assets/logos/gfw-pro.png';
import forestWatcher from 'assets/logos/gfw-watcher.png';

import developer from 'assets/icons/developer.svg?sprite';
import howto from 'assets/icons/howto.svg?sprite';
import sgf from 'assets/icons/sgf.svg?sprite';
import openData from 'assets/icons/open-data.svg?sprite';
import blog from 'assets/icons/blog.svg?sprite';
import forum from 'assets/icons/forum.svg?sprite';

export default {
  navMain: [
    {
      label: 'Map',
      href: '/map/[[...location]]',
      as: '/map/global/',
    },
    {
      label: 'Dashboard',
      href: '/dashboards/[[...location]]',
      as: '/dashboards/global/',
    },
    {
      label: 'Topics',
      href: '/topics/',
      submenu: [
        {
          label: 'Biodiversity',
          as: '/topics/biodiversity/',
          href: '/topics/[topic]',
        },
        {
          label: 'Climate',
          as: '/topics/climate/',
          href: '/topics/[topic]',
        },
        {
          label: 'Commodities',
          as: '/topics/commodities/',
          href: '/topics/[topic]',
        },
        {
          label: 'Water',
          as: '/topics/water/',
          href: '/topics/[topic]',
        },
        {
          label: 'Fires',
          as: '/topics/fires/',
          href: '/topics/[topic]',
        },
      ],
    },
    {
      label: 'Blog',
      extLink: BLOG_URL,
    },
    {
      label: 'About',
      href: '/about/',
    },
    {
      label: 'Help',
      extLink: '/help/',
    },
  ],
  myGfwLinks: [
    {
      label: 'My subscriptions',
      extLink: '/my-gfw/subscriptions',
    },
    {
      label: 'My profile',
      href: '/my-gfw',
    },
    {
      label: 'Logout',
      extLink: '/auth/logout',
      onSelect: (e) => {
        e.preventDefault();
        logout();
      },
    },
  ],
  apps: [
    {
      label: 'GFW Pro',
      extLink: 'https://pro.globalforestwatch.org',
      image: gfwPro,
    },
    {
      label: 'Forest Watcher',
      extLink: 'http://forestwatcher.globalforestwatch.org',
      image: forestWatcher,
    },
  ],
  moreLinks: [
    {
      label: 'Developer Tools',
      extLink: DEVELOPERS_URL,
      icon: developer,
    },
    {
      label: 'How to Portal',
      extLink: HOWTO_URL,
      icon: howto,
    },
    {
      label: 'Grants & Fellowships',
      href: '/grants-and-fellowships',
      icon: sgf,
    },
    {
      label: 'Open data portal',
      extLink: DATA_PORTAL_URL,
      icon: openData,
    },
    {
      label: 'Blog',
      extLink: BLOG_URL,
      icon: blog,
    },
    {
      label: 'Discussion Forum',
      extLink: 'https://groups.google.com/forum/#!forum/globalforestwatch',
      icon: forum,
    },
  ],
};
