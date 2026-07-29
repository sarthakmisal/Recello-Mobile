import { Component } from '@angular/core';
import { Location } from '@angular/common';

interface PolicyGroup { label: string; intro?: string; items: string[]; }
interface PolicySection {
  title: string; body?: string; intro?: string; items?: string[]; groups?: PolicyGroup[]; footer?: string;
}

const PRIVACY_SECTIONS: PolicySection[] = [
  {
    title: '1. Introduction',
    body: "Recello respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use Recello's website, mobile application, and services."
  },
  {
    title: '2. Information We Collect',
    groups: [
      {
        label: 'Personal Information',
        items: [
          'Full Name', 'Mobile Number', 'Email Address', 'Residential Address',
          'Government-issued identification details, if required',
          'Payment and bank details', 'Device information for buyback and resale transactions'
        ]
      },
      {
        label: 'Device Information',
        intro: 'When selling a device through Recello, we may collect:',
        items: ['Device model and specifications', 'IMEI/Serial Number', 'Device condition details', 'Diagnostic information']
      }
    ]
  },
  {
    title: '3. How We Use Your Information',
    intro: 'We use your information to:',
    items: [
      'Process device buyback transactions', 'Verify ownership and identity', 'Arrange pickups and deliveries',
      'Process payments', 'Provide customer support', 'Improve our services',
      'Prevent fraud and unauthorized activities', 'Comply with legal requirements'
    ]
  },
  {
    title: '4. Sharing of Information',
    body: 'Recello does not sell your personal information.',
    intro: 'We may share information with:',
    items: ['Logistics and pickup partners', 'Payment service providers', 'Technology service providers', 'Government authorities when legally required']
  },
  {
    title: '5. Data Security',
    body: 'We implement reasonable security measures to protect personal information against unauthorized access, alteration, disclosure, or destruction.'
  },
  {
    title: '6. Data Retention',
    intro: 'We retain personal information only for as long as necessary to:',
    items: ['Complete transactions', 'Comply with legal obligations', 'Resolve disputes', 'Enforce agreements']
  },
  {
    title: '7. Cookies and Tracking Technologies',
    intro: 'Our website may use cookies and similar technologies to:',
    items: ['Improve user experience', 'Analyze website traffic', 'Remember user preferences', 'Enhance platform functionality']
  },
  {
    title: '8. Your Rights',
    intro: 'You may request:',
    items: ['Access to your personal information', 'Correction of inaccurate information', 'Deletion of eligible information', 'Withdrawal of consent where applicable'],
    footer: 'Requests may be subject to legal and operational requirements.'
  },
  {
    title: '9. Third-Party Links',
    body: 'Our website may contain links to third-party websites. Recello is not responsible for the privacy practices or content of such websites.'
  },
  {
    title: "10. Children's Privacy",
    body: 'Recello services are not intended for individuals under 18 years of age. We do not knowingly collect information from minors.'
  },
  {
    title: '11. Changes to this Privacy Policy',
    body: 'We may update this Privacy Policy from time to time. Any changes will be posted on our website with the revised effective date.'
  }
];

@Component({
  selector: 'rc-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
  standalone: false
})
export class PrivacyPolicyPage {
  readonly sections = PRIVACY_SECTIONS;

  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
