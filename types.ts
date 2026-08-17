export type TrustStatus = 'verified' | 'pending' | 'unverified' | 'suspicious';

export interface VerificationSignal {
  id: string;
  name: string;
  category: 'Identity' | 'Mobile' | 'Device' | 'Consent' | 'Address' | 'Tax';
  status: TrustStatus;
  lastVerified: string;
  verifiedBy: string;
  cryptographicProofDemo: string;
  whatGetsShared: string;
  whatIsNeverStored: string;
  description: string;
}

export interface ConsentItem {
  id: string;
  category: 'Identity Verification' | 'Mobile Verification' | 'Device Verification' | 'Business Verification' | 'Account/Payment Status' | 'Government Verification';
  requesterName: string;
  requesterType: 'Bank' | 'Telecom' | 'Government' | 'Fintech' | 'Employer' | 'Platform';
  requesterLogo: string;
  purpose: string;
  requestedSignals: string[];
  dataReturned: string;
  status: 'active' | 'revoked';
  grantedDate: string;
  validUntil: string;
  lastAccessed: string;
  accessCount: number;
}

export interface Institution {
  id: string;
  name: string;
  category: 'Banking & Finance' | 'Telecom' | 'Government Portal' | 'Digital Payments' | 'Commercial & Housing';
  trustScore: number;
  status: TrustStatus;
  verifiedSince: string;
  description: string;
  logo: string;
  signalsBreakdown: {
    regulatory: string;
    domainBinding: string;
    securityAudit: string;
    operationalIntegrity: string;
  };
  demoContact: {
    email: string;
    phone: string;
    license: string;
    address: string;
  };
  isSuspicious?: boolean;
  warningNote?: string;
}

export interface MessageItem {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
  demoTrustVerified?: boolean;
}

export interface MessageThread {
  id: string;
  senderName: string;
  senderPhoneOrOrg: string;
  senderType: 'Institution' | 'Citizen' | 'Unverified Courier' | 'Suspicious Entity';
  status: TrustStatus;
  avatarText: string;
  avatarBg: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  verifiedReason: string;
  signals: string[];
  isSuspiciousAlert?: boolean;
  suspiciousWarning?: string;
  messages: MessageItem[];
}

export interface MailItem {
  id: string;
  fromName: string;
  fromEmail: string;
  subject: string;
  preview: string;
  body: string;
  date: string;
  status: TrustStatus;
  isSuspicious: boolean;
  suspiciousReason?: string;
  trustCertificateDemo: string;
  securityChecks: {
    dkim: boolean;
    spf: boolean;
    bharatTrustToken: boolean;
    domainMatch: boolean;
  };
  read: boolean;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  event: string;
  institution: string;
  category: string;
  statusBadge: string;
  actionType: 'verification' | 'consent_granted' | 'consent_revoked' | 'query' | 'security';
}

export interface TrustScoreFactor {
  id: string;
  name: string;
  category: string;
  currentPoints: number;
  maxPoints: number;
  status: 'active' | 'not_connected' | 'penalty';
  explanation: string;
  connected: boolean;
}

export type ActiveTab = 'home' | 'messages' | 'trust' | 'consents' | 'settings' | 'directory' | 'caller-id' | 'bharatmail';
