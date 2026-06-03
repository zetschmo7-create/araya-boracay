import type { ActiveLocale } from "@/app/lib/i18n/config";

export type UiCopy = {
  nav: {
    stewardship: string;
    arayaWay: string;
    ownership: string;
    connect: string;
    privateInquiry: string;
    home: string;
  };
  footer: {
    privacy: string;
    terms: string;
    cookies: string;
    rights: string;
  };
  legal: {
    backHome: string;
    lastUpdated: string;
    entityHeading: string;
    entityBody: string;
    questions: string;
  };
};

export const UI_COPY: Record<ActiveLocale, UiCopy> = {
  en: {
    nav: {
      stewardship: "Stewardship",
      arayaWay: "The ARAYA Way",
      ownership: "Ownership",
      connect: "Connect",
      privateInquiry: "Private Inquiry",
      home: "Home",
    },
    footer: {
      privacy: "Privacy",
      terms: "Terms",
      cookies: "Cookies",
      rights:
        "© {year} ARAYA Hospitality Management. Luxury villa & condo stewardship — Boracay Island, Philippines.",
    },
    legal: {
      backHome: "Return to ARAYA",
      lastUpdated: "Last updated",
      entityHeading: "Legal entity",
      entityBody:
        "Registered company name, Philippine SEC or DTI registration number, principal business address, and tax identification details will be published here upon formal incorporation and licensing of ARAYA hospitality management services.",
      questions:
        "For privacy or data enquiries, please contact us through the channels indicated on this website once our formal inquiry desk is live.",
    },
  },
  fil: {
    nav: {
      stewardship: "Pagpapatakbo",
      arayaWay: "Ang ARAYA",
      ownership: "Pagmamay-ari",
      connect: "Makipag-ugnayan",
      privateInquiry: "Pribadong Pagtatanong",
      home: "Home",
    },
    footer: {
      privacy: "Privacy",
      terms: "Terms",
      cookies: "Cookies",
      rights:
        "© {year} ARAYA Hospitality Management. Luxury villa at condo stewardship — Boracay Island, Pilipinas.",
    },
    legal: {
      backHome: "Bumalik sa ARAYA",
      lastUpdated: "Huling na-update",
      entityHeading: "Legal na entidad",
      entityBody:
        "Ang opisyal na pangalan ng kumpanya, numero ng rehistro sa SEC o DTI ng Pilipinas, pangunahing address ng negosyo, at mga detalye ng buwis ay ilalathala rito kapag na-formalize na ang incorporasyon at lisensya ng serbisyong pamamahala ng ARAYA.",
      questions:
        "Para sa mga katanungan tungkol sa privacy o datos, makipag-ugnayan sa amin sa pamamagitan ng mga channel na nakasaad sa website kapag aktibo na ang opisyal na inquiry desk.",
    },
  },
};
