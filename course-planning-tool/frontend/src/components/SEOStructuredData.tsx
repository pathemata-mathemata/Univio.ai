export default function SEOStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://univio.ai/#website",
        "url": "https://univio.ai/",
        "name": "UniVio - AI-Powered Course Planning",
        "description": "Navigate your community college to university transfer journey with intelligent course planning, real-time requirements analysis, and personalized recommendations.",
        "publisher": {
          "@id": "https://univio.ai/#organization"
        },
        "inLanguage": "en-US"
      },
      {
        "@type": "Organization",
        "@id": "https://univio.ai/#organization",
        "name": "UniVio",
        "alternateName": "UniVio.ai",
        "url": "https://univio.ai/",
        "logo": {
          "@type": "ImageObject",
          "@id": "https://univio.ai/#logo",
          "url": "https://univio.ai/images/univio-logo.png",
          "contentUrl": "https://univio.ai/images/univio-logo.png",
          "width": 192,
          "height": 192,
          "caption": "UniVio Logo"
        },
        "image": {
          "@id": "https://univio.ai/#logo"
        },
        "description": "AI-powered course planning platform for community college students transferring to universities.",
        "foundingDate": "2024",
        "areaServed": "US",
        "serviceType": "Educational Technology",
        "knowsAbout": [
          "College Transfer",
          "Course Planning", 
          "Academic Advising",
          "University Requirements",
          "Community College",
          "ASSIST.org Integration"
        ]
      },
      {
        "@type": "WebApplication",
        "@id": "https://univio.ai/#webapp",
        "name": "UniVio Course Planning Platform",
        "url": "https://univio.ai/",
        "description": "AI-powered platform that helps community college students plan their transfer journey to universities with intelligent course recommendations and real-time requirements analysis.",
        "applicationCategory": "EducationalApplication",
        "operatingSystem": "Web Browser",
        "browserRequirements": "Modern web browser with JavaScript enabled",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        "featureList": [
          "AI-powered course recommendations",
          "Real-time transfer requirements analysis", 
          "ASSIST.org integration",
          "Personalized academic planning",
          "Progress tracking",
          "Deadline management"
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://univio.ai/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is UniVio?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "UniVio is an AI-powered course planning platform designed specifically for community college students planning to transfer to universities. It provides intelligent course recommendations, real-time requirements analysis, and personalized academic planning."
            }
          },
          {
            "@type": "Question", 
            "name": "How does UniVio help with college transfers?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "UniVio integrates with ASSIST.org to provide up-to-date transfer requirements, analyzes your academic progress, and recommends optimal course sequences to ensure successful university transfer."
            }
          }
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
} 