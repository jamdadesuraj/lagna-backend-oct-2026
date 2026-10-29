import { MenuItemType } from '@/types/menu'

export const MENU_ITEMS: MenuItemType[] = [
  {
    key: 'general',
    label: 'GENERAL',
    isTitle: true,
  },
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: 'solar:widget-5-bold-duotone',
    url: '/dashboard',
  },
  {
    key: 'payment',
    label: 'Payment Details',
    isTitle: true,
  },

  {
    key: 'subscribed-members',
    label: 'Subscribed Members',
    icon: 'solar:users-group-rounded-bold-duotone',
    url: '/payment/subscribed-members',
  },

  {
    key: 'biodata-payments',
    label: 'Biodata Payments',
    icon: 'solar:document-text-bold-duotone',
    url: '/payment/biodata-payments',
  },

  {
    key: 'spotlight-payments',
    label: 'Spotlight Payments',
    icon: 'solar:star-bold-duotone',
    url: '/payment/spotlight-payments',
  },

  {
    key: 'kundali-payments',
    label: 'Kundali Payments',
    icon: 'solar:stars-bold-duotone',
    url: '/payment/kundali-payments',
  },
  {
    key: 'profile',
    label: 'Profile',
    isTitle: true,
  },
  {
    key: 'profile-management',
    label: 'Profile Management',
    icon: 'solar:user-id-bold-duotone',
    url: '/profiles',
  },
  {
    key: 'profile-verification',
    label: 'Profile Verification',
    icon: 'solar:shield-check-bold-duotone',
    url: '/profile-verification',
  },
  {
    key: 'profile-Block',
    label: 'Report / Block Profile',
    icon: 'solar:shield-warning-bold-duotone',
    url: '/report-profile',
  },
  {
    key: 'app-review',
    label: 'App Review',
    icon: 'solar:star-bold-duotone',
    url: '/app-review',
  },

  {
    key: 'list',
    label: 'Droupdown List',
    isTitle: true,
  },

  {
    key: 'religion',
    label: 'Religion',
    icon: 'solar:widget-5-bold-duotone',
    url: '/religion',
  },

  {
    key: 'mother-tongue',
    label: 'Mother Tongue',
    icon: 'solar:chat-round-line-bold-duotone',
    url: '/mother-tongue',
  },
  {
    key: 'qualification',
    label: 'Qualification',
    icon: 'solar:diploma-bold-duotone',
    url: '/qualification',
  },

  {
    key: 'height',
    label: 'Height',
    icon: 'solar:ruler-bold-duotone',
    url: '/height',
  },

  {
    key: 'annual-income',
    label: 'Annual Income',
    icon: 'solar:wallet-money-bold-duotone',
    url: '/annual-income',
  },
  {
    key: 'occupation',
    label: 'Occupation',
    icon: 'solar:case-round-minimalistic-bold-duotone',
    url: '/occupation',
  },

  {
    key: 'app-info',
    label: 'App Info',
    isTitle: true,
  },

  {
    key: 'onboarding',
    label: 'Onboarding',
    icon: 'solar:clipboard-list-bold-duotone',
    url: '/onboarding',
  },
  {
    key: 'packages',
    label: 'Packages',
    icon: 'solar:crown-bold-duotone',
    url: '/packages',
  },
  {
    key: 'faqs',
    label: 'FAQs',
    icon: 'solar:question-circle-bold-duotone',
    url: '/faqs',
  },
  {
    key: 'help-center',
    label: 'Help Center',
    icon: 'solar:question-circle-bold-duotone',
    url: '/help-center',
  },
  {
    key: 'online-personal-tips',
    label: 'Online Personal Tips',
    icon: 'solar:notes-bold-duotone',
    url: '/online-personal-tips',
  },
  {
    key: 'success-stories',
    label: 'Success Stories',
    icon: 'solar:users-group-rounded-bold-duotone',
    url: '/success-stories',
  },
  {
    key: 'privacy-policy',
    label: 'Privacy Policy',
    icon: 'solar:shield-check-bold-duotone',
    url: '/privacy-policy',
  },
  {
    key: 'terms-conditions',
    label: 'Terms & Conditions',
    icon: 'solar:document-text-bold-duotone',
    url: '/terms',
  },

  {
    key: 'web-info',
    label: 'Web Info',
    isTitle: true,
  },
  {
    key: 'hero-banner',
    label: 'Hero Banner',
    icon: 'solar:gallery-bold-duotone',
    url: '/hero-banner',
  },
  {
    key: 'biodata-templates',
    label: 'Biodata Templates',
    icon: 'solar:document-add-bold-duotone',
    url: '/biodata-templates',
  },
  {
    key: 'download-apk',
    label: 'Download APK',
    icon: 'solar:download-square-bold-duotone',
    url: '/download-apk',
  },

  {
    key: 'about',
    label: 'About Us',
    icon: 'solar:info-circle-bold-duotone',
    url: '/about',
  },

  {
    key: 'counter',
    label: 'Counter',
    icon: 'solar:chart-square-bold-duotone',
    url: '/counter',
  },

  {
    key: 'careers',
    label: 'Careers',
    icon: 'solar:suitcase-bold-duotone',
    url: '/careers',
  },

  {
    key: 'job-openings',
    label: 'Job Openings',
    icon: 'solar:case-round-bold-duotone',
    url: '/job-openings',
  },

  {
    key: 'blog',
    label: 'Blogs',
    icon: 'solar:document-text-bold-duotone',
    url: '/blog',
  },

  {
    key: 'fraud-report',
    label: 'Fraud Alert',
    icon: 'solar:shield-warning-bold-duotone',
    url: '/fraud-report',
  },

  {
    key: 'contact-us',
    label: 'Contact Us',
    icon: 'solar:phone-calling-bold-duotone',
    url: '/contact-us',
  },
  {
    key: 'settings',
    label: 'Settings',
    isTitle: true,
  },

  {
    key: 'app-settings',
    label: 'App Settings',
    icon: 'solar:smartphone-bold-duotone',
    url: '/app-settings',
  },

  {
    key: 'web-settings',
    label: 'Web Settings',
    icon: 'solar:monitor-bold-duotone',
    url: '/web-settings',
  },

  {
    key: 'general-settings',
    label: 'General Settings',
    icon: 'solar:settings-bold-duotone',
    url: '/general-settings',
  },

  {
    key: 'gateway-settings',
    label: 'Gateway Settings',
    icon: 'solar:card-2-bold-duotone',
    url: '/gateway-settings',
  },
]
